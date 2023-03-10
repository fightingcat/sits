import { Incr } from "./math";

export type ReplaceAll<
  String extends string,
  Search extends string,
  Replace extends string,
  Result extends string = "",
> = String extends `${infer Left}${Search}${infer Right}`
  ? ReplaceAll<Right, Search, Replace, `${Result}${Left}${Replace}`>
  : `${Result}${String}`;

type _ = string;

// For object imitation.

export type AddBarrier<
  Storage extends string,
  Barrier extends string,
> = `#${Barrier}#${Storage}`;

export type FindBarrier<
  Storage extends string,
  Mark extends string,
  Key extends string = _,
  Val extends string = _,
> = Storage extends `${_}${Mark}${Key}:${Val}${Mark}${_}#${infer BR}#${_}` ? BR : "";

export type DropBarrier<Storage extends string> =
  Storage extends `${_}#${_}#${infer Storage}` ? Storage : Storage;

export type HasItem<
  Mark extends string,
  Key extends string,
  Val extends string = _,
> = `${_}${Mark}${Key}:${Val}${Mark}${_}`;

export type AddItem<
  Storage extends string,
  Mark extends string,
  Key extends string,
  Val extends string,
> = `${Mark}${Key}:${Val}${Mark}${Storage}`;

export type SetItem<
  Storage extends string,
  Mark extends string,
  Key extends string,
  Val extends string,
> = Storage extends `${infer L}${Mark}${Key}:${_}${Mark}${infer R}`
  ? `${L}${Mark}${Key}:${Val}${Mark}${R}`
  : `${Mark}${Key}:${Val}${Mark}${Storage}`;

export type DelItem<
  Storage extends string,
  Mark extends string,
  Key extends string,
> = Storage extends `${infer L}${Mark}${Key}:${_}${Mark}${infer R}`
  ? `${L}${R}`
  : Storage;

export type GetItem<
  Storage extends string,
  Mark extends string,
  Key extends string,
> = Storage extends `${_}${Mark}${Key}:${infer Val}${Mark}${_}` ? Val : "";

export type GetItemNearBy<
  Storage extends string,
  Mark extends string,
  Key extends string,
> = Storage extends `${infer Storage}#${_}`
  ? GetItem<Storage, Mark, Key>
  : GetItem<Storage, Mark, Key>;

// Use this instead of tuples to reduce type instantiations.

export type ImitatedSet<T = unknown> = { size: string; items: { k: string; v: T } };

export type ImitatedSetNew = { size: "0"; items: never };

export type ImitatedSetAdd<Set extends ImitatedSet, Val> = Val extends Set["items"]["v"]
  ? Set
  : { size: Incr<Set["size"]>; items: Set["items"] | { k: Set["size"]; v: Val } };

export type ImitatedSetGet<
  Set extends ImitatedSet,
  Key extends string,
> = Set["items"] extends infer T
  ? T extends { k: Key; v: infer Val }
    ? Val
    : never
  : never;

export type ImitatedSetFind<
  Set extends ImitatedSet,
  Val extends string,
> = String extends Set["items"]["v"]
  ? Set["items"] extends infer Items
    ? Items extends { 0: infer I; 1: Val }
      ? I
      : never
    : never
  : "";
