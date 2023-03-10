export type PickByType<Object, Type> = {
  [K in keyof Object]: Object[K] extends Type ? K : never;
};

export type ReplaceAll<
  String extends string,
  Search extends string,
  Replace extends string,
  Result extends string = "",
> = String extends `${infer Left}${Search}${infer Right}`
  ? ReplaceAll<Right, Search, Replace, `${Result}${Left}${Replace}`>
  : `${Result}${String}`;

type _ = string;

export type List<T, P = any> = { 0: T; 1: P };

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
