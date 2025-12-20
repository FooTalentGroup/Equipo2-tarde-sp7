/**
 * Tipos para datos JSON dinámicos
 * Útil para datos JSONB de PostgreSQL o datos sin estructura fija
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface JsonObject {
	[key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}
