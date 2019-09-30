declare namespace sits {
    type __f0<T extends any[]> = (...a: T) => void;
    type __f1<A, T extends any[]> = (a: A, ...b: T) => void;

    type As<T, A> = T extends A ? T : never;

    type Head<T> = T extends { 0: infer H } ? H : never;

    type Last<T> = T extends [] ? never : As<T, any[]>[Tail<T>["length"]];

    type Init<T> = Copy<Tail<T>, T>;

    type Tail<T> = __f0<As<T, any[]>> extends __f1<any, infer R> ? R : never;

    type Unshift<T, A> = __f1<A, As<T, any[]>> extends __f0<infer R> ? R : never;

    type Push<T, U> = Copy<Unshift<T, any>, T & Record<string, U>>;

    type Copy<T, S extends any> = { [P in keyof T]: S[P] };

    type GetProp<T, K extends PropertyKey> = K extends keyof T ? T[K] : undefined;

    type SetProp<T, K extends PropertyKey, V> = Omit<T, K> & Record<K, V>;

    type Switch<Value, Matches> =
        Value extends keyof Matches ? Matches[Value]
        : Matches extends { default: infer R } ? R : never;
}
