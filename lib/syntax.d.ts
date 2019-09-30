declare namespace sits.syntax {
    interface Statement { }
    interface Expression { }

    /**
     * Cond extends Expression
     * Then extends Statement[]
     * Else extends IfStatement | Statement[]
     */
    interface IfStatement<Cond = any, Then = any, Else = any> extends Statement {
        type: "IfStatement";
        condition: Cond;
        then: Then;
        else: Else;
    }

    /**
     * Cond extends Expression
     * Body extends Statement[]
     */
    interface DoWhileStatement<Cond = any, Body = any> extends Statement {
        type: "DoWhileStatement";
        condition: Cond;
        body: Body;
    }

    /**
     * Cond extends Expression
     * Body extends Statement[]
     */
    interface WhileStatement<Cond = any, Body = any> extends Statement {
        type: "WhileStatement";
        condition: Cond;
        body: Body;
    }

    /**
     * Value extends Expression
     */
    interface BreakStatement extends Statement {
        type: "BreakStatement";
    }

    /**
     * Value extends Expression
     */
    interface ContinueStatement extends Statement {
        type: "ContinueStatement";
    }

    /**
     * Value extends Expression
     */
    interface ReturnStatement<Value = any> extends Statement {
        type: "ReturnStatement";
        value: Value;
    }

    /**
     * Name extends string
     * RHS extends Expression
     */
    interface AssignmentStatement<Name = any, RHS = any> extends Statement {
        type: "AssignmentStatement";
        name: Name;
        rhs: RHS;
    }

    /**
     * Name extends string
     */
    interface IdentifierExpression<Name = any> extends Expression {
        type: "IdentifierExpression",
        name: Name;
    }

    /**
     * Value extends any
     */
    interface LiteralExpression<Value = any> extends Expression {
        type: "LiteralExpression";
        value: Value;
    }

    /**
     * OP extends Operators
     * A extends Expression
     * B extends Expression
     */
    interface BinaryExpression<OP = any, LHS = any, RHS = any> extends Expression {
        type: "BinaryExpression";
        operator: OP;
        lhs: LHS;
        rhs: RHS;
    }

    /**
     * Cond extends Expression
     * Then extends Expression
     * Else extends Expression
     */
    interface TernaryExpression<Cond = any, Then = any, Else = any> extends Expression {
        type: "TernaryExpression";
        condition: Cond;
        then: Then;
        else: Else;
    }
}