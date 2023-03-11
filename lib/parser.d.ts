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
  ParseImpl<Source, { 0: 0; 1: never }, { 0: ""; 1: never }, [], ImitatedSetNew, "0", 0>;

type Throw<Error, Source, States, Output> = {
  error: Error;
  source: Source;
  states: States;
  output: Output;
};

type List<T> = { 0: T; 1: List<T> };

type GetStringId<
  ROData extends ImitatedSet<string>,
  String extends string,
> = ImitatedSetFind<ROData, String> extends ""
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

type Drop2<T extends List<unknown>> = T[1][1];

type Drop3<T extends List<unknown>> = T[1][1][1];

type Drop1<T extends List<unknown>> = T[1];

type Drop5<T extends List<unknown>> = T[1][1][1][1][1];

type Drop7<T extends List<unknown>> = T[1][1][1][1][1][1][1];

type Drop4<T extends List<unknown>> = T[1][1][1][1];

type Drop6<T extends List<unknown>> = T[1][1][1][1][1][1];

type Drop9<T extends List<unknown>> = T[1][1][1][1][1][1][1][1][1];

type Drop10<T extends List<unknown>> = T[1][1][1][1][1][1][1][1][1][1];

type ParseImpl<
  Source extends string,
  States extends List<number>,
  Output extends List<string>,
  Chunks extends string[],
  ROData extends ImitatedSet<string>,
  UniqId extends string,
  Counter extends IncrU8[number],
> = Counter extends 255
  ? ParseImpl<Source, States, Output, Chunks, ROData, UniqId, 0> & {}
  : States[0] extends 0
  ? Scan<Source>[1] extends Union0
    ? ParseImpl<
        Source,
        { 0: 1; 1: States },
        { 0: ``; 1: Output },
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
        { 0: `${Drop2<Output>[0]}${Output[0]}`; 1: Drop3<Output> },
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
        { 0: ``; 1: Drop1<Output> },
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
        { 0: ``; 1: Drop2<Output> },
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
        { 0: `${Drop1<Output>[0]}`; 1: Drop2<Output> },
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
        { 0: ``; 1: Drop2<Output> },
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
        { 0: ``; 1: Drop1<Output> },
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
        { 0: 9; 1: States },
        { 0: ``; 1: Output },
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
        { 0: `${HoistSetFnLocal<Drop1<Output>[0]>}`; 1: Drop3<Output> },
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
        { 0: 12; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop1<Output>[0]}`; 1: Drop3<Output> },
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
        { 0: `${Output[0]}`; 1: Drop1<Output> },
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
        { 0: 12; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop2<Output>[0]}${Output[0]}`; 1: Drop3<Output> },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 34; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 35; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `add_local ${Drop1<Output>[0]};new_closure ${Chunks["length"]};set_fn_local ${Drop1<Output>[0]};`;
          1: Drop3<Output>;
        },
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
        { 0: 38; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 39; 1: States },
        { 0: ``; 1: Output },
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
        { 0: `${Drop1<Output>[0]}return_undef;`; 1: Drop5<Output> },
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
        { 0: 42; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 43; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 44; 1: States },
        { 0: ``; 1: Output },
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
        { 0: `${Drop5<Output>[0]}${Drop1<Output>[0]}return_undef;`; 1: Drop7<Output> },
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
        { 0: `add_local ${Output[0]};set_param ${Output[0]};`; 1: Drop1<Output> },
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
        {
          0: `${Drop2<Output>[0]}add_local ${Output[0]};set_param ${Output[0]};`;
          1: Drop3<Output>;
        },
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
        { 0: 7; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 8; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 11; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 33; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 50; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 51; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 52; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 53; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 54; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union26
    ? ParseImpl<
        Source,
        { 0: 49; 1: States },
        { 0: ``; 1: Output },
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
        {
          0: `${Drop4<Output>[0]}test ${Incr<UniqId>};${Drop2<Output>[0]}goto ${Incr<
            Incr<UniqId>
          >};label ${Incr<UniqId>};${Output[0]}label ${Incr<Incr<UniqId>>};`;
          1: Drop7<Output>;
        },
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
        { 0: 59; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 7; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 8; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 11; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 33; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 50; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 51; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 52; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 53; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 54; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union26
    ? ParseImpl<
        Source,
        { 0: 49; 1: States },
        { 0: ``; 1: Output },
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
        {
          0: `label ${Incr<UniqId>};${Drop2<Output>[0]}test ${Incr<
            Incr<UniqId>
          >};${ResolveLabel<
            Output[0],
            Drop5<Output>[0],
            Incr<UniqId>,
            Incr<Incr<UniqId>>
          >}goto ${Incr<UniqId>};label ${Incr<Incr<UniqId>>};`;
          1: Drop6<Output>;
        },
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
        { 0: 64; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 66; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union27
    ? ParseImpl<
        Source,
        { 0: 65; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 68; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union27
    ? ParseImpl<
        Source,
        { 0: 69; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 71; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Source,
        { 0: 72; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 73; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 7; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 8; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 11; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 33; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 50; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 51; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 52; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 53; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 54; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union26
    ? ParseImpl<
        Source,
        { 0: 49; 1: States },
        { 0: ``; 1: Output },
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
        {
          0: `${Drop6<Output>[0]}label ${Incr<UniqId>};get_const true;${Drop4<Output>[0]}test ${Incr<
            Incr<UniqId>
          >};${ResolveLabel<
            Output[0],
            Drop9<Output>[0],
            Incr<UniqId>,
            Incr<Incr<UniqId>>
          >}${Drop2<Output>[0]}goto ${Incr<UniqId>};label ${Incr<Incr<UniqId>>};`;
          1: Drop10<Output>;
        },
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
        { 0: 12; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `break;`; 1: Drop2<Output> },
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
        { 0: 78; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `break ${Drop1<Output>[0]};`; 1: Drop3<Output> },
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
        { 0: `continue;`; 1: Drop2<Output> },
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
        { 0: 81; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `continue ${Drop1<Output>[0]};`; 1: Drop3<Output> },
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
        { 0: `return_undef;`; 1: Drop2<Output> },
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
        { 0: `${Drop1<Output>[0]}return;`; 1: Drop3<Output> },
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
        { 0: `${Drop1<Output>[0]}`; 1: Drop2<Output> },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop1<Output>[0]}`; 1: Drop3<Output> },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `%${Output[0]} ${Drop1<Output>[0]};`; 1: Drop2<Output> },
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
        { 0: `${Drop1<Output>[0]}.${Output[0]};`; 1: Drop2<Output> },
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
        { 0: `${Output[0]}`; 1: Drop1<Output> },
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
        { 0: `new_closure ${Chunks["length"]};`; 1: Drop2<Output> },
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
        { 0: 35; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `new_closure ${Chunks["length"]};`; 1: Drop3<Output> },
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
        { 0: `get_const ${Output[0]};`; 1: Drop1<Output> },
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
        { 0: `get_const n:${Output[0]};`; 1: Drop1<Output> },
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
        { 0: `get_const s:${GetStringId<ROData, Output[0]>};`; 1: Drop1<Output> },
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
        { 0: 120; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop2<Output>[0]}push;get_const s:${GetStringId<ROData, Output[0]>};`;
          1: Drop3<Output>;
        },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop3<Output>[0]}push;${Drop1<Output>[0]}`; 1: Drop4<Output> },
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
        { 0: `${Output[0]}`; 1: Drop1<Output> },
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
        { 0: `new_object;`; 1: Drop2<Output> },
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
        { 0: 126; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `new_object;push;${Drop2<Output>[0]}pop;`; 1: Drop4<Output> },
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
        { 0: `${Output[0]}`; 1: Drop1<Output> },
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
        { 0: `${Drop2<Output>[0]}${Output[0]}`; 1: Drop3<Output> },
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
        { 0: 130; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 133; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 138; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union43
    ? ParseImpl<
        Source,
        { 0: 140; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 143; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `recv_args;${Drop1<Output>[0]}new_array;`; 1: Drop3<Output> },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Source,
        { 0: 145; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 146; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop3<Output>[0]}recv_args;${Drop1<Output>[0]}call;`; 1: Drop4<Output> },
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
        { 0: `${Drop1<Output>[0]}`; 1: Drop2<Output> },
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
        { 0: 3; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 148; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 4; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union27
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 7; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 8; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 11; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 33; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 50; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 51; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 52; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 53; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 54; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union51
    ? ParseImpl<
        Source,
        { 0: 49; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 5; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union53
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 93; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 97; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 114; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `get_local ${Output[0]};`; 1: Drop1<Output> },
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
        { 0: 7; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 8; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 11; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 33; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union56
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 58; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union57
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 63; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 50; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 51; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 52; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 53; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 54; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union55
    ? ParseImpl<
        Source,
        { 0: 49; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 149; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 76; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 77; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 79; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 80; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 82; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 84; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 85; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Output[0]}`; 1: Drop1<Output> },
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
        { 0: 95; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 99; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 115; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Output[0]}op2 get_prop;`; 1: Drop1<Output> },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 151; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 3; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union40
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 10; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union68
    ? ParseImpl<
        Source,
        { 0: 148; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 15; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 16; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 18; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `add_local ${Output[0]};`; 1: Drop1<Output> },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 83; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 85; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 93; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 97; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 114; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `get_local ${Output[0]};`; 1: Drop1<Output> },
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
        { 0: 117; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 35; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 124; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 129; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 132; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 135; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 85; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 88; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Output[0]}op1 ${Drop1<Output>[0]};`; 1: Drop2<Output> },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 93; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 97; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 114; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop1<Output>[0]}% ${Output[0]};`; 1: Drop2<Output> },
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
        { 0: `get_local ${Output[0]};`; 1: Drop1<Output> },
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
        { 0: 95; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union54
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 99; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 115; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Output[0]}${Drop1<Output>[0]}.;`; 1: Drop2<Output> },
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
        { 0: `${Output[0]}op2 get_prop;`; 1: Drop1<Output> },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Output[0]}`; 1: Drop1<Output> },
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
        { 0: 156; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union46
    ? ParseImpl<
        Source,
        { 0: 147; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Output[0]}set_local ${Drop2<Output>[0]};`; 1: Drop3<Output> },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `get_local ${Drop2<Output>[0]};push;${Output[0]}op2 ${Drop1<Output>[0]};set_local ${Drop2<Output>[0]};`;
          1: Drop3<Output>;
        },
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
        { 0: 37; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 46; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 158; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 159; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union40
    ? ParseImpl<
        Source,
        { 0: 125; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop2<Output>[0]}${Output[0]}`; 1: Drop3<Output> },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union42
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 91; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop2<Output>[0]}test_or ${Incr<UniqId>};${Drop1<Output>[0]}label ${Incr<UniqId>};`;
          1: Drop3<Output>;
        },
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
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop2<Output>[0]}test_and ${Incr<UniqId>};${Drop1<Output>[0]}label ${Incr<UniqId>};`;
          1: Drop3<Output>;
        },
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
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop2<Output>[0]}push;${Output[0]}op2 ${Drop1<Output>[0]};`;
          1: Drop3<Output>;
        },
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
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop2<Output>[0]}push;${Output[0]}op2 ${Drop1<Output>[0]};`;
          1: Drop3<Output>;
        },
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
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop2<Output>[0]}push;${Output[0]}op2 ${Drop1<Output>[0]};`;
          1: Drop3<Output>;
        },
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
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop2<Output>[0]}push;${Output[0]}op2 ${Drop1<Output>[0]};`;
          1: Drop3<Output>;
        },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union43
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 123; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop2<Output>[0]}push;${Output[0]}op3 set_prop;`; 1: Drop3<Output> },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop2<Output>[0]}push;${Output[0]}op3 ${Drop1<Output>[0]};`;
          1: Drop3<Output>;
        },
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
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 25; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 27; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 28; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: ``; 1: Drop1<Output> },
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
        { 0: 61; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union58
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 85; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 85; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Output[0]}`; 1: Drop1<Output> },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `add_local ${Drop2<Output>[0]};${Output[0]}set_local ${Drop2<Output>[0]};`;
          1: Drop3<Output>;
        },
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
        { 0: 161; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union24
    ? ParseImpl<
        Source,
        { 0: 41; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 7; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union17
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 8; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union28
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 11; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union16
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 33; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 19; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union10
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 20; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union11
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 21; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union12
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 22; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union13
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 23; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 24; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 50; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union29
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 51; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union30
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 52; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union31
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 53; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union32
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 54; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union15
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 26; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union26
    ? ParseImpl<
        Source,
        { 0: 49; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 129; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union5
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 132; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 135; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: ``; 1: Drop1<Output> },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union43
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 137; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop2<Output>[0]}${Output[0]}`; 1: Drop3<Output> },
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
        { 0: 16; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Output[0]}`; 1: Drop2<Output> },
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
        { 0: 47; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: ``; 1: Drop1<Output> },
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
        { 0: 48; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop2<Output>[0]}test ${Incr<UniqId>};${Output[0]}label ${Incr<UniqId>};`;
          1: Drop5<Output>;
        },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `get_const s:${GetStringId<
            ROData,
            Drop2<Output>[0]
          >};push;${Output[0]}op2 add_prop;`;
          1: Drop3<Output>;
        },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `get_const s:${GetStringId<
            ROData,
            Drop2<Output>[0]
          >};push;${Output[0]}op2 add_prop;`;
          1: Drop3<Output>;
        },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        {
          0: `${Drop4<Output>[0]}test ${Incr<UniqId>};${Drop2<Output>[0]}goto ${Incr<
            Incr<UniqId>
          >};label ${Incr<UniqId>};${Output[0]}label ${Incr<Incr<UniqId>>};`;
          1: Drop5<Output>;
        },
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
        { 0: 85; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Output[0]}`; 1: Drop1<Output> },
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
        { 0: 3; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union40
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 40; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union68
    ? ParseImpl<
        Source,
        { 0: 148; 1: States },
        { 0: ``; 1: Output },
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
        { 0: 89; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union61
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 101; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union62
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 103; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union63
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 105; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union64
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 107; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union65
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 109; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union66
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 111; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union67
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 119; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union14
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 121; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union9
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 144; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
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
        { 0: `${Drop3<Output>[0]}push;${Output[0]}op2 add_prop;`; 1: Drop5<Output> },
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
        { 0: 3; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union40
    ? ParseImpl<
        Scan<Source>[0],
        { 0: 45; 1: States },
        { 0: Scan<Source>[2]; 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >
    : Scan<Source>[1] extends Union68
    ? ParseImpl<
        Source,
        { 0: 148; 1: States },
        { 0: ``; 1: Output },
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
  ROData extends ImitatedSet<string>,
  UniqId extends string,
  Counter extends IncrU8[number],
> = States[0] extends 0
  ? Symbol extends Union1
    ? ParseImpl<Source, { 0: 1; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 8
  ? Symbol extends Union1
    ? ParseImpl<Source, { 0: 9; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 11
  ? Symbol extends Union6
    ? ParseImpl<Source, { 0: 13; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union7
    ? ParseImpl<Source, { 0: 14; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 16
  ? Symbol extends Union6
    ? ParseImpl<Source, { 0: 17; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 18
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 31; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 34
  ? Symbol extends Union22
    ? ParseImpl<Source, { 0: 36; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 38
  ? Symbol extends Union1
    ? ParseImpl<Source, { 0: 39; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 43
  ? Symbol extends Union1
    ? ParseImpl<Source, { 0: 44; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 48
  ? Symbol extends Union33
    ? ParseImpl<Source, { 0: 55; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, { 0: 49; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 56; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 59
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 60; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 61
  ? Symbol extends Union33
    ? ParseImpl<Source, { 0: 62; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, { 0: 49; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 56; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 64
  ? Symbol extends Union36
    ? ParseImpl<Source, { 0: 65; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 67; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 68
  ? Symbol extends Union37
    ? ParseImpl<Source, { 0: 69; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 70; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 71
  ? Symbol extends Union37
    ? ParseImpl<Source, { 0: 72; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 70; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 73
  ? Symbol extends Union33
    ? ParseImpl<Source, { 0: 74; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, { 0: 49; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 56; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 66
  ? Symbol extends Union6
    ? ParseImpl<Source, { 0: 13; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union7
    ? ParseImpl<Source, { 0: 75; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 85
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 86; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 19
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 87; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 89
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 90; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 91
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 92; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 93
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 94; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 95
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 96; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 97
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 98; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 99
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 100; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 101
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 102; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 103
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 104; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 105
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 106; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 107
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 108; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 109
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 110; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 111
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 112; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 20
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 113; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 117
  ? Symbol extends Union22
    ? ParseImpl<Source, { 0: 118; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 121
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 122; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 130
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 131; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 133
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 134; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 135
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 136; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 138
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 139; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 24
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union44
    ? ParseImpl<Source, { 0: 140; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 141; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union45
    ? ParseImpl<Source, { 0: 142; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 144
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union44
    ? ParseImpl<Source, { 0: 145; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 141; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union45
    ? ParseImpl<Source, { 0: 142; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 1
  ? Symbol extends Union50
    ? ParseImpl<Source, { 0: 148; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 148
  ? Symbol extends Union33
    ? ParseImpl<Source, { 0: 2; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, { 0: 49; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 56; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 49
  ? Symbol extends Union33
    ? ParseImpl<Source, { 0: 6; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, { 0: 49; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 56; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 54
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 150; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 26
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 152; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 153; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 9
  ? Symbol extends Union50
    ? ParseImpl<Source, { 0: 148; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 149
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 154; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 27
  ? Symbol extends Union22
    ? ParseImpl<Source, { 0: 116; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 28
  ? Symbol extends Union69
    ? ParseImpl<Source, { 0: 127; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union70
    ? ParseImpl<Source, { 0: 155; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 142
  ? Symbol extends Union74
    ? ParseImpl<Source, { 0: 147; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 35
  ? Symbol extends Union76
    ? ParseImpl<Source, { 0: 157; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 155
  ? Symbol extends Union74
    ? ParseImpl<Source, { 0: 125; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 156
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 160; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 157
  ? Symbol extends Union74
    ? ParseImpl<Source, { 0: 41; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 158
  ? Symbol extends Union18
    ? ParseImpl<Source, { 0: 29; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union19
    ? ParseImpl<Source, { 0: 30; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union34
    ? ParseImpl<Source, { 0: 49; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union33
    ? ParseImpl<Source, { 0: 162; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union35
    ? ParseImpl<Source, { 0: 56; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union20
    ? ParseImpl<Source, { 0: 57; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Symbol extends Union21
    ? ParseImpl<Source, { 0: 32; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 159
  ? Symbol extends Union69
    ? ParseImpl<Source, { 0: 128; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 39
  ? Symbol extends Union50
    ? ParseImpl<Source, { 0: 148; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : States[0] extends 44
  ? Symbol extends Union50
    ? ParseImpl<Source, { 0: 148; 1: States }, Output, Chunks, ROData, UniqId, Counter>
    : Throw<`Unexpected "${Symbol}"`, Source, States, Output>
  : Throw<`Error goto on "${Symbol}"`, Source, States, Output>;
