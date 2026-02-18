export function parseAemetCcaaPrediction(rawText) {
  if (typeof rawText !== "string") {
    throw new TypeError(`rawText debe ser string, recibido: ${typeof rawText}`);
  }

  // 1. Normalizar texto
  const text = rawText
    .replace(/\r/g, "")
    .replace(/\n+/g, "\n")
    .trim();

  // Versión en una sola línea (para regex robustas)
  const oneLine = text.replace(/\n/g, " ");

  // 2. Extraer metadatos básicos
  const ccaaMatch =
    oneLine.match(/PREDICCI[ÓO]N\s+GENERAL\s+PARA\s+LA\s+COMUNIDAD\s+DEL\s+(.+?)(?=\s+D[ÍI]A\s+|\s*$)/i) ||
    oneLine.match(/PREDICCI[ÓO]N\s+GENERAL\s+PARA\s+LA\s+COMUNIDAD\s+DE\s+(.+?)(?=\s+D[ÍI]A\s+|\s*$)/i) ||
    oneLine.match(/PREDICCI[ÓO]N\s+GENERAL\s+PARA\s+LA\s+REGI[ÓO]N\s+DE\s+(.+?)(?=\s+D[ÍI]A\s+|\s*$)/i);


  const fechaMatch = oneLine.match(
    /D[ÍI]A\s+(.+?)\s+A\s+LAS\s+([0-9]{2}:[0-9]{2})/i
  );

  const validaMatch = oneLine.match(
    /PREDICCI[ÓO]N\s+V[ÁA]LIDA\s+PARA\s+EL\s+(.+?)(?=\s+A\.\-|\s*$)/i
  );

  const ccaa = ccaaMatch ? ccaaMatch[1].trim() : null;
  const fecha = fechaMatch ? fechaMatch[1].trim() : null;
  const hora = fechaMatch ? fechaMatch[2].trim() : null;
  const validaPara = validaMatch ? validaMatch[1].trim() : null;

  // 3. Separar secciones A y B (esto sí lo dejamos con saltos)
  const partes = text.split(/B\.\-\s*PREDICCI[ÓO]N/i);
  const aSplit = partes[0].split(/A\.\-\s*FEN[ÓO]MENOS\s+SIGNIFICATIVOS/i);

  const fenomenosRaw = aSplit[1] ?? "";
  const prediccionRaw = partes[1] ?? "";

  // 4. Convertir texto → arrays (por líneas)
  const toArray = (block) =>
    String(block)              // convierte undefined/null a "undefined"/"null" pero no rompe
      .replace(/\n/g, " ")
      .split(".")
      .map((t) => t.trim())
      .filter((t) => t.length > 5);

  const fenomenos = toArray(fenomenosRaw);
  const prediccion = toArray(prediccionRaw);

  return {
    ccaa,
    fecha,
    hora,
    validaPara,
    fenomenos,
    prediccion,
    fuente: "AEMET",
  };
}
