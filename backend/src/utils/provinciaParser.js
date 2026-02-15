// Función para parsear el texto plano que nos devuelve el endpoint a JSON
export function parseAemetProvinciaPrediction(rawText) {
  if (typeof rawText !== "string") {
    throw new TypeError(`rawText debe ser string, recibido: ${typeof rawText}`);
  }

  // Normaliza saltos de línea y espacios
  const text = rawText
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Helpers
  const clean = (s) => (s ? s.replace(/\s+/g, " ").trim() : null);

  // 1) Título principal / zona (ej: "LA ISLA DE LA GOMERA" o "LA GOMERA")
  // - Primero intentamos "PREDICCIÓN PARA ..."
  const zonaMatch =
    text.match(/PREDICCIÓN\s+PARA\s+(.+?)\n/i) ||
    text.match(/PREDICCIÓN\s+PARA\s+(.+?)\s+D[ÍI]A\s+/i);

  const zona = zonaMatch ? clean(zonaMatch[1]) : null;

  // 2) Fecha y hora de elaboración
  const fechaHoraMatch = text.match(
    /D[ÍI]A\s+(.+?)\s+A\s+LAS\s+([0-9]{2}:[0-9]{2})/i
  );
  const fecha = fechaHoraMatch ? clean(fechaHoraMatch[1]) : null;
  const hora = fechaHoraMatch ? clean(fechaHoraMatch[2]) : null;

  // 3) Validez
  const validaMatch = text.match(/PREDICCIÓN\s+VÁLIDA\s+PARA\s+EL\s+(.+)/i);
  const validaPara = validaMatch ? clean(validaMatch[1]) : null;

  // 4) Bloque de predicción (texto largo)
  // Normalmente viene después de una línea con el nombre de la zona (ej: "LA GOMERA")
  // y termina antes de "TEMPERATURAS MÍNIMAS..."
  const tempHeader = "TEMPERATURAS MÍNIMAS Y MÁXIMAS PREVISTAS";
  const beforeTemps = text.includes(tempHeader) ? text.split(tempHeader)[0] : text;

  // Intento: coger el párrafo grande después de una línea en mayúsculas (LA GOMERA)
  const lines = beforeTemps.split("\n").map((l) => l.trim());

  // Busca la línea tipo "LA GOMERA" (mayúsculas) y coge el texto posterior
  let prediccionTexto = null;
  const idxZonaLinea = lines.findIndex(
    (l) =>
      l &&
      l === l.toUpperCase() &&
      l.length >= 3 &&
      !l.startsWith("AGENCIA ESTATAL") &&
      !l.startsWith("PREDICCIÓN") &&
      !l.startsWith("DÍA") &&
      !l.startsWith("PREDICCION") // por si viene sin tilde
  );

  if (idxZonaLinea !== -1) {
    prediccionTexto = clean(lines.slice(idxZonaLinea + 1).join(" "));
  } else {
    // fallback: si no encontramos esa línea, intenta extraer desde "B.-" o desde después de "PREDICCIÓN VÁLIDA..."
    const afterValidez = text.split(/PREDICCIÓN\s+VÁLIDA\s+PARA\s+EL\s+.+\n\n/i)[1];
    prediccionTexto = clean(afterValidez);
    if (prediccionTexto && text.includes(tempHeader)) {
      prediccionTexto = clean(prediccionTexto.split(tempHeader)[0]);
    }
  }

  // 5) Tabla de temperaturas (si existe)
  // Formato típico:
  // San Sebastián de la Gomera    16  21
  const temperaturas = [];
  if (text.includes(tempHeader)) {
    const after = text.split(tempHeader)[1] ?? "";
    const block = after
      .replace(/\(°C\)\s*:/i, "")
      .replace(/\n+/g, "\n")
      .trim();

    const tempLines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    for (const line of tempLines) {
      // provincia + espacios + min + espacios + max
      const m = line.match(/^(.+?)\s+(-?\d+)\s+(-?\d+)$/);
      if (!m) continue;
      temperaturas.push({
        localidad: clean(m[1]),
        min: Number(m[2]),
        max: Number(m[3]),
      });
    }
  }

  return {
    zona,
    fecha,
    hora,
    validaPara,
    prediccion: prediccionTexto, // texto largo (string)
    temperaturas,                // array [{localidad,min,max}]
    fuente: "AEMET",
  };
}
