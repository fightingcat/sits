type WhiteSpaces = " " | "\t" | "\n" | "\r";

type Keywords =
  | ("if" | "else" | "do" | "while" | "for" | "in")
  | ("function" | "var" | "break" | "continue" | "return")
  | ("undefined" | "null" | "true" | "false" | "NaN" | "Infinity");

type Punctuations1 =
  | ("(" | ")" | "[" | "]" | "{" | "}" | "." | "," | "?" | ":")
  | (";" | "*" | "/" | "%" | "+" | "-" | "=" | "!" | "<" | ">");

type Punctuations2 =
  | ("++" | "+=" | "--" | "-=" | "==" | "!=" | "<=" | ">=")
  | ("&&" | "||");

type Quote = "'" | '"';

type Digits = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Alphabets =
  | ("a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m")
  | ("n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z");

type IdentifierStart = Alphabets | Uppercase<Alphabets> | "_" | "$";

type IdentifierPart = IdentifierStart | Digits;

// TODO: escape null characters.
export type EscapeNull<S extends string> = S;

// TODO: unescape null characters.
export type UnescapeNull<S extends string> = S;

export type ScanResult<
  Source extends string,
  Kind extends string,
  Text extends string = Kind,
> = { 0: Source; 1: Kind; 2: Text };

export type Scan<Source extends string> = //
  Source extends `${WhiteSpaces}${infer Source}`
    ? Scan<Source>
    : Source extends `//${string}`
    ? ScanSinglineComment<Source>
    : Source extends `${Punctuations2}${string}`
    ? ScanPunctuation2<Source>
    : Source extends `${Punctuations1}${string}`
    ? ScanPunctuation1<Source>
    : Source extends `${IdentifierStart}${string}`
    ? Source extends `${infer Start}${infer Source}`
      ? ScanIdentifier<Source, Start>
      : never
    : Source extends `${Digits}${string}`
    ? ScanNumber<Source, "">
    : Source extends `${Quote}${string}`
    ? ScanString<Source>
    : Source extends ""
    ? ScanResult<"", "EOF", "">
    : ScanUnknown<Source>;

type ScanSinglineComment<Source extends string> =
  Source extends `//${infer Comment}\n${infer Source}`
    ? ScanResult<Source, "comment", Comment>
    : never;

type ScanPunctuation1<Source extends string> =
  Source extends `${infer Char1}${infer Source}`
    ? ScanResult<Source, Char1, Char1>
    : never;

type ScanPunctuation2<Source extends string> =
  Source extends `${infer Char1}${infer Char2}${infer Source}`
    ? ScanResult<Source, `${Char1}${Char2}`>
    : never;

type ScanIdentifier<
  Source extends string,
  Result extends string,
> = Source extends `${IdentifierPart}${string}`
  ? Source extends `${infer Char}${infer Source}`
    ? ScanIdentifier<Source, `${Result}${Char}`>
    : never
  : Result extends Keywords
  ? ScanResult<Source, Result, Result>
  : ScanResult<Source, "identifier", Result>;

type ScanNumber<
  Source extends string,
  Result extends string,
> = Source extends `${Digits}${string}`
  ? Source extends `${infer Char}${infer Source}`
    ? ScanNumber<Source, `${Result}${Char}`>
    : never
  : Source extends `.${infer Source}`
  ? ScanFractional<Source, `${Result}.`>
  : ScanResult<Source, "number", Result>;

type ScanFractional<
  Source extends string,
  Result extends string,
> = Source extends `${Digits}${string}`
  ? Source extends `${infer Char}${infer Source}`
    ? ScanFractional<Source, `${Result}${Char}`>
    : never
  : ScanResult<Source, "number", Result>;

type ScanString<Source extends string> = Source extends
  | `"${infer String}"${infer Source}`
  | `'${infer String}'${infer Source}`
  ? ScanResult<Source, "string", EscapeNull<String>>
  : ScanResult<Source, "string_error", "">;

type ScanUnknown<Source extends string> = Source extends `${infer Char}${infer Source}`
  ? ScanResult<Source, "unknown", Char>
  : never;
