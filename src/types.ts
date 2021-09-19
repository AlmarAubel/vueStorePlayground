import { ComputedRef } from "vue";

export type Actions<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};

export type Getters<A> = {
  [k in keyof A]: A[k] extends ComputedRef<string>
    ? ComputedRef<string>
    : A[k] extends (...args: infer P) => ComputedRef<infer R>
    ? (...args: P) => ComputedRef<R>
    : never;
};

export type Mutations<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};
