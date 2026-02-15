// Función para parsear el texto plano que nos devuelve el endpoint a JSON
export function parseAemetCcaaPrediction(rawText) {
  if (typeof rawText !== "string") {
    throw new TypeError(`rawText debe ser string, recibido: ${typeof rawText}`);
  }

  // 1. Normalizar texto
  const text = rawText
    .replace(/\r/g, "")
    .replace(/\n+/g, "\n")
    .trim();

  // 2. Extraer metadatos básicos
  const ccaaMatch = text.match(/COMUNIDAD\s+DE\s+(?:LA\s+|EL\s+|LOS\s+|LAS\s+)?(.+)/i);
  const fechaMatch = text.match(/D[ÍI]A\s+(.+?)\s+A\s+LAS\s+([0-9]{2}:[0-9]{2})/i);
  const validaMatch = text.match(/PREDICCIÓN\s+VÁLIDA\s+PARA\s+EL\s+(.+)/i);

  const ccaa = ccaaMatch ? ccaaMatch[1].trim() : null;
  const fecha = fechaMatch ? fechaMatch[1].trim() : null;
  const hora = fechaMatch ? fechaMatch[2].trim() : null;
  const validaPara = validaMatch ? validaMatch[1].trim() : null;

  // 3. Separar secciones A y B
  const partes = text.split(/B\.\-\s*PREDICCIÓN/i);
  const aSplit = partes[0].split(/A\.\-\s*FENÓMENOS\s+SIGNIFICATIVOS/i);
  const fenomenosRaw = aSplit[1] ?? "";     // lo que viene después del título A.-
  const prediccionRaw = partes[1] ?? "";    // lo que viene después del título B.-


  // 4. Convertir texto → arrays
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
    fuente: "AEMET"
  };
}
