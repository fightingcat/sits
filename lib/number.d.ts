type LUTBCD = {
  "0": "0000";
  "1": "0001";
  "2": "0010";
  "3": "0011";
  "4": "0100";
  "5": "0101";
  "6": "0110";
  "7": "0111";
  "8": "1000";
  "9": "1001";
};

type LUTDEC = {
  "0000": "0";
  "0001": "1";
  "0010": "2";
  "0011": "3";
  "0100": "4";
  "0101": "5";
  "0110": "6";
  "0111": "7";
  "1000": "8";
  "1001": "9";
};

type LUTSUB3 = {
  "0000": "0000";
  "0001": "0001";
  "0010": "0010";
  "0011": "0011";
  "0100": "0100";
  "1000": "0101";
  "1001": "0110";
  "1010": "0111";
  "1011": "1000";
  "1100": "1001";
};

type LUTADD3 = {
  "0000": "0000";
  "0001": "0001";
  "0010": "0010";
  "0011": "0011";
  "0100": "0100";
  "0101": "1000";
  "0110": "1001";
  "0111": "1010";
  "1000": "1011";
  "1001": "1100";
};

type SUB3<
  S extends string,
  R extends string = ""
> = S extends `${keyof LUTSUB3}${infer T}`
  ? S extends `${infer K}${T}`
    ? SUB3<T, `${R}${LUTSUB3[K & keyof LUTSUB3]}`>
    : never
  : R;

type ADD3<
  S extends string,
  R extends string = ""
> = S extends `${keyof LUTADD3}${infer T}`
  ? S extends `${infer K}${T}`
    ? ADD3<T, `${R}${LUTADD3[K & keyof LUTADD3]}`>
    : never
  : R;

export type DecimalToBCD<
  DEC extends string,
  BCD extends string = ""
> = DEC extends `${infer K}${infer T}`
  ? DecimalToBCD<T, `${BCD}${LUTBCD[K & keyof LUTBCD]}`>
  : BCD;

export type BCDToDecimal<
  BCD extends string,
  DEC extends string = ""
> = BCD extends `${keyof LUTDEC}${infer T}`
  ? BCD extends `${infer K}${T}`
    ? BCDToDecimal<T, `${DEC}${LUTDEC[K & keyof LUTDEC]}`>
    : never
  : DEC;

export type BCDToBinary<
  BCD extends string,
  BIN extends string = ""
> = BCD extends `${string}1${string}`
  ? BCD extends `${string}0`
    ? BCDToBinary<SUB3<`0${BCD}`>, `0${BIN}`>
    : BCD extends `${string}1`
    ? BCDToBinary<SUB3<`0${BCD}`>, `1${BIN}`>
    : never
  : BIN;

export type BinaryToBCD<
  BIN extends string,
  BCD extends string = "0000"
> = BIN extends `${infer B}${infer BIN}`
  ? ADD3<BCD> extends `0${infer BCD}`
    ? BinaryToBCD<BIN, `${BCD}${B}`>
    : ADD3<BCD> extends `1${infer BCD}`
    ? BinaryToBCD<BIN, `0001${BCD}${B}`>
    : never
  : BCD;

export type DecimalToBinary<DEC extends string> = BCDToBinary<DecimalToBCD<DEC>>;

export type BinaryToDecimal<BIN extends string> = BCDToDecimal<BinaryToBCD<BIN>>;
