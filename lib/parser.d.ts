declare namespace sits.parser {
    type MultipliOP = mul | div | mod;

    type AdditiveOP = add | sub;

    type ComparerOP = le | ge | lt | gt | eq | ne;

    type BinaryOP = MultipliOP | AdditiveOP | ComparerOP;

    type Keywords = If | Else | ElseIf | Do | While | Break | Continue
        | Return | set | to | then | oops | well | BinaryOP;

    // just worry about only these types for now.
    type Literals = number | boolean | null | undefined;

    type ParserContext<Tokens = any, Return = any> = {
        tokens: Tokens; // tokens to parse
        return: Return; // return AST node or error
    };

    type SyntaxError<T = {}> = {
        readonly SyntaxError: unique symbol;
        message: T;
    }

    type ThrowSyntaxError<Context, Expect> =
        SetReturn<Context, SyntaxError<{
            "Unexpected token": PeekToken<Context>;
            "Expect": Expect;
            "At": GetProp<Context, "tokens">;
        }>>;

    type GetReturn<Context> =
        Context extends ParserContext<any, infer R> ? R : never;

    type SetReturn<Context, Return> =
        Context extends ParserContext<infer Tokens, infer Last>
        ? Last extends SyntaxError ? Context
        : ParserContext<Tokens, Return> : never;

    type PeekToken<Context> =
        Context extends ParserContext<infer Tokens, infer Return>
        ? Return extends SyntaxError ? "ERROR"
        : Tokens extends [] ? "EOF"
        : Tokens extends { 0: Keywords } ? Tokens[0]
        : Tokens extends { 0: string } ? "identifier"
        : Tokens extends { 0: Literals } ? "literal"
        : "unknown" : never;

    type Scan<Context, Expect> =
        Context extends ParserContext<infer Tokens, infer Return>
        ? Return extends SyntaxError ? Context
        : Tokens extends { 0: Expect }
        ? ParserContext<Tail<Tokens>, Tokens[0]>
        : ThrowSyntaxError<Context, Expect>
        : never;

    type ScanIdentifier<Context> =
        Scan<Context, string> extends infer R
        ? GetReturn<R> extends Keywords
        ? ThrowSyntaxError<Context, "identifier">
        : R : never;

    type Parse<Tokens extends any[]> = GetReturn<Parse1<Tokens>>;

    // enable parsing deeper statements, magic :p
    type Parse1<T> = Parse2<T> extends infer S ? Parse4<S> : never;
    type Parse2<T> = { [P in keyof T]: Parse3<T[P]> }
    type Parse3<T> = T extends any[] ? Parse1<T> : T;
    type Parse4<T> = ParseStatements<ParserContext<T, []>>;

    // enable parsing more statements :)
    type ParseStatements<Context> = {
        1: Context;
        0: ParseStatements<ParseStatements32<Context>>;
    }[PeekToken<Context> extends "ERROR" | "EOF" ? 1 : 0];

    type ParseStatements1<Context> =
        ParseStatement<Context> extends ParserContext<infer Tokens, infer Return>
        ? Return extends SyntaxError
        ? ParserContext<Tokens, Return>
        : ParserContext<Tokens, Push<GetReturn<Context>, Return>>
        : Context;

    type ParseStatements2<Context> =
        ParseStatements1<Context> extends infer C1
        ? ParseStatements1<C1> : never;

    type ParseStatements4<Context> =
        ParseStatements2<Context> extends infer C1
        ? ParseStatements2<C1> : never;

    type ParseStatements8<Context> =
        ParseStatements4<Context> extends infer C1
        ? ParseStatements4<C1> : never;

    type ParseStatements16<Context> =
        ParseStatements8<Context> extends infer C1
        ? ParseStatements8<C1> : never;

    type ParseStatements32<Context> =
        ParseStatements16<Context> extends infer C1
        ? ParseStatements16<C1> : never;
    // end of the dragon

    type ParseStatement<Context> =
        Switch<PeekToken<Context>, {
            EOF: null;
            If: ParseIf<Context, If>;
            Do: ParseDoWhile<Context>;
            While: ParseWhile<Context>;
            Break: SetReturn<
                Scan<Context, Break>,
                syntax.BreakStatement
            >;
            Continue: SetReturn<
                Scan<Context, Continue>,
                syntax.ContinueStatement
            >;
            Return: ParseReturn<Context>;
            set: ParseAssignment<Context>;
            well: SetReturn<Scan<Context, well>, null>;
            default: ParseExpression<Context>;
        }>;

    type ParseBlock<Context> =
        Scan<Context, ParserContext> extends infer C1
        ? GetReturn<C1> extends ParserContext
        ? SetReturn<C1, GetReturn<GetReturn<C1>>>
        : ThrowSyntaxError<Context, "code block">
        : never;

    type ParseIf<Context, Token extends If | ElseIf> =
        Scan<Context, Token> extends infer C1       // if
        ? ParseExpression<C1> extends infer C2      // condition
        ? ParseBlock<C2> extends infer C3           // code block
        ? ParseElse<C3> extends infer C4            // else
        ? SetReturn<C4, syntax.IfStatement<
            GetReturn<C2>,
            GetReturn<C3>,
            GetReturn<C4>
        >>
        : never : never : never : never;

    type ParseElse<Context> =
        Switch<PeekToken<Context>, {
            Else: ParseBlock<Scan<Context, Else>>;  // else
            ElseIf: ParseIf<Context, ElseIf>;       // else if
            default: SetReturn<Context, null>;      // nothing
        }>;

    // 

    type ParseDoWhile<Context> =
        Scan<Context, Do> extends infer C1          // do
        ? ParseBlock<C1> extends infer C2           // code block
        ? Scan<C2, While> extends infer C3          // while
        ? ParseExpression<C3> extends infer C4      // expression
        ? SetReturn<C4, syntax.DoWhileStatement<
            GetReturn<C4>,
            GetReturn<C2>
        >>
        : never : never : never : never;

    type ParseWhile<Context> =
        Scan<Context, While> extends infer C1       // while
        ? ParseExpression<C1> extends infer C2      // expression
        ? ParseBlock<C2> extends infer C3           // code block
        ? SetReturn<C3, syntax.WhileStatement<
            GetReturn<C2>,
            GetReturn<C3>
        >>
        : never : never : never;

    type ParseReturn<Context> =
        Scan<Context, Return> extends infer C1      // return
        ? ParseExpression<C1> extends infer C2      // expression
        ? SetReturn<C2, syntax.ReturnStatement<
            GetReturn<C2>
        >>
        : never : never;

    type ParseAssignment<Context> =
        Scan<Context, set> extends infer C1         // set
        ? ScanIdentifier<C1> extends infer C2       // identifier
        ? Scan<C2, to> extends infer C3             // to
        ? ParseExpression<C3> extends infer C4      // expression
        ? SetReturn<C4, syntax.AssignmentStatement<
            GetReturn<C2>,
            GetReturn<C4>
        >>
        : never : never : never : never;

    // priority: ternary < comparation < additive < multiplicative
    type ParseExpression<Context> =
        parseTernary<ParseComparation<Context>>;

    type ParseComparation<Context> =
        ParseComparationRec<ParseAdditive<Context>>;

    type ParseAdditive<Context> =
        ParseAdditiveRec<ParseMultipli<Context>>;

    type ParseMultipli<Context> =
        ParseMultipliRec<ParsePrimary<Context>>;

    type parseTernary<Context> = {
        0: Context;
        1: Scan<Context, then> extends infer C1     // then
        ? ParseExpression<C1> extends infer C2      // expression
        ? Scan<C2, oops> extends infer C3           // oops
        ? ParseExpression<C3> extends infer C4      // expression
        ? SetReturn<C4, syntax.TernaryExpression<
            GetReturn<Context>,
            GetReturn<C2>,
            GetReturn<C4>
        >>
        : never : never : never : never;
    }[PeekToken<Context> extends then ? 1 : 0]

    type ParsePrimary<Context> =
        Switch<PeekToken<Context>, {
            literal: ParseLiteral<Context>;
            identifier: ParseIdentifier<Context>;
            default: ThrowSyntaxError<Context, "expression">;
        }>;

    type ParseLiteral<Context> =
        Scan<Context, Literals> extends infer C1
        ? GetReturn<C1> extends infer R
        ? SetReturn<C1, syntax.LiteralExpression<
            R extends [infer T] ? T : R
        >>
        : never : never;

    type ParseIdentifier<Context> =
        ScanIdentifier<Context> extends infer C1
        ? SetReturn<C1, syntax.IdentifierExpression<
            GetReturn<C1>
        >>
        : never;

    // can be refactored once type recursion is shipped

    type ParseComparationRec<Context> = {
        stop: Context;
        loop: ParseComparationRec<
            Scan<Context, ComparerOP> extends infer C1
            ? ParseAdditive<C1> extends infer C2
            ? SetReturn<C2, syntax.BinaryExpression<
                GetReturn<C1>,
                GetReturn<Context>,
                GetReturn<C2>
            >>
            : never : never
        >;
    }[PeekToken<Context> extends ComparerOP ? "loop" : "stop"];

    type ParseAdditiveRec<Context> = {
        stop: Context;
        loop: ParseAdditiveRec<
            Scan<Context, AdditiveOP> extends infer C1
            ? ParseMultipli<C1> extends infer C2
            ? SetReturn<C2, syntax.BinaryExpression<
                GetReturn<C1>,
                GetReturn<Context>,
                GetReturn<C2>
            >>
            : never : never
        >;
    }[PeekToken<Context> extends AdditiveOP ? "loop" : "stop"];

    type ParseMultipliRec<Context> = {
        stop: Context;
        loop: ParseMultipliRec<
            Scan<Context, MultipliOP> extends infer C1
            ? ParsePrimary<C1> extends infer C2
            ? SetReturn<C2, syntax.BinaryExpression<
                GetReturn<C1>,
                GetReturn<Context>,
                GetReturn<C2>
            >>
            : never : never
        >;
    }[PeekToken<Context> extends MultipliOP ? "loop" : "stop"];
}
