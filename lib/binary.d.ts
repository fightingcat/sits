export const enum Ordering {
  EQ = 0,
  LT = 1,
  GT = 2,
}

export type Bit = "0" | "1";

type NOT<B extends Bit> = B extends "0" ? "1" : "0";
type AND<A extends Bit, B extends Bit> = "1" extends A & B ? "1" : "0";
type OR<A extends Bit, B extends Bit> = "1" extends A | B ? "1" : "0";
type XOR<A extends Bit, B extends Bit> = B extends A ? "0" : "1";

type LSB<T> = T extends `${string}1` ? "1" : "0";
type MSB<T> = T extends `1${string}` ? "1" : "0";
type SHL<T> = T extends `${Bit}${infer R}` ? R : "";
type SHR<T> = T extends `${infer R}${Bit}` ? R : "";

export type BitwiseNOT<
  Operand extends string,
  R extends string = ""
> = Operand extends `${string}${Bit}`
  ? BitwiseNOT<SHR<Operand>, `${NOT<LSB<Operand>>}${R}`>
  : R;

export type BitwiseOR<
  OperandA extends string,
  OperandB extends string,
  R extends string = ""
> = "" extends OperandA & OperandB
  ? R
  : BitwiseOR<SHR<OperandA>, SHR<OperandB>, `${OR<LSB<OperandA>, LSB<OperandB>>}${R}`>;

export type BitwiseXOR<
  OperandA extends string,
  OperandB extends string,
  R extends string = ""
> = "" extends OperandA & OperandB
  ? R
  : BitwiseXOR<SHR<OperandA>, SHR<OperandB>, `${XOR<LSB<OperandA>, LSB<OperandB>>}${R}`>;

export type BitwiseAND<
  OperandA extends string,
  OperandB extends string,
  R extends string = ""
> = "" extends OperandA & OperandB
  ? R
  : BitwiseAND<SHR<OperandA>, SHR<OperandB>, `${AND<LSB<OperandA>, LSB<OperandB>>}${R}`>;

export type BinaryCMP<
  OperandA extends string,
  OperandB extends string,
  R extends Ordering = Ordering.EQ
> = "" extends OperandA & OperandB
  ? R
  : BinaryCMP<
      SHR<OperandA>,
      SHR<OperandB>,
      [[R, Ordering.LT], [Ordering.GT, R]][LSB<OperandA>][LSB<OperandB>]
    >;

export type BinaryADD<
  OperandA extends string,
  OperandB extends string,
  C extends Bit = "0",
  R extends string = ""
> = "" extends OperandA & OperandB
  ? `${C extends "1" ? C : ""}${R}`
  : BinaryADD<
      SHR<OperandA>,
      SHR<OperandB>,
      [["0", C], [C, "1"]][LSB<OperandA>][LSB<OperandB>],
      `${XOR<XOR<LSB<OperandA>, LSB<OperandB>>, C>}${R}`
    >;

export type BinarySUB<
  OperandA extends string,
  OperandB extends string,
  C extends Bit = "1",
  R extends string = ""
> = "" extends OperandA & OperandB
  ? R
  : BinarySUB<
      SHR<OperandA>,
      SHR<OperandB>,
      [[C, "0"], ["1", C]][LSB<OperandA>][LSB<OperandB>],
      `${XOR<XOR<LSB<OperandA>, LSB<OperandB>>, NOT<C>>}${R}`
    >;

export type BinaryMUL<
  OperandA extends string,
  OperandB extends string,
  P extends string = OperandA,
  R extends string = ""
> = OperandB extends `${infer OperandB}0`
  ? BinaryMUL<OperandA, OperandB, `${P}0`, R>
  : OperandB extends `${infer OperandB}1`
  ? BinaryMUL<OperandA, OperandB, `${P}0`, BinaryADD<P, R>>
  : R;

export type BinaryDIV<
  OperandA extends string,
  OperandB extends string,
  Q extends string = "",
  R extends string = ""
> = OperandA extends ""
  ? [Q, R]
  : `${R}${MSB<OperandA>}` extends infer Remainder
  ? BinaryCMP<Remainder & string, OperandB> extends Ordering.LT
    ? BinaryDIV<SHL<OperandA>, OperandB, `${Q}0`, Remainder & string>
    : BinaryDIV<SHL<OperandA>, OperandB, `${Q}1`, BinarySUB<Remainder & string, OperandB>>
  : never;
