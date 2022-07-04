/**
 * Typology types syntax:
 */
export type TypologyType = StringType | ArrayType | ObjectType | CustomValidator;

export type StringType = string;

export type ArrayType = [TypologyType];

export interface ObjectType {
  [key: string]: TypologyType;
}

export type CustomValidator = (v: unknown) => boolean;

/**
 * Typology reports:
 */
export interface Report {
  expected: TypologyType;
  type: StringType;
  value: unknown;
  error?: string;
  path?: (string | number)[];
  nully?: boolean;
}

/**
 * Public API:
 */
export interface Typology<Type = TypologyType> {
  // Constructor:
  new <T = TypologyType>(types?: Record<string, T>): Typology<T>;

  // Class methods / "static" methods:
  check(type: Type, value: unknown): boolean;

  scan(type: Type, value: unknown): Report;

  get(value: any): string;

  add(typeId: string, type: Type): this;
  add(typeDefinition: { id: string; type: TypologyType; proto?: string[] }): this;

  has(typeId: string): boolean;

  isValid(type: unknown): boolean;

  // Static properties:
  version: string;
}

declare const types: Typology<TypologyType>;
export default types;
