(function attachSpreadsheetParser(root) {
  "use strict";

  async function parseSpreadsheetFile(file) {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "csv") return parseCSV(await file.text());
    if (extension === "xlsx") return parseXlsx(await file.arrayBuffer());
    throw new Error("僅支援 CSV 或 XLSX 檔案");
  }

  function parseCSV(source) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;
    const text = source.replace(/^\uFEFF/, "");

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (char === '"' && quoted && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(field.trim());
        field = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(field.trim());
        if (row.some(value => value !== "")) rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }

    row.push(field.trim());
    if (row.some(value => value !== "")) rows.push(row);
    return rowsToResult(rows);
  }

  async function parseXlsx(buffer) {
    const entries = await readZipEntries(buffer);
    const worksheetName = [...entries.keys()]
      .filter(name => /^xl\/worksheets\/sheet\d+\.xml$/.test(name))
      .sort((left, right) => sheetNumber(left) - sheetNumber(right))[0];
    if (!worksheetName) throw new Error("找不到 Excel 工作表");

    const sharedXml = entries.get("xl/sharedStrings.xml");
    const sharedStrings = sharedXml ? parseSharedStrings(sharedXml) : [];
    return rowsToResult(parseWorksheet(entries.get(worksheetName) || "", sharedStrings));
  }

  async function readZipEntries(buffer) {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    let eocdOffset = -1;

    for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset -= 1) {
      if (view.getUint32(offset, true) === 0x06054b50) {
        eocdOffset = offset;
        break;
      }
    }
    if (eocdOffset < 0) throw new Error("無法讀取 XLSX 壓縮內容");

    const entryCount = view.getUint16(eocdOffset + 10, true);
    let directoryOffset = view.getUint32(eocdOffset + 16, true);
    const decoder = new TextDecoder("utf-8");
    const output = new Map();

    for (let entry = 0; entry < entryCount; entry += 1) {
      if (view.getUint32(directoryOffset, true) !== 0x02014b50) break;
      const method = view.getUint16(directoryOffset + 10, true);
      const compressedSize = view.getUint32(directoryOffset + 20, true);
      const nameLength = view.getUint16(directoryOffset + 28, true);
      const extraLength = view.getUint16(directoryOffset + 30, true);
      const commentLength = view.getUint16(directoryOffset + 32, true);
      const localOffset = view.getUint32(directoryOffset + 42, true);
      const name = decoder.decode(bytes.slice(directoryOffset + 46, directoryOffset + 46 + nameLength));

      if (name === "xl/sharedStrings.xml" || /^xl\/worksheets\/sheet\d+\.xml$/.test(name)) {
        const localNameLength = view.getUint16(localOffset + 26, true);
        const localExtraLength = view.getUint16(localOffset + 28, true);
        const dataStart = localOffset + 30 + localNameLength + localExtraLength;
        const compressed = bytes.slice(dataStart, dataStart + compressedSize);
        let content;
        if (method === 0) {
          content = compressed;
        } else if (method === 8) {
          if (typeof DecompressionStream === "undefined") {
            throw new Error("此瀏覽器無法解壓縮 XLSX，請更新瀏覽器或改用 CSV");
          }
          const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
          content = new Uint8Array(await new Response(stream).arrayBuffer());
        } else {
          throw new Error(`不支援 XLSX 壓縮格式 ${method}`);
        }
        output.set(name, decoder.decode(content));
      }
      directoryOffset += 46 + nameLength + extraLength + commentLength;
    }
    return output;
  }

  function parseSharedStrings(xml) {
    return [...xml.matchAll(/<(?:[A-Za-z0-9_]+:)?si\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?si>/g)].map(match =>
      [...match[1].matchAll(/<(?:[A-Za-z0-9_]+:)?t\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?t>/g)]
        .map(text => decodeXml(text[1]))
        .join("")
    );
  }

  function parseWorksheet(xml, sharedStrings) {
    const rows = [];
    for (const rowMatch of xml.matchAll(/<(?:[A-Za-z0-9_]+:)?row\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?row>/g)) {
      const row = [];
      for (const cellMatch of rowMatch[1].matchAll(/<(?:[A-Za-z0-9_]+:)?c\b([^>]*)>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?c>/g)) {
        const attributes = cellMatch[1];
        const body = cellMatch[2];
        const reference = /\br="([A-Z]+)\d+"/.exec(attributes)?.[1] || "A";
        const type = /\bt="([^"]+)"/.exec(attributes)?.[1] || "";
        const raw = /<(?:[A-Za-z0-9_]+:)?v\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?v>/.exec(body)?.[1] || "";
        const inline = [...body.matchAll(/<(?:[A-Za-z0-9_]+:)?t\b[^>]*>([\s\S]*?)<\/(?:[A-Za-z0-9_]+:)?t>/g)]
          .map(item => decodeXml(item[1]))
          .join("");
        const value = type === "s" ? sharedStrings[Number(raw)] || "" : inline || decodeXml(raw);
        row[columnToIndex(reference)] = value.trim();
      }
      if (row.some(value => value !== undefined && value !== "")) rows.push(row);
    }
    return rows;
  }

  function rowsToResult(rows) {
    if (!rows.length) return { headers: [], records: [] };
    const headers = rows[0].map((header, index) => String(header || "").replace(/^\uFEFF/, "").trim() || `欄位${index + 1}`);
    const records = rows.slice(1)
      .map(values => Object.fromEntries(headers.map((header, index) => [header, String(values[index] ?? "").trim()])))
      .filter(item => Object.values(item).some(value => value !== ""));
    return { headers, records };
  }

  function columnToIndex(column) {
    let value = 0;
    for (let index = 0; index < column.length; index += 1) value = value * 26 + column.charCodeAt(index) - 64;
    return value - 1;
  }

  function sheetNumber(name) {
    return Number(/sheet(\d+)\.xml$/.exec(name)?.[1] || Number.MAX_SAFE_INTEGER);
  }

  function decodeXml(value) {
    return value
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
      .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
  }

  root.SpreadsheetParser = { parseSpreadsheetFile, parseCSV, parseXlsx };
})(globalThis);
