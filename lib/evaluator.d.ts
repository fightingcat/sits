/**
 * This may be removed, tried interpreting the whole AST directly, but
 * always leads to TS2589, it may not be possible to hack it with
 * non-vectorized code, the only approach may be compiling to bytecode,
 * still investigating....
 */

declare namespace sits.evaluator {

    // eval first statement (just for test)
    type Eval<Input extends any[]> =
        EvalExpression<Head<parser.Parse<Input>>>;

    type EvalExpression<T> =
        Switch<GetProp<T, "type">, {
            default: "Not implemented yet.";
            LiteralExpression: (
                T extends syntax.LiteralExpression<infer R> ? R : never
            );
            BinaryExpression: (
                T extends syntax.BinaryExpression<infer OP, infer LHS, infer RHS>
                ? EvalBinaryOperators<OP, EvalExpression<LHS>, EvalExpression<RHS>>
                : never
            );
        }>;

    // operators

    type EvalBinaryOperators<OP, A, B> = {
        add: EvalOperatorAdd<A, B>;
        sub: EvalOperatorSub<A, B>;
        mul: EvalOperatorMul<A, B>;
        div: EvalOperatorDiv<A, B>;
        mod: EvalOperatorMod<A, B>;
        eq: EvalOperatorEQ<A, B>;
        ne: EvalOperatorNE<A, B>;
        lt: EvalOperatorLT<A, B>;
        le: EvalOperatorGT<A, B>;
        gt: EvalOperatorLE<A, B>;
        ge: EvalOperatorGE<A, B>;
    }[OP extends parser.BinaryOP ? OP : never];

    type IsNumber<T> = T extends number ? 1 : 0;
    type IsBothNumber<A, B> = [0, IsNumber<B>][IsNumber<A>];

    type EvalOperatorAdd<A, B> = {
        0: never;
        1: math.Add<As<A, number>, As<B, number>>;
    }[IsBothNumber<A, B>];

    type EvalOperatorSub<A, B> = {
        0: never;
        1: math.Sub<As<A, number>, As<B, number>>;
    }[IsBothNumber<A, B>];

    type EvalOperatorMul<A, B> = {
        0: never;
        1: math.Mul<As<A, number>, As<B, number>>;
    }[IsBothNumber<A, B>];

    type EvalOperatorDiv<A, B> = {
        0: never;
        1: math.Div<As<A, number>, As<B, number>>;
    }[IsBothNumber<A, B>];

    type EvalOperatorMod<A, B> = {
        0: never;
        1: math.Mod<As<A, number>, As<B, number>>;
    }[IsBothNumber<A, B>];

    // ==
    type EvalOperatorEQ<A, B> = {
        0: false;
        1: [A, B] extends [B, A] ? true : false;
    }[A extends B ? 1 : 0];

    // !=
    type EvalOperatorNE<A, B> = {
        0: true;
        1: [A, B] extends [B, A] ? false : true;
    }[A extends B ? 1 : 0];

    // <
    type EvalOperatorLT<A, B> = {
        0: false;
        1: math.IsLT<As<A, number>, As<B, number>>;
    }[IsBothNumber<A, B>];

    // <=
    type EvalOperatorLE<A, B> = {
        0: false;
        1: math.IsLE<As<A, number>, As<B, number>>;
    }[IsBothNumber<A, B>];

    // >
    type EvalOperatorGT<A, B> = {
        0: false;
        1: math.IsGT<As<A, number>, As<B, number>>;
    }[IsBothNumber<A, B>];

    // >=
    type EvalOperatorGE<A, B> = {
        0: false;
        1: math.IsGE<As<A, number>, As<B, number>>;
    }[IsBothNumber<A, B>];

}