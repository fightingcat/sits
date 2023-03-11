const grammar = require("./grammar");

const epsilon = "";

const alias_to_symbols = Object.assign(create_map(), grammar.aliases);
const symbol_to_productions = create_map();
const symbol_to_precedence = create_map();
const symbol_to_first_set = create_map();

const closure_id_to_items = create_map();
const closure_id_to_shift = create_map();
const closure_id_to_goto = create_map();

const traversing = new Set();
const propagation_items = new Set();

function update_set(set, items) {
  const size = set.size;
  for (const item of items) set.add(item);
  return set.size - size;
}

function resolve_alias(symbol) {
  return alias_to_symbols[symbol] ?? [symbol];
}

function get_precedence(rhs) {
  const symbol = rhs.find((s) => symbol_to_precedence[s]);
  return symbol ? symbol_to_precedence[symbol] : null;
}

function get_closure_id(kernel) {
  const itemIds = kernel.map((item) => item.id);
  return itemIds.sort((a, b) => a - b).join(",");
}

function create_map() {
  return Object.create(null);
}

function create_production(index, lhs, rhs, config) {
  const is_start = lhs === grammar.start_symbol;
  return { is_start, index, lhs, rhs, config };
}

function create_item(production, cursor, source, lookahead) {
  const item = {
    id: (production.index << 12) | cursor,
    production,
    cursor,
    next: production.rhs[cursor],
    source,
    targets: new Set(),
    lookahead: new Set(lookahead),
  };
  source?.targets.add(item);
  return item;
}

function trace_item(item, verbose) {
  const part1 = item.production.rhs.slice(0, item.cursor);
  const part2 = item.production.rhs.slice(item.cursor);
  const core = `${item.production.lhs} ⇒ ${[...part1, "•", ...part2].join(" ")}`;

  if (verbose) {
    const padding = " ".repeat(Math.max(2, 80 - core.length));
    const lookahead = [...item.lookahead].join(" ");
    return `${core}${padding}ID: ${item.id} LAH: ${lookahead}`;
  }
  return core;
}

function advance_item(item) {
  return create_item(item.production, item.cursor + 1, item, item.lookahead);
}

function expand_item(item) {
  if (item.next && symbol_to_productions[item.next]) {
    const lookahead = new Set();
    const rhs = item.production.rhs;
    let source = item;

    for (let i = item.cursor + 1; source && i < rhs.length; i++) {
      update_set(lookahead, symbol_to_first_set[rhs[i]]);
      if (!lookahead.delete(epsilon)) source = undefined;
    }
    if (source) {
      update_set(lookahead, source.lookahead);
    }
    return symbol_to_productions[item.next].map((production) =>
      // Reuse the same lookahead, so we don't need to sync them.
      Object.assign(create_item(production, 0, source), { lookahead }),
    );
  }
  return [];
}

// Parse precedence rules.
grammar.precedence.forEach(({ assoc, items }, precedence) => {
  items.forEach((item) => {
    symbol_to_precedence[item] = { assoc, precedence };
  });
});

// Parse production rules.
grammar.productions.reduce((index, config) => {
  const result = config.rule.match(/^(\w+)\s*->(.*)$/);

  if (!result) {
    throw Error(`Incorrect production: "${config.rule}"`);
  }
  const lhs = result[1];
  const rhs = result[2].trim().split(/\s+|$/);

  symbol_to_productions[lhs] ??= [];
  symbol_to_productions[lhs].push(create_production(index++, lhs, rhs, config));
  return index;
}, 1);

// Add terminals to their first set.
Object.keys(symbol_to_productions).forEach(function traverse(symbol) {
  if (!symbol_to_first_set[symbol]) {
    const productions = symbol_to_productions[symbol];

    symbol_to_first_set[symbol] = new Set(productions ? null : resolve_alias(symbol));
    productions?.forEach((prod) => prod.rhs.forEach(traverse));
  }
});

// Add ε to the first set.
Object.keys(symbol_to_productions).forEach(function traverse(symbol) {
  if (!traversing.has(symbol)) {
    traversing.add(symbol);

    symbol_to_productions[symbol]?.forEach(({ lhs, rhs }) => {
      if (rhs.every(traverse)) symbol_to_first_set[lhs].add(epsilon);
    });
    traversing.delete(symbol);
  }
  return symbol_to_first_set[symbol].has(epsilon);
});

// Build the complete first set.
Object.keys(symbol_to_productions).forEach(function backtrack(symbol) {
  if (!traversing.has(symbol)) {
    traversing.add(symbol);

    symbol_to_productions[symbol]?.forEach(({ lhs, rhs }) => {
      for (let e = true, i = 0; e && i < rhs.length; i++) {
        e = backtrack(rhs[i]);
        update_set(symbol_to_first_set[lhs], symbol_to_first_set[rhs[i]]);
      }
    });
    traversing.delete(symbol);
  }
  return symbol_to_first_set[symbol].has(epsilon);
});

// Build closures.
const closure_kernel_stack = [
  symbol_to_productions[grammar.start_symbol].map((prod) =>
    create_item(prod, 0, undefined, [grammar.end_symbol]),
  ),
];

for (const new_kernel of closure_kernel_stack) {
  const closure_item_stack = new_kernel.slice();
  const closure_id = get_closure_id(new_kernel);
  const closure_items = closure_id_to_items[closure_id] ?? create_map();
  const disabled = create_map();

  // Build closure items.
  for (const new_item of closure_item_stack) {
    const existing_item = closure_items[new_item.id];

    if (existing_item) {
      if (new_item.source) {
        new_item.source.targets.add(existing_item);
        propagation_items.add(new_item.source);
      }
      update_set(existing_item.lookahead, new_item.lookahead);
      continue;
    }
    if (new_item.production.config.disable) {
      disabled[new_item.production.config.disable] = true;
    }
    if (disabled[new_item.production.lhs]) {
      continue;
    }
    closure_items[new_item.id] = new_item;
    closure_item_stack.push(...expand_item(new_item));
  }
  // Calculate new kernels.
  if (!closure_id_to_items[closure_id]) {
    const new_kernel_map = create_map();
    const closure_shift = create_map();
    const closure_goto = create_map();

    Object.values(closure_items).forEach((item) => {
      if (item.next) {
        resolve_alias(item.next).forEach((symbol) => {
          new_kernel_map[symbol] ??= [];
          new_kernel_map[symbol].push(advance_item(item));
        });
      }
    });
    Object.entries(new_kernel_map).forEach(([next, kernel]) => {
      const goto_or_shift = symbol_to_productions[next] ? closure_goto : closure_shift;
      goto_or_shift[next] = get_closure_id(kernel);
      closure_kernel_stack.push(kernel);
    });
    closure_id_to_items[closure_id] = closure_items;
    closure_id_to_shift[closure_id] = closure_shift;
    closure_id_to_goto[closure_id] = closure_goto;
  }
}

// Propagate lookahead.
propagation_items.forEach(function (item) {
  function propagate(item, lookahead) {
    if (update_set(item.lookahead, lookahead) > 0 || !traversing.has(item)) {
      traversing.add(item);
      item.targets.forEach((target) => propagate(target, item.lookahead));
    }
  }
  item.targets.forEach((target) => {
    traversing.clear();
    propagate(target, item.lookahead);
  });
});

// Resolve conflicts with precedence.
Object.keys(closure_id_to_items).forEach((closure_id) => {
  const closure_items = closure_id_to_items[closure_id];
  const closure_shift = closure_id_to_shift[closure_id];

  Object.values(closure_items).forEach((item) => {
    if (item.next) return;

    item.lookahead.forEach((lahSymbol) => {
      // No shift-reduce conflict.
      if (!closure_shift[lahSymbol]) return;

      // Reduce to an ε-production, prefer shift.
      if (item.production.rhs.length === 0) {
        return item.lookahead.delete(lahSymbol);
      }

      // The first symbol's precedence is used for the reduce.
      const reduce_prec = get_precedence(item.production.rhs);
      const shift_prec = symbol_to_precedence[lahSymbol];

      // No defined precedence for the reduce, prefer shift.
      if (!reduce_prec) {
        return item.lookahead.delete(lahSymbol);
      }
      // No defined precedence for the shift, prefer reduce.
      if (!shift_prec) {
        return delete closure_shift[lahSymbol];
      }
      // The reduce's precedence is lower than the shift's, prefer shift.
      if (reduce_prec.precedence < shift_prec.precedence) {
        return item.lookahead.delete(lahSymbol);
      }
      // The reduce's precedence is higher than the shift's, prefer reduce.
      if (reduce_prec.precedence > shift_prec.precedence) {
        return delete closure_shift[lahSymbol];
      }
      // The associativity of the reduce is "right", prefer shift.
      if (reduce_prec.assoc === "R") {
        return item.lookahead.delete(lahSymbol);
      }
      // The associativity of the reduce is "left", prefer reduce.
      if (reduce_prec.assoc === "L") {
        return delete closure_shift[lahSymbol];
      }
      // Unable to determine the operation to apply.
      throw new Error(`Shift-reduce conflict: ${item.id}`);
    });
    if (item.lookahead.size === 0) {
      delete closure_items[item.id];
    }
  });
});

function read_comment(fn) {
  return fn.toString().match(/\/\*([^]+)\*\//)?.[1] ?? "";
}

function reverse_map_entries(map) {
  const reverse_map = create_map();

  Object.entries(map).forEach(([key, value]) => {
    reverse_map[value] ??= [];
    reverse_map[value].push(key);
  });
  return Object.entries(reverse_map);
}

function output_union(symbols) {
  const sorted = [...symbols].sort().map((s) => `| "${s}"`);
  const lines = [""];

  sorted.forEach((s) => {
    if (lines[lines.length - 1].length + s.length > 70) {
      lines.push("");
    }
    lines[lines.length - 1] = lines[lines.length - 1] + s;
  });
  const union = lines.map((l) => `| (${l})`).join("\n");

  if (!union_map.has(union)) {
    union_map.set(union, `type Union${union_map.size} = ${union};`);
  }
  return /type (Union\d+) =/.exec(union_map.get(union))[1];
}

function output_drop(n) {
  types_drop.add(`type Drop${n}<T extends List<unknown>> = T${"[1]".repeat(n)};`);
}

const template = read_comment(() => {
  /*
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
    ParseImpl<Source, { 0: 0, 1: never }, { 0: "", 1: never }, [], ImitatedSetNew, "0", 0>;

  type Throw<Error, Source, States, Output> = {
    error: Error,
    source: Source,
    states: States,
    output: Output,
  };

  type List<T> = { 0: T, 1: List<T> };

  type GetStringId<
    ROData extends ImitatedSet<string>,
    String extends string
  > = ImitatedSetFind<ROData, String> extends ""
    ? ROData["size"]
    : ImitatedSetFind<ROData, String>;

  type EmitFunction<
    Chunks extends string[],
    Code extends string,
    Ident extends string = ""
  > = [...Chunks, PatchFunction<BindIdentifier<Code, Ident>>];

  type BindIdentifier<Code extends string, Ident extends string> =
    Ident extends "" ? Code : `add_local ${Ident};set_callee ${Ident};${Code}`;

  type PatchFunction<Code extends string> =
    PatchGetLocalAndSetLocal<
      HoistAddLocal<HoistSetFnLocal<Code>>[0],
      HoistAddLocal<HoistSetFnLocal<Code>>[1]
    >;

  type HoistSetFnLocal<
    Code extends string,
    Output extends string = ""
  > = Code extends `${infer L}new_closure ${infer F};set_fn_local ${infer X};${infer R}`
    ? HoistSetFnLocal<R, `new_closure ${F};set_local ${X};${Output}${L}`>
    : `${Output}${Code}`;

  type HoistAddLocal<
    Code extends string,
    Output extends string = "",
    Hoisted extends string = never
  > = Code extends `${infer L}add_local ${infer X};${infer R}`
    ? HoistAddLocal<R, `${X extends Hoisted ? "" : `add_local ${X};`}${Output}${L}`, Hoisted | X>
    : [`${Output}${Code}`, Hoisted];

  type PatchGetLocalAndSetLocal<
    Code extends string,
    Locals extends string
  > = PatchGetLocal<PatchSetLocal<Code, Locals>, Locals>;

  type PatchGetLocal<
    Code extends string,
    Locals extends string,
    Output extends string = "",
  > = Code extends `${infer L}get_local ${infer X};${infer R}`
    ? PatchGetLocal<R, Locals, `${Output}${L}${X extends Locals ? "get_local" : "get_upval"} ${X};`>
    : `${Output}${Code}`;

  type PatchSetLocal<
    Code extends string,
    Locals extends string,
    Output extends string = "",
  > = Code extends `${infer L}set_local ${infer X};${infer R}`
    ? PatchSetLocal<R, Locals, `${Output}${L}${X extends Locals ? "set_local" : "set_upval"} ${X};`>
    : `${Output}${Code}`;

  type ResolveLabel<
    Code extends string,
    Label extends string,
    Start extends string,
    End extends string
  > = ReplaceAll<
    ReplaceAll<Code, "break;" | `break ${Label};`, `goto ${End};`>,
    "continue;" | `continue ${Label};`,
    `goto ${Start};`
  >;

  $TYPEDEFS$

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
    : $ACTIONS$
    : Throw<`Unexpected lookahead: "${Scan<Source>[1]}".`, Source, States, Output>;

  type ParseGoto<
    Source extends string,
    Symbol extends string,
    States extends List<number>,
    Output extends List<string>,
    Chunks extends string[],
    ROData extends ImitatedSet<string>,
    UniqId extends string,
    Counter extends IncrU8[number]
  > = $GOTOS$
    : Throw<`Error goto on "${Symbol}"`, Source, States, Output>;
  */
});
const state_map = new Map();
const union_map = new Map();
const types_drop = new Set();
const switch_state_actions = [];
const switch_state_gotos = [];

Object.keys(closure_id_to_items).forEach((closure_id) => {
  const closure_items = closure_id_to_items[closure_id];
  const closure_shift = closure_id_to_shift[closure_id];
  const closure_goto = closure_id_to_goto[closure_id];
  const reduce_cases = [];
  const shift_cases = [];
  const goto_cases = [];
  const curr_state =
    state_map.get(closure_id) ??
    state_map.set(closure_id, state_map.size).get(closure_id);

  // Emit code for reduce operations.
  Object.values(closure_items).forEach((item) => {
    if (item.next) return;

    const { lhs, rhs, config } = item.production;
    const lookah = output_union(item.lookahead);
    const labels = create_map();

    let output = config.emit ?? "";
    let chunks = "Chunks";
    let rodata = "ROData";
    let uniqid = "UniqId";

    function subst_symbol(s) {
      const i = parseInt(s) || rhs.indexOf(s) + 1;

      if (i < 1 && i > rhs.length) {
        throw new Error(`Invalid substitution: ${s}.`);
      }
      if (i < rhs.length) {
        output_drop(rhs.length - i);
        return `Drop${rhs.length - i}<Output>[0]`;
      }
      return `Output[0]`;
    }

    function subst_label(s) {
      return labels[s] ?? (labels[s] = uniqid = `Incr<${uniqid}>`);
    }

    output = ("`" + output.replace(/\s*\n\s*/g, "") + "`")
      .replace(/\{(\w+)\}/g, (_, s) => "${" + subst_symbol(s) + "}")
      .replace(/:(\w+)/g, (_, s) => "${" + subst_label(s) + "}");

    output = output.replace(/#FUNCTION\((.+)\)/, (_, s) => {
      const [chunk, ident] = s.split(/,\s*/);
      chunks = `EmitFunction<
        Chunks,
        ${subst_symbol(chunk)},
        ${ident ? subst_symbol(ident) : ""}
      >`;
      return '${ Chunks["length"] }';
    });

    output = output.replace(/#STRING\((.+)\)/, (_, s) => {
      rodata = `ImitatedSetAdd<ROData, ${subst_symbol(s)}>`;
      return `\${ GetStringId<ROData, ${subst_symbol(s)}> }`;
    });

    output = output.replace(/#BLOCK\((.+)\)/, (_, s) => {
      return `\${ HoistSetFnLocal<${subst_symbol(s)}> }`;
    });

    output = output.replace(/#LOOP\((.+)\)/, (_, s) => {
      const [chunk, label, start, end] = s.split(/,\s*/);
      return `\${ResolveLabel<
        ${subst_symbol(chunk)},
        ${subst_symbol(label)},
        ${subst_label(start)},
        ${subst_label(end)},
      >}`;
    });
    if (lhs === grammar.start_symbol) {
      reduce_cases.push(
        `Scan<Source>[1] extends ${lookah} ? {
          chunks: EmitFunction<Chunks, ${output}>,
          rodata: ROData
        } /*END*/`,
      );
      return;
    }
    if (rhs.length === 0) {
      const state =
        state_map.get(closure_goto[lhs]) ??
        state_map.set(closure_goto[lhs], state_map.size).get(closure_goto[lhs]);

      reduce_cases.push(
        `Scan<Source>[1] extends ${lookah} ? ParseImpl<
          Source,
          { 0: ${state}, 1: States },
          { 0: ${output}, 1: Output },
          ${chunks},
          ${rodata},
          ${uniqid},
          IncrU8[Counter]
        >`,
      );
      return;
    }
    output_drop(rhs.length);
    reduce_cases.push(
      `Scan<Source>[1] extends ${lookah} ? ParseGoto<
        Source,
        "${lhs}",
        Drop${rhs.length}<States>,
        { 0: ${output}, 1: Drop${rhs.length}<Output> },
        ${chunks},
        ${rodata},
        ${uniqid},
        IncrU8[Counter]
      >`,
    );
  });

  // Emit code for shift operations.
  reverse_map_entries(closure_shift).forEach(([next_closure_id, lookahead]) => {
    const state =
      state_map.get(next_closure_id) ??
      state_map.set(next_closure_id, state_map.size).get(next_closure_id);

    shift_cases.push(
      `Scan<Source>[1] extends ${output_union(lookahead)} ? ParseImpl<
        Scan<Source>[0],
        { 0: ${state}, 1: States },
        { 0: Scan<Source>[2], 1: Output },
        Chunks,
        ROData,
        UniqId,
        IncrU8[Counter]
      >`,
    );
  });

  if (reduce_cases.length + shift_cases.length > 0) {
    const branches_all = [
      ...shift_cases,
      ...reduce_cases,
      `Throw<\`Unexpected "\${Scan<Source>[2]}"\`, Source, States, Output>`,
    ];
    switch_state_actions.push(
      `States[0] extends ${curr_state} ? ${branches_all.join("\n: ")}`,
    );
  }

  // Emit code for goto operations.
  reverse_map_entries(closure_goto).forEach(([next_closure_id, symbols]) => {
    const union = output_union(symbols);
    const next_state =
      state_map.get(next_closure_id) ??
      state_map.set(next_closure_id, state_map.size).get(next_closure_id);

    goto_cases.push(
      `Symbol extends ${union} ? ParseImpl<
        Source, { 0: ${next_state}, 1: States }, Output, Chunks, ROData, UniqId, Counter>`,
    );
  });

  if (goto_cases.length > 0) {
    const branches_all = goto_cases.concat(
      `Throw<\`Unexpected "\${Symbol}"\`, Source, States, Output>`,
    );
    switch_state_gotos.push(
      `States[0] extends ${curr_state} ? ${branches_all.join("\n: ")}`,
    );
  }

  console.log(`\nstate ${curr_state}:`);

  Object.values(closure_items).forEach((item) => {
    console.log(`    ${trace_item(item, true)}`);
  });
});

const parser_gen_d_ts = template
  .replace("$TYPEDEFS$", [...union_map.values(), ...types_drop].join("\n\n"))
  .replace("$ACTIONS$", switch_state_actions.join("\n: "))
  .replace("$GOTOS$", switch_state_gotos.join("\n: "));

require("fs").writeFileSync(
  require("path").resolve(__dirname, "../lib/parser.d.ts"),
  require("prettier").format(parser_gen_d_ts, {
    parser: "typescript",
    printWidth: 90,
    trailingComma: "all",
  }),
  // parser_gen_d_ts,
  "utf-8",
);
