module.exports = {
  start_symbol: `Start`,
  end_symbol: `EOF`,
  aliases: {
    literals: ["undefined", "null", "true", "false", "NaN", "Infinity"],
    compound: [`+=`, `-=`, `*=`, `/=`, `%=`],
    equality: [`==`, `!=`],
    comparison: [`<`, `>`, `<=`, `>=`],
    additive: [`+`, `-`],
    multiplicative: [`*`, `/`, `%`],
    prefix_unary: [`!`, `+`, `-`],
    prefix_update: [`++`, `--`],
    postfix_update: [`++`, `--`],
  },
  precedence: [
    { assoc: `R`, items: [`if`, `else`] },
    { assoc: `L`, items: [`,`] },
    { assoc: `R`, items: [`=`, `?`, `:`, `compound`] },
    { assoc: `L`, items: [`||`] },
    { assoc: `L`, items: [`&&`] },
    { assoc: `L`, items: [`equality`] },
    { assoc: `L`, items: [`in`, `comparison`] },
    { assoc: `L`, items: [`<<`, `>>`, `>>>`] },
    { assoc: `L`, items: [`additive`] },
    { assoc: `L`, items: [`multiplicative`] },
    { assoc: `R`, items: [`prefix_unary`, `prefix_update`] },
    { assoc: `R`, items: [`postfix_update`] },
    { assoc: `R`, items: [`[`, `]`, `{`, `}`, `(`, `)`, `.`] },
  ],
  productions: [
    {
      rule: `Start -> StatementList`,
      emit: `
        {StatementList}
        return_undef;
      `,
    },

    { rule: `StatementList ->` },
    {
      rule: `StatementList -> StatementList Comments Statement`,
      emit: `
        {StatementList}
        {Statement}
      `,
    },

    { rule: `Comments ->` },
    { rule: `Comments -> comment` },
    { rule: `Comments -> Comments comment` },

    { rule: `TrailingComma ->` },
    { rule: `TrailingComma -> ,` },

    { rule: `Label ->` },
    {
      rule: `Label -> identifier :`,
      emit: `
        {identifier}
      `,
    },

    // Labeled statement
    {
      rule: `Statement -> Label Statement`,
    },

    // Empty statement
    {
      rule: `Statement -> ;`,
    },

    // Block statement
    {
      rule: `Statement -> { StatementList }`,
      emit: `
        #BLOCK(StatementList)
      `,
      disable: `ObjectLiteral`,
    },

    // Variable declaration
    {
      rule: `Statement -> var VariableList ;`,
      emit: `
        {VariableList}
      `,
    },
    {
      rule: `VariableList -> VariableDeclaration`,
      emit: `
        {VariableDeclaration}
      `,
    },
    {
      rule: `VariableList -> VariableList , VariableDeclaration`,
      emit: `
        {VariableList}
        {VariableDeclaration}
      `,
    },
    {
      rule: `VariableDeclaration -> identifier`,
      emit: `
        add_local {identifier};
      `,
    },
    {
      rule: `VariableDeclaration -> identifier = Expression`,
      emit: `
        add_local {identifier};
        {Expression}
        set_local {identifier};
      `,
    },

    // Function declaration
    {
      rule: `Statement -> function identifier FunctionImpl`,
      emit: `
        add_local {identifier};
        new_closure #FUNCTION(FunctionImpl);
        set_fn_local {identifier};
      `,
      disable: `FunctionExpression`,
    },
    {
      rule: `FunctionImpl -> ( ) { StatementList }`,
      emit: `
        {StatementList}
        return_undef;
      `,
    },
    {
      rule: `FunctionImpl -> ( Parameters TrailingComma ) { StatementList }`,
      emit: `
        {Parameters}
        {StatementList}
        return_undef;
      `,
    },
    {
      rule: `Parameters -> identifier`,
      emit: `
        add_local {identifier};
        set_param {identifier};
      `,
    },
    {
      rule: `Parameters -> Parameters , identifier`,
      emit: `
        {Parameters}
        add_local {identifier};
        set_param {identifier};
      `,
    },

    // FIXME: lexical declaration cannot appear in a single-statment context.
    // If statement
    {
      rule: `Statement -> if ( Expression ) Statement`,
      emit: `
        {Expression}
        test :END;
        {Statement}
        label :END;
      `,
    },
    {
      rule: `Statement -> if ( Expression ) Statement else Statement`,
      emit: `
        {Expression}
        test :ELSE;
        {5}
        goto :END;
        label :ELSE;
        {7}
        label :END;
      `,
    },

    // While statement
    {
      rule: `Statement -> Label while ( CommaExpression ) Statement`,
      emit: `
        label :START;
        {CommaExpression}
        test :END;
        #LOOP(Statement, Label, START, END)
        goto :START;
        label :END;
      `,
    },

    // For statement
    {
      rule: `Statement -> Label for ( ForInit ; ForExpr ; ForExpr ) Statement`,
      emit: `
        {ForInit}
        label :START;
        get_const true;
        {6}
        test :END;
        #LOOP(Statement, Label, START, END)
        {8}
        goto :START;
        label :END;
      `,
    },
    { rule: `ForInit ->` },
    {
      rule: `ForInit -> var VariableList`,
      emit: `
        {VariableList}
      `,
    },
    {
      rule: `ForInit -> CommaExpression`,
      emit: `
        {CommaExpression}
      `,
    },
    { rule: `ForExpr ->` },
    {
      rule: `ForExpr -> CommaExpression`,
      emit: `
        {CommaExpression}
      `,
    },

    // Break statement
    {
      rule: `Statement -> break ;`,
      emit: `
        break;
      `,
    },
    {
      rule: `Statement -> break identifier ;`,
      emit: `
        break {identifier};
      `,
    },

    // Continue statement
    {
      rule: `Statement -> continue ;`,
      emit: `
        continue;
      `,
    },
    {
      rule: `Statement -> continue identifier ;`,
      emit: `
        continue {identifier};
      `,
    },

    // Return statement
    {
      rule: `Statement -> return ;`,
      emit: `
        return_undef;
      `,
    },
    {
      rule: `Statement -> return CommaExpression ;`,
      emit: `
        {CommaExpression}
        return;
      `,
    },

    // Expression statement
    {
      rule: `Statement -> CommaExpression ;`,
      emit: `
        {CommaExpression}
      `,
    },

    // Comma expression
    {
      rule: `CommaExpression -> Expression`,
      emit: `
        {Expression}
      `,
    },
    {
      rule: `CommaExpression -> CommaExpression , Expression`,
      emit: `
        {CommaExpression}
        {Expression}
      `,
    },

    // Parenthesized expression
    {
      rule: `Expression -> ( CommaExpression )`,
      emit: `
        {CommaExpression}
      `,
    },

    // Ternary expression
    {
      rule: `Expression -> Expression ? Expression : Expression`,
      emit: `
        {1}
        test :ELSE;
        {3}
        goto :END;
        label :ELSE;
        {5}
        label :END;
      `,
    },

    // Simple assignment
    {
      rule: `Expression -> identifier = Expression`,
      emit: `
        {Expression}
        set_local {identifier};
      `,
    },
    {
      rule: `Expression -> PropertyReference = Expression`,
      emit: `
        {PropertyReference}
        push;
        {Expression}
        op3 set_prop;
      `,
    },

    // Compound assignment
    {
      rule: `Expression -> identifier compound Expression`,
      emit: `
        get_local {identifier};
        push;
        {Expression}
        op2 {compound};
        set_local {identifier};
      `,
    },
    {
      rule: `Expression -> PropertyReference compound Expression`,
      emit: `
        {PropertyReference}
        push;
        {Expression}
        op3 {compound};
      `,
    },

    // Logical operators
    {
      rule: `Expression -> Expression || Expression`,
      emit: `
        {1}
        test_or :END;
        {2}
        label :END;
      `,
    },
    {
      rule: `Expression -> Expression && Expression`,
      emit: `
        {1}
        test_and :END;
        {2}
        label :END;
      `,
    },

    // Equality operators
    {
      rule: `Expression -> Expression equality Expression`,
      emit: `
        {1}
        push;
        {3}
        op2 {equality};
      `,
    },

    // Comparison operators
    {
      rule: `Expression -> Expression comparison Expression`,
      emit: `
        {1}
        push;
        {3}
        op2 {comparison};
      `,
    },

    // Additive operators
    {
      rule: `Expression -> Expression additive Expression`,
      emit: `
        {1}
        push;
        {3}
        op2 {additive};
      `,
    },

    // Multiplicative operators
    {
      rule: `Expression -> Expression multiplicative Expression`,
      emit: `
        {1}
        push;
        {3}
        op2 {multiplicative};
      `,
    },

    // Unary operators
    {
      rule: `Expression -> prefix_unary Expression`,
      emit: `
        {Expression}
        op1 {prefix_unary};
      `,
    },
    {
      rule: `Expression -> prefix_update identifier`,
      emit: `
        {prefix_update}% {identifier};
      `,
    },
    {
      rule: `Expression -> identifier postfix_update`,
      emit: `
        %{postfix_update} {identifier};
      `,
    },
    {
      rule: `Expression -> prefix_update PropertyReference`,
      emit: `
        {PropertyReference}
        {prefix_update}.;
      `,
    },
    {
      rule: `Expression -> PropertyReference postfix_update`,
      emit: `
        {PropertyReference}
        .{postfix_update};
      `,
    },

    // Primary expressions
    {
      rule: `Expression -> FunctionExpression`,
      emit: `
        {FunctionExpression}
      `,
    },
    {
      rule: `FunctionExpression -> function FunctionImpl`,
      emit: `
        new_closure #FUNCTION(FunctionImpl);
      `,
    },
    {
      rule: `FunctionExpression -> function identifier FunctionImpl`,
      emit: `
        new_closure #FUNCTION(FunctionImpl, identifier);
      `,
    },
    {
      rule: `Expression -> literals`,
      emit: `
        get_const {literals};
      `,
    },
    {
      rule: `Expression -> number`,
      emit: `
        get_const n:{number};
      `,
    },
    {
      rule: `Expression -> string`,
      emit: `
        get_const s:#STRING(string);
      `,
    },
    {
      rule: `Expression -> identifier`,
      emit: `
        get_local {identifier};
      `,
    },
    {
      rule: `Expression -> PropertyReference`,
      emit: `
        {PropertyReference}
        op2 get_prop;
      `,
    },
    {
      rule: `PropertyReference -> Expression . identifier`,
      emit: `
        {Expression}
        push;
        get_const s:#STRING(identifier);
      `,
    },
    {
      rule: `PropertyReference -> Expression [ Expression ]`,
      emit: `
        {1}
        push;
        {3}
      `,
    },

    // Object literal expression
    {
      rule: `Expression -> ObjectLiteral`,
      emit: `
        {ObjectLiteral}
      `,
    },
    {
      rule: `ObjectLiteral -> { }`,
      emit: `
        new_object;
      `,
    },
    {
      rule: `ObjectLiteral -> { PropertyList TrailingComma }`,
      emit: `
        new_object;
        push;
        {PropertyList}
        pop;
      `,
    },
    {
      rule: `PropertyList -> Property`,
      emit: `
        {Property}
      `,
    },
    {
      rule: `PropertyList -> PropertyList , Property`,
      emit: `
        {PropertyList}
        {Property}
      `,
    },
    {
      rule: `Property -> string : Expression`,
      emit: `
        get_const s:#STRING(string);
        push;
        {Expression}
        op2 add_prop;
      `,
    },
    {
      rule: `Property -> identifier : Expression`,
      emit: `
        get_const s:#STRING(identifier);
        push;
        {Expression}
        op2 add_prop;
      `,
    },
    {
      rule: `Property -> [ Expression ] : Expression`,
      emit: `
        {2}
        push;
        {5}
        op2 add_prop;
      `,
    },

    // Array literal expression
    {
      rule: `Expression -> [ Arguments ]`,
      emit: `
        recv_args;
        {Arguments}
        new_array;
      `,
    },

    // Function call expression
    {
      rule: `Expression -> Expression ( Arguments )`,
      emit: `
        {Expression}
        recv_args;
        {Arguments}
        call;
      `,
    },

    // Arguments for both function call and array expression
    { rule: `Arguments ->` },
    {
      rule: `Arguments -> ArgumentList TrailingComma`,
      emit: `
        {ArgumentList}
      `,
    },
    {
      rule: `ArgumentList -> ArgumentList , Expression`,
      emit: `
        {ArgumentList}
        {Expression}
      `,
    },
    {
      rule: `ArgumentList -> Expression`,
      emit: `
        {Expression}
      `,
    },
  ],
};
