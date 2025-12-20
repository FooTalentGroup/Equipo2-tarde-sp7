/**
 * Tipos para parámetros SQL de PostgreSQL
 * Estos tipos representan los valores que pueden ser pasados como parámetros a queries SQL
 */
export type SqlValue = string | number | boolean | Date | null | undefined;
export type SqlParams = SqlValue[];
