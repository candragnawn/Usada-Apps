/**
 * Robust JSON parser that handles:
 * 1. Stringified JSON (recursively if double-encoded)
 * 2. Hidden control characters that break JSON.parse
 * 3. Pre-parsed objects
 */
/**
 * Attempts to salvage a truncated JSON string by closing open quotes and brackets.
 */
const salvageTruncatedJson = (jsonStr: string): string => {
  if (!jsonStr) return jsonStr;
  let trimmed = jsonStr.trim();
  
  // Basic stack-based bracket closer
  let stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (escaped) { escaped = false; continue; }
    if (char === '\\') { escaped = true; continue; }
    if (char === '"') { inString = !inString; continue; }
    if (!inString) {
      if (char === '{' || char === '[') stack.push(char);
      if (char === '}' || char === ']') stack.pop();
    }
  }

  let repaired = trimmed;
  if (inString) repaired += '"';
  
  // Clean up trailing commas which are common in truncations: [{}, { "id": 1, 
  repaired = repaired.replace(/,\s*$/, '');

  while (stack.length > 0) {
    const last = stack.pop();
    if (last === '{') repaired += '}';
    if (last === '[') repaired += ']';
  }

  return repaired;
};

/**
 * Robust JSON parser that handles:
 * 1. Stringified JSON (recursively if double-encoded)
 * 2. Hidden control characters that break JSON.parse
 * 3. Truncated JSON (salvage attempt)
 * 4. Pre-parsed objects
 */
export const robustJsonParse = (data: any, depth = 0): any => {
  if (data === null || data === undefined) return data;
  if (depth > 5) return data; // Increased depth for extra safety

  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (trimmed.length === 0) return data;

    // If it looks like JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return robustJsonParse(parsed, depth + 1);
      } catch (e) {
        // First try: Cleaning control characters
        const cleaned = trimmed.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
        try {
          const secondParsed = JSON.parse(cleaned);
          return robustJsonParse(secondParsed, depth + 1);
        } catch (e2) {
          // Second try: Salvage truncated JSON
          console.warn(`📡 robustJsonParse: Attempting salvage on truncated JSON (depth ${depth})`);
          const salvaged = salvageTruncatedJson(cleaned);
          try {
            const thirdParsed = JSON.parse(salvaged);
            return robustJsonParse(thirdParsed, depth + 1);
          } catch (e3) {
            // Final fallback
            return data;
          }
        }
      }
    }
  }
  return data;
};
