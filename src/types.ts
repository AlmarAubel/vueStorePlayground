import { ComputedRef } from "vue";

export type Actions<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};

export type Getters<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => ComputedRef<infer R>
    ? (...args: P) => ComputedRef<R>
    : A[k] extends ComputedRef<infer Z>
    ? ComputedRef<Z>
    : never;
};

export type Mutations<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};
