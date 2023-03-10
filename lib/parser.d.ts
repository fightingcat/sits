import {
  ImitatedSet,
  ImitatedSetAdd,
  ImitatedSetFind,
  ImitatedSetNew,
  ReplaceAll,
} from "./helpers";
import { Scan } from "./lexer";
import { Incr, IncrU8 } from "./math";

export type Parse<Source extends string> = //br
  ParseImpl<Source, List<0>, List<"">, [], ImitatedSetNew, "0", 0>;

type Throw<Error, Source, States, Output> = {
  error: Error;
  source: Source;
  states: States;
  output: Output;
};

type List<T, P = any> = { 0: T; 1: P };

type STRSet = ImitatedSet<string>;

type GetStringId<ROData extends STRSet, String extends string> = ImitatedSetFind<
  ROData,
  String
> extends ""
  ? ROData["size"]
  : ImitatedSetFind<ROData, String>;

type EmitFunction<
  Chunks extends string[],
  Code extends string,
  Ident extends string = "",
> = [...Chunks, PatchFunction<BindIdentifier<Code, Ident>>];

type BindIdentifier<Code extends string, Ident extends string> = Ident extends ""
  ? Code
  : `add_local ${Ident};set_callee ${Ident};${Code}`;

type PatchFunction<Code extends string> = PatchGetLocalAndSetLocal<
  HoistAddLocal<HoistSetFnLocal<Code>>[0],
  HoistAddLocal<HoistSetFnLocal<Code>>[1]
>;

type HoistSetFnLocal<
  Code extends string,
  Output extends string = "",
> = Code extends `${infer L}new_closure ${infer F};set_fn_local ${infer X};${infer R}`
  ? HoistSetFnLocal<R, `new_closure ${F};set_local ${X};${Output}${L}`>
  : `${Output}${Code}`;

type HoistAddLocal<
  Code extends string,
  Output extends string = "",
  Hoisted extends string = never,
> = Code extends `${infer L}add_local ${infer X};${infer R}`
  ? HoistAddLocal<
      R,
      `${X extends Hoisted ? "" : `add_local ${X};`}${Output}${L}`,
      Hoisted | X
    >
  : [`${Output}${Code}`, Hoisted];

type PatchGetLocalAndSetLocal<Code extends string, Locals extends string> = PatchGetLocal<
  PatchSetLocal<Code, Locals>,
  Locals
>;

type PatchGetLocal<
  Code extends string,
  Locals extends string,
  Output extends string = "",
> = Code extends `${infer L}get_local ${infer X};${infer R}`
  ? PatchGetLocal<
      R,
      Locals,
      `${Output}${L}${X extends Locals ? "get_local" : "get_upval"} ${X};`
    >
  : `${Output}${Code}`;

type PatchSetLocal<
  Code extends string,
  Locals extends string,
  Output extends string = "",
> = Code extends `${infer L}set_local ${infer X};${infer R}`
  ? PatchSetLocal<
      R,
      Locals,
      `${Output}${L}${X extends Locals ? "set_local" : "set_upval"} ${X};`
    >
  : `${Output}${Code}`;

type ResolveLabel<
  Code extends string,
  Label extends string,
  Start extends string,
  End extends string,
> = ReplaceAll<
  ReplaceAll<Code, "break;" | `break ${Label};`, `goto ${End};`>,
  "continue;" | `continue ${Label};`,
  `goto ${Start};`
>;

type Union0 =
  | ("!" | "(" | "+" | "++" | "-" | "--" | ";" | "EOF" | "Infinity" | "NaN" | "[")
  | ("break" | "comment" | "continue" | "false" | "for" | "function")
  | ("identifier" | "if" | "null" | "number" | "return" | "string" | "true")
  | ("undefined" | "var" | "while" | "{");

type Union1 = "StatementList";

type Union2 =
  | ("!" | "(" | "+" | "++" | "-" | "--" | ";" | "EOF" | "Infinity" | "NaN" | "[")
  | ("break" | "comment" | "continue" | "false" | "for" | "function")
  | ("identifier" | "if" | "null" | "number" | "return" | "string" | "true")
  | ("undefined" | "var" | "while" | "{" | "}");

type Union3 =
  | ("!" | "(" | "+" | "++" | "-" | "--" | ";" | "EOF" | "Infinity" | "NaN" | "[")
  | ("break" | "comment" | "continue" | "else" | "false" | "for" | "function")
  | ("identifier" | "if" | "null" | "number" | "return" | "string" | "true")
  | ("undefined" | "var" | "while" | "{" | "}");

type Union4 =
  | ("!" | "(" | "+" | "++" | "-" | "--" | ";" | "Infinity" | "NaN" | "[" | "break")
  | ("comment" | "continue" | "false" | "for" | "function" | "identifier")
  | ("if" | "null" | "number" | "return" | "string" | "true" | "undefined")
  | ("var" | "while" | "{" | "}");

type Union5 = "identifier";

type Union6 = "VariableDeclaration";

type Union7 = "VariableList";

type Union8 = "," | ";";

type Union9 = "(";

type Union10 = "!" | "+" | "-";

type Union11 = "Infinity" | "NaN" | "false" | "null" | "true" | "undefined";

type Union12 = "number";

type Union13 = "string";

type Union14 = "[";

type Union15 = "++" | "--";

type Union16 = "function";

type Union17 = "{";

type Union18 = "FunctionExpression";

type Union19 = "ObjectLiteral";

type Union20 = "Expression";

type Union21 = "PropertyReference";

type Union22 = "FunctionImpl";

type Union23 =
  | ("!" | "!=" | "%" | "&&" | "(" | ")" | "*" | "+" | "++" | "," | "-" | "--" | ".")
  | ("/" | ":" | ";" | "<" | "<=" | "==" | ">" | ">=" | "?" | "EOF" | "Infinity")
  | ("NaN" | "[" | "]" | "break" | "comment" | "continue" | "else" | "false")
  | ("for" | "function" | "identifier" | "if" | "null" | "number" | "return")
  | ("string" | "true" | "undefined" | "var" | "while" | "{" | "||" | "}");

type Union24 = ")";

type Union25 = ")" | ",";

type Union26 = "EOF" | "comment" | "else" | "for" | "while" | "}";

type Union27 = ";";

type Union28 = "var";

type Union29 = "if";

type Union30 = "break";

type Union31 = "continue";

type Union32 = "return";

type Union33 = "Statement";

type Union34 = "Label";

type Union35 = "CommaExpression";

type Union36 = "ForInit";

type Union37 = "ForExpr";

type Union38 =
  | ("!=" | "%" | "&&" | "(" | ")" | "*" | "+" | "," | "-" | "." | "/" | ":" | ";")
  | ("<" | "<=" | "==" | ">" | ">=" | "?" | "[" | "]" | "||" | "}");

type Union39 =
  | ("!=" | "%" | "%=" | "&&" | "(" | ")" | "*" | "*=" | "+" | "++" | "+=" | ",")
  | ("-" | "--" | "-=" | "." | "/" | "/=" | ":" | ";" | "<" | "<=" | "=" | "==" | ">")
  | (">=" | "?" | "[" | "]" | "||" | "}");

type Union40 = "}";

type Union41 = "," | "}";

type Union42 = ":";

type Union43 = "]";

type Union44 = "Arguments";

type Union45 = "ArgumentList";

type Union46 = ")" | "]";

type Union47 = "EOF";

type Union48 =
  | ("!" | "(" | "+" | "++" | "-" | "--" | ";" | "EOF" | "Infinity" | "NaN" | "[")
  | ("break" | "continue" | "false" | "for" | "function" | "identifier" | "if")
  | ("null" | "number" | "return" | "string" | "true" | "undefined" | "var")
  | ("while" | "{");

type Union49 = "comment";

type Union50 = "Comments";

type Union51 = "EOF" | "for" | "while" | "}";

type Union52 =
  | ("!=" | "%" | "&&" | "(" | "*" | "+" | "," | "-" | "." | "/" | ";" | "<" | "<=")
  | ("==" | ">" | ">=" | "?" | "[" | "||");

type Union53 = "=";

type Union54 = "%=" | "*=" | "+=" | "-=" | "/=";

type Union55 = "EOF" | "comment" | "else" | "}";

type Union56 = "while";

type Union57 = "for";

type Union58 = ",";

type Union59 = ")" | "," | ";";

type Union60 = "?";

type Union61 = "||";

type Union62 = "&&";

type Union63 = "!=" | "==";

type Union64 = "<" | "<=" | ">" | ">=";

type Union65 = "+" | "-";

type Union66 = "%" | "*" | "/";

type Union67 = ".";

type Union68 =
  | ("!" | "(" | "+" | "++" | "-" | "--" | ";" | "Infinity" | "NaN" | "[" | "break")
  | ("continue" | "false" | "for" | "function" | "identifier" | "if" | "null")
  | ("number" | "return" | "string" | "true" | "undefined" | "var" | "while")
  | "{";

type Union69 = "Property";

type Union70 = "PropertyList";

type Union71 =
  | ("!=" | "%" | "&&" | ")" | "*" | "+" | "," | "-" | "/" | ":" | ";" | "<" | "<=")
  | ("==" | ">" | ">=" | "?" | "]" | "||" | "}");

type Union72 =
  | ("!=" | "%" | "&&" | "(" | "*" | "+" | "-" | "." | "/" | "<" | "<=" | "==" | ">")
  | (">=" | "?" | "[" | "||");

type Union73 = ")" | "," | "]";

type Union74 = "TrailingComma";

type Union75 =
  | ("!=" | "%" | ")" | "*" | "+" | "," | "-" | "/" | ":" | ";" | "<" | "<=" | "==")
  | (">" | ">=" | "]" | "}");

type Union76 = "Parameters";

type Union77 =
  | ("!=" | "%" | ")" | "*" | "+" | "," | "-" | "/" | ":" | ";" | "<" | "<=" | "==")
  | (">" | ">=" | "?" | "]" | "||" | "}");

type Union78 = "else";

type Union79 = ")" | ";";

type Drop2<T extends List<any>> = T[1][1];

type Drop3<T extends List<any>> = T[1][1][1];

type Drop1<T extends List<any>> = T[1];

type Drop5<T extends List<any>> = T[1][1][1][1][1];

type Drop7<T extends List<any>> = T[1][1][1][1][1][1][1];

type Drop4<T extends List<any>> = T[1][1][1][1];

type Drop6<T extends List<any>> = T[1][1][1][1][1][1];

type Drop9<T extends List<any>> = T[1][1][1][1][1][1][1][1][1];

type Drop10<T extends List<any>> = T[1][1][1][1][1][1][1][1][1][1];

type ParseImpl<
  Source extends string,
  States extends List<number>,
  Output extends List<string>,
  Chunks extends string[],
  ROData extends STRSet,
  UniqId extends string,
  Counter extends IncrU8[number],
> = Counter extends 255
  ? NonNullable<ParseImpl<Source, States, Output, Chunks, ROData, UniqId, 0>>
  : States[0] extends 0
  ? Scan<Source>[1] extends Union0
    ? ParseImpl<
        Source,
        List<1, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 2
  ? Scan<Source>[1] extends Union2
    ? ParseGoto<
        Source,
        "StatementList",
        Drop3<States>,
        List<`${Drop2<Output>[0]}${Output[0]}`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 3
  ? Scan<Source>[1] extends Union2
    ? ParseGoto<
        Source,
        "Comments",
        Drop1<States>,
        List<``, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 4
  ? Scan<Source>[1] extends Union2
    ? ParseGoto<
        Source,
        "Comments",
        Drop2<States>,
        List<``, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 5
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Label",
        Drop2<States>,
        List<`${Drop1<Output>[0]}`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 6
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop2<States>,
        List<``, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 7
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop1<States>,
        List<``, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 8
  ? Scan<Source>[1] extends Union4
    ? ParseImpl<
        Source,
        List<9, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 10
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop3<States>,
        List<`${HoistSetFnLocal<Drop1<Output>[0]>}`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 11
  ? Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<12, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 15
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop3<States>,
        List<`${Drop1<Output>[0]}`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 13
  ? Scan<Source>[1] extends Union8
    ? ParseGoto<
        Source,
        "VariableList",
        Drop1<States>,
        List<`${Output[0]}`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 16
  ? Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<12, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 17
  ? Scan<Source>[1] extends Union8
    ? ParseGoto<
        Source,
        "VariableList",
        Drop3<States>,
        List<`${Drop2<Output>[0]}${Output[0]}`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 18
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 33
  ? Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<34, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 34
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<35, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 36
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop3<States>,
        List<
          `add_local ${Drop1<Output>[0]};new_closure ${Chunks["length"]};set_fn_local ${Drop1<Output>[0]};`,
          Drop3<Output>
        >,
        EmitFunction<Chunks, Output[0]>,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 37
  ? Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<38, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 38
  ? Scan<Source>[1] extends Union4
    ? ParseImpl<
        Source,
        List<39, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 40
  ? Scan<Source>[1] extends Union23
    ? ParseGoto<
        Source,
        "FunctionImpl",
        Drop5<States>,
        List<`${Drop1<Output>[0]}return_undef;`, Drop5<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 41
  ? Scan<Source>[1] extends Union24
    ? ParseImpl<
        Scan<Source>[0],
        List<42, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 42
  ? Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<43, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 43
  ? Scan<Source>[1] extends Union4
    ? ParseImpl<
        Source,
        List<44, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 45
  ? Scan<Source>[1] extends Union23
    ? ParseGoto<
        Source,
        "FunctionImpl",
        Drop7<States>,
        List<`${Drop5<Output>[0]}${Drop1<Output>[0]}return_undef;`, Drop7<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 46
  ? Scan<Source>[1] extends Union25
    ? ParseGoto<
        Source,
        "Parameters",
        Drop1<States>,
        List<`add_local ${Output[0]};set_param ${Output[0]};`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 47
  ? Scan<Source>[1] extends Union25
    ? ParseGoto<
        Source,
        "Parameters",
        Drop3<States>,
        List<
          `${Drop2<Output>[0]}add_local ${Output[0]};set_param ${Output[0]};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 48
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<7, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<8, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        List<11, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<33, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<50, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        List<51, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        List<52, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        List<53, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        List<54, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union26
    ? ParseImpl<
        Source,
        List<49, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 55
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop7<States>,
        List<
          `${Drop4<Output>[0]}test ${Incr<UniqId>};${Drop2<Output>[0]}goto ${Incr<
            Incr<UniqId>
          >};label ${Incr<UniqId>};${Output[0]}label ${Incr<Incr<UniqId>>};`,
          Drop7<Output>
        >,
        Chunks,
        ROData,
        Incr<Incr<UniqId>>,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 58
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<59, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 59
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 61
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<7, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<8, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        List<11, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<33, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<50, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        List<51, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        List<52, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        List<53, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        List<54, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union26
    ? ParseImpl<
        Source,
        List<49, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 62
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop6<States>,
        List<
          `label ${Incr<UniqId>};${Drop2<Output>[0]}test ${Incr<
            Incr<UniqId>
          >};${ResolveLabel<
            Output[0],
            Drop5<Output>[0],
            Incr<UniqId>,
            Incr<Incr<UniqId>>
          >}goto ${Incr<UniqId>};label ${Incr<Incr<UniqId>>};`,
          Drop6<Output>
        >,
        Chunks,
        ROData,
        Incr<Incr<UniqId>>,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 63
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<64, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 64
  ? Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        List<66, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union27
    ? ParseImpl<
        Source,
        List<65, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 65
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<68, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 68
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union27
    ? ParseImpl<
        Source,
        List<69, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 69
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<71, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 71
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Source,
        List<72, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 72
  ? Scan<Source>[1] extends Union24
    ? ParseImpl<
        Scan<Source>[0],
        List<73, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 73
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<7, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<8, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        List<11, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<33, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<50, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        List<51, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        List<52, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        List<53, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        List<54, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union26
    ? ParseImpl<
        Source,
        List<49, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 74
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop10<States>,
        List<
          `${Drop6<Output>[0]}label ${Incr<UniqId>};get_const true;${Drop4<Output>[0]}test ${Incr<
            Incr<UniqId>
          >};${ResolveLabel<
            Output[0],
            Drop9<Output>[0],
            Incr<UniqId>,
            Incr<Incr<UniqId>>
          >}${Drop2<Output>[0]}goto ${Incr<UniqId>};label ${Incr<Incr<UniqId>>};`,
          Drop10<Output>
        >,
        Chunks,
        ROData,
        Incr<Incr<UniqId>>,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 66
  ? Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<12, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 76
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop2<States>,
        List<`break;`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 77
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<78, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 78
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop3<States>,
        List<`break ${Drop1<Output>[0]};`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 79
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop2<States>,
        List<`continue;`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 80
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<81, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 81
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop3<States>,
        List<`continue ${Drop1<Output>[0]};`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 82
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop2<States>,
        List<`return_undef;`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 83
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop3<States>,
        List<`${Drop1<Output>[0]}return;`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 84
  ? Scan<Source>[1] extends Union3
    ? ParseGoto<
        Source,
        "Statement",
        Drop2<States>,
        List<`${Drop1<Output>[0]}`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 85
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 19
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 88
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<`${Drop1<Output>[0]}`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 89
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 91
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 93
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 95
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 97
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 99
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 101
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 103
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 105
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 107
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 109
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 111
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 20
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 114
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop2<States>,
        List<`%${Output[0]} ${Drop1<Output>[0]};`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 115
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop2<States>,
        List<`${Drop1<Output>[0]}.${Output[0]};`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 29
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`${Output[0]}`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 116
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "FunctionExpression",
        Drop2<States>,
        List<`new_closure ${Chunks["length"]};`, Drop2<Output>>,
        EmitFunction<Chunks, Output[0]>,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 117
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<35, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 118
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "FunctionExpression",
        Drop3<States>,
        List<`new_closure ${Chunks["length"]};`, Drop3<Output>>,
        EmitFunction<Chunks, Output[0], Drop1<Output>[0]>,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 21
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`get_const ${Output[0]};`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 22
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`get_const n:${Output[0]};`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 23
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`get_const s:${GetStringId<ROData, Output[0]>};`, Drop1<Output>>,
        Chunks,
        ImitatedSetAdd<ROData, Output[0]>,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 119
  ? Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<120, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 120
  ? Scan<Source>[1] extends Union39
    ? ParseGoto<
        Source,
        "PropertyReference",
        Drop3<States>,
        List<
          `${Drop2<Output>[0]}push;get_const s:${GetStringId<ROData, Output[0]>};`,
          Drop3<Output>
        >,
        Chunks,
        ImitatedSetAdd<ROData, Output[0]>,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 121
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 123
  ? Scan<Source>[1] extends Union39
    ? ParseGoto<
        Source,
        "PropertyReference",
        Drop4<States>,
        List<`${Drop3<Output>[0]}push;${Drop1<Output>[0]}`, Drop4<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 30
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`${Output[0]}`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 124
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "ObjectLiteral",
        Drop2<States>,
        List<`new_object;`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 125
  ? Scan<Source>[1] extends Union40
    ? ParseImpl<
        Scan<Source>[0],
        List<126, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 126
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "ObjectLiteral",
        Drop4<States>,
        List<`new_object;push;${Drop2<Output>[0]}pop;`, Drop4<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 127
  ? Scan<Source>[1] extends Union41
    ? ParseGoto<
        Source,
        "PropertyList",
        Drop1<States>,
        List<`${Output[0]}`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 128
  ? Scan<Source>[1] extends Union41
    ? ParseGoto<
        Source,
        "PropertyList",
        Drop3<States>,
        List<`${Drop2<Output>[0]}${Output[0]}`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 129
  ? Scan<Source>[1] extends Union42
    ? ParseImpl<
        Scan<Source>[0],
        List<130, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 130
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 132
  ? Scan<Source>[1] extends Union42
    ? ParseImpl<
        Scan<Source>[0],
        List<133, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 133
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 135
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 137
  ? Scan<Source>[1] extends Union42
    ? ParseImpl<
        Scan<Source>[0],
        List<138, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 138
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 24
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union43
    ? ParseImpl<
        Source,
        List<140, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 140
  ? Scan<Source>[1] extends Union43
    ? ParseImpl<
        Scan<Source>[0],
        List<143, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 143
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<`recv_args;${Drop1<Output>[0]}new_array;`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 144
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Source,
        List<145, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 145
  ? Scan<Source>[1] extends Union24
    ? ParseImpl<
        Scan<Source>[0],
        List<146, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 146
  ? Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop4<States>,
        List<`${Drop3<Output>[0]}recv_args;${Drop1<Output>[0]}call;`, Drop4<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 147
  ? Scan<Source>[1] extends Union46
    ? ParseGoto<
        Source,
        "Arguments",
        Drop2<States>,
        List<`${Drop1<Output>[0]}`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 1
  ? Scan<Source>[1] extends Union49
    ? ParseImpl<
        Scan<Source>[0],
        List<3, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union47
    ? {
        chunks: EmitFunction<Chunks, `${Output[0]}return_undef;`>;
        rodata: ROData;
      } /*END*/
    : Scan<Source>[1] extends Union48
    ? ParseImpl<
        Source,
        List<148, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 148
  ? Scan<Source>[1] extends Union49
    ? ParseImpl<
        Scan<Source>[0],
        List<4, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<7, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<8, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        List<11, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<33, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<50, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        List<51, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        List<52, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        List<53, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        List<54, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union51
    ? ParseImpl<
        Source,
        List<49, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 50
  ? Scan<Source>[1] extends Union42
    ? ParseImpl<
        Scan<Source>[0],
        List<5, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union53
    ? ParseImpl<
        Scan<Source>[0],
        List<93, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        List<97, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<114, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union52
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`get_local ${Output[0]};`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 49
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<7, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<8, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        List<11, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<33, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union56
    ? ParseImpl<
        Scan<Source>[0],
        List<58, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union57
    ? ParseImpl<
        Scan<Source>[0],
        List<63, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<50, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        List<51, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        List<52, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        List<53, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        List<54, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union55
    ? ParseImpl<
        Source,
        List<49, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 51
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<149, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 52
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<76, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<77, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 53
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<79, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<80, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 54
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<82, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 56
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<84, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<85, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 57
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union59
    ? ParseGoto<
        Source,
        "CommaExpression",
        Drop1<States>,
        List<`${Output[0]}`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 32
  ? Scan<Source>[1] extends Union53
    ? ParseImpl<
        Scan<Source>[0],
        List<95, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        List<99, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<115, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`${Output[0]}op2 get_prop;`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 26
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<151, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 9
  ? Scan<Source>[1] extends Union49
    ? ParseImpl<
        Scan<Source>[0],
        List<3, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union40
    ? ParseImpl<
        Scan<Source>[0],
        List<10, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union68
    ? ParseImpl<
        Source,
        List<148, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 14
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<15, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<16, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 12
  ? Scan<Source>[1] extends Union53
    ? ParseImpl<
        Scan<Source>[0],
        List<18, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union8
    ? ParseGoto<
        Source,
        "VariableDeclaration",
        Drop1<States>,
        List<`add_local ${Output[0]};`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 149
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 150
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<83, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<85, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 25
  ? Scan<Source>[1] extends Union53
    ? ParseImpl<
        Scan<Source>[0],
        List<93, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        List<97, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<114, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`get_local ${Output[0]};`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 27
  ? Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<117, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<35, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 28
  ? Scan<Source>[1] extends Union40
    ? ParseImpl<
        Scan<Source>[0],
        List<124, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<129, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<132, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<135, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 87
  ? Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<85, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Scan<Source>[0],
        List<88, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 113
  ? Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union71
    ? ParseGoto<
        Source,
        "Expression",
        Drop2<States>,
        List<`${Output[0]}op1 ${Drop1<Output>[0]};`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 152
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 151
  ? Scan<Source>[1] extends Union53
    ? ParseImpl<
        Scan<Source>[0],
        List<93, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        List<97, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<114, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop2<States>,
        List<`${Drop1<Output>[0]}% ${Output[0]};`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union72
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`get_local ${Output[0]};`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 153
  ? Scan<Source>[1] extends Union53
    ? ParseImpl<
        Scan<Source>[0],
        List<95, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        List<99, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<115, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union38
    ? ParseGoto<
        Source,
        "Expression",
        Drop2<States>,
        List<`${Output[0]}${Drop1<Output>[0]}.;`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union72
    ? ParseGoto<
        Source,
        "Expression",
        Drop1<States>,
        List<`${Output[0]}op2 get_prop;`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 141
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union73
    ? ParseGoto<
        Source,
        "ArgumentList",
        Drop1<States>,
        List<`${Output[0]}`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 142
  ? Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<156, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union46
    ? ParseImpl<
        Source,
        List<147, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 94
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union75
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<`${Output[0]}set_local ${Drop2<Output>[0]};`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 98
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union75
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<
          `get_local ${Drop2<Output>[0]};push;${Output[0]}op2 ${Drop1<Output>[0]};set_local ${Drop2<Output>[0]};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 35
  ? Scan<Source>[1] extends Union24
    ? ParseImpl<
        Scan<Source>[0],
        List<37, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<46, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 154
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Scan<Source>[0],
        List<158, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 155
  ? Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<159, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union40
    ? ParseImpl<
        Source,
        List<125, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 86
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union59
    ? ParseGoto<
        Source,
        "CommaExpression",
        Drop3<States>,
        List<`${Drop2<Output>[0]}${Output[0]}`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 90
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union42
    ? ParseImpl<
        Scan<Source>[0],
        List<91, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 102
  ? Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union77
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<
          `${Drop2<Output>[0]}test_or ${Incr<UniqId>};${Drop1<Output>[0]}label ${Incr<UniqId>};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        Incr<UniqId>,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 104
  ? Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union71
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<
          `${Drop2<Output>[0]}test_and ${Incr<UniqId>};${Drop1<Output>[0]}label ${Incr<UniqId>};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        Incr<UniqId>,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 106
  ? Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union71
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<
          `${Drop2<Output>[0]}push;${Output[0]}op2 ${Drop1<Output>[0]};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 108
  ? Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union71
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<
          `${Drop2<Output>[0]}push;${Output[0]}op2 ${Drop1<Output>[0]};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 110
  ? Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union71
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<
          `${Drop2<Output>[0]}push;${Output[0]}op2 ${Drop1<Output>[0]};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 112
  ? Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union71
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<
          `${Drop2<Output>[0]}push;${Output[0]}op2 ${Drop1<Output>[0]};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 122
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union43
    ? ParseImpl<
        Scan<Source>[0],
        List<123, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 96
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union75
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<`${Drop2<Output>[0]}push;${Output[0]}op3 set_prop;`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 100
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union75
    ? ParseGoto<
        Source,
        "Expression",
        Drop3<States>,
        List<
          `${Drop2<Output>[0]}push;${Output[0]}op3 ${Drop1<Output>[0]};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 156
  ? Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<25, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<27, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<28, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union46
    ? ParseGoto<
        Source,
        "TrailingComma",
        Drop1<States>,
        List<``, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 60
  ? Scan<Source>[1] extends Union24
    ? ParseImpl<
        Scan<Source>[0],
        List<61, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<85, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 67
  ? Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<85, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union27
    ? ParseGoto<
        Source,
        "ForInit",
        Drop1<States>,
        List<`${Output[0]}`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 31
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union8
    ? ParseGoto<
        Source,
        "VariableDeclaration",
        Drop3<States>,
        List<
          `add_local ${Drop2<Output>[0]};${Output[0]}set_local ${Drop2<Output>[0]};`,
          Drop3<Output>
        >,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 157
  ? Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<161, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Source,
        List<41, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 158
  ? Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        List<7, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        List<8, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        List<11, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        List<33, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<19, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        List<20, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        List<21, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        List<22, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<23, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<24, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<50, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        List<51, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        List<52, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        List<53, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        List<54, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        List<26, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union26
    ? ParseImpl<
        Source,
        List<49, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 159
  ? Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        List<129, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<132, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<135, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union40
    ? ParseGoto<
        Source,
        "TrailingComma",
        Drop1<States>,
        List<``, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 136
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union43
    ? ParseImpl<
        Scan<Source>[0],
        List<137, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 160
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union73
    ? ParseGoto<
        Source,
        "ArgumentList",
        Drop3<States>,
        List<`${Drop2<Output>[0]}${Output[0]}`, Drop3<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 75
  ? Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<16, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union27
    ? ParseGoto<
        Source,
        "ForInit",
        Drop2<States>,
        List<`${Output[0]}`, Drop2<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 161
  ? Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        List<47, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseGoto<
        Source,
        "TrailingComma",
        Drop1<States>,
        List<``, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 162
  ? Scan<Source>[1] extends Union78
    ? ParseImpl<
        Scan<Source>[0],
        List<48, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union2
    ? ParseGoto<
        Source,
        "Statement",
        Drop5<States>,
        List<
          `${Drop2<Output>[0]}test ${Incr<UniqId>};${Output[0]}label ${Incr<UniqId>};`,
          Drop5<Output>
        >,
        Chunks,
        ROData,
        Incr<UniqId>,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 131
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union41
    ? ParseGoto<
        Source,
        "Property",
        Drop3<States>,
        List<
          `get_const s:${GetStringId<
            ROData,
            Drop2<Output>[0]
          >};push;${Output[0]}op2 add_prop;`,
          Drop3<Output>
        >,
        Chunks,
        ImitatedSetAdd<ROData, Drop2<Output>[0]>,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 134
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union41
    ? ParseGoto<
        Source,
        "Property",
        Drop3<States>,
        List<
          `get_const s:${GetStringId<
            ROData,
            Drop2<Output>[0]
          >};push;${Output[0]}op2 add_prop;`,
          Drop3<Output>
        >,
        Chunks,
        ImitatedSetAdd<ROData, Drop2<Output>[0]>,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 92
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union75
    ? ParseGoto<
        Source,
        "Expression",
        Drop5<States>,
        List<
          `${Drop4<Output>[0]}test ${Incr<UniqId>};${Drop2<Output>[0]}goto ${Incr<
            Incr<UniqId>
          >};label ${Incr<UniqId>};${Output[0]}label ${Incr<Incr<UniqId>>};`,
          Drop5<Output>
        >,
        Chunks,
        ROData,
        Incr<Incr<UniqId>>,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 70
  ? Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        List<85, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union79
    ? ParseGoto<
        Source,
        "ForExpr",
        Drop1<States>,
        List<`${Output[0]}`, Drop1<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 39
  ? Scan<Source>[1] extends Union49
    ? ParseImpl<
        Scan<Source>[0],
        List<3, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union40
    ? ParseImpl<
        Scan<Source>[0],
        List<40, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union68
    ? ParseImpl<
        Source,
        List<148, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 139
  ? Scan<Source>[1] extends Union60
    ? ParseImpl<
        Scan<Source>[0],
        List<89, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        List<101, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        List<103, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        List<105, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        List<107, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        List<109, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        List<111, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        List<119, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        List<121, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        List<144, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union41
    ? ParseGoto<
        Source,
        "Property",
        Drop5<States>,
        List<`${Drop3<Output>[0]}push;${Output[0]}op2 add_prop;`, Drop5<Output>>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : States[0] extends 44
  ? Scan<Source>[1] extends Union49
    ? ParseImpl<
        Scan<Source>[0],
        List<3, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union40
    ? ParseImpl<
        Scan<Source>[0],
        List<45, States>,
        List<Scan<Source>[2], Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union68
    ? ParseImpl<
        Source,
        List<148, States>,
        List<``, Output>,
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Throw<`Unexpected "${Scan<Source>[2]}"`, Source, States, Output>
  : Throw<`Unexpected lookahead: "${Scan<Source>[1]}".`, Source, States, Output>;

type ParseGoto<
  Source extends string,
  Symbol extends string,
  States extends List<number>,
  Output extends List<string>,
  Chunks extends string[],
  ROData extends STRSet,
  UniqId extends string,
  Counter extends IncrU8[number],
> = States[0] extends 0
  ? Symbol extends Union1
    ? ParseImpl<Source, List<1, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 8
  ? Symbol extends Union1
    ? ParseImpl<Source, List<9, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 11
  ? Symbol extends Union6
    ? ParseImpl<Source, List<13, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union7
    ? ParseImpl<Source, List<14, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 16
  ? Symbol extends Union6
    ? ParseImpl<Source, List<17, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 18
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<31, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 34
  ? Symbol extends Union22
    ? ParseImpl<Source, List<36, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 38
  ? Symbol extends Union1
    ? ParseImpl<Source, List<39, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 43
  ? Symbol extends Union1
    ? ParseImpl<Source, List<44, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 48
  ? Symbol extends Union33
    ? ParseImpl<Source, List<55, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, List<49, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<56, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 59
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<60, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 61
  ? Symbol extends Union33
    ? ParseImpl<Source, List<62, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, List<49, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<56, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 64
  ? Symbol extends Union36
    ? ParseImpl<Source, List<65, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<67, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 68
  ? Symbol extends Union37
    ? ParseImpl<Source, List<69, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<70, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 71
  ? Symbol extends Union37
    ? ParseImpl<Source, List<72, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<70, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 73
  ? Symbol extends Union33
    ? ParseImpl<Source, List<74, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, List<49, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<56, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 66
  ? Symbol extends Union6
    ? ParseImpl<Source, List<13, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union7
    ? ParseImpl<Source, List<75, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 85
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<86, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 19
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<87, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 89
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<90, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 91
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<92, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 93
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<94, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 95
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<96, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 97
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<98, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 99
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<100, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 101
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<102, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 103
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<104, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 105
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<106, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 107
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<108, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 109
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<110, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 111
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<112, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 20
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<113, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 117
  ? Symbol extends Union22
    ? ParseImpl<Source, List<118, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 121
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<122, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 130
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<131, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 133
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<134, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 135
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<136, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 138
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<139, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 24
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union44
    ? ParseImpl<Source, List<140, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<141, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union45
    ? ParseImpl<Source, List<142, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 144
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union44
    ? ParseImpl<Source, List<145, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<141, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union45
    ? ParseImpl<Source, List<142, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 1
  ? Symbol extends Union50
    ? ParseImpl<Source, List<148, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 148
  ? Symbol extends Union33
    ? ParseImpl<Source, List<2, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, List<49, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<56, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 49
  ? Symbol extends Union33
    ? ParseImpl<Source, List<6, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, List<49, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<56, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 54
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<150, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 26
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<152, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<153, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 9
  ? Symbol extends Union50
    ? ParseImpl<Source, List<148, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 149
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<154, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 27
  ? Symbol extends Union22
    ? ParseImpl<Source, List<116, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 28
  ? Symbol extends Union69
    ? ParseImpl<Source, List<127, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union70
    ? ParseImpl<Source, List<155, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 142
  ? Symbol extends Union74
    ? ParseImpl<Source, List<147, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 35
  ? Symbol extends Union76
    ? ParseImpl<Source, List<157, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 155
  ? Symbol extends Union74
    ? ParseImpl<Source, List<125, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 156
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<160, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 157
  ? Symbol extends Union74
    ? ParseImpl<Source, List<41, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 158
  ? Symbol extends Union18
    ? ParseImpl<Source, List<29, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, List<30, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, List<49, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union33
    ? ParseImpl<Source, List<162, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, List<56, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, List<57, States>, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, List<32, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 159
  ? Symbol extends Union69
    ? ParseImpl<Source, List<128, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 39
  ? Symbol extends Union50
    ? ParseImpl<Source, List<148, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 44
  ? Symbol extends Union50
    ? ParseImpl<Source, List<148, States>, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : Throw<`Error goto on "${Symbol}"`, Source, States, Output>;
