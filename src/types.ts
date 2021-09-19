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

//Mutations should be a function but can never be a promise
export type Mutations<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? A[k] extends (...args: infer P) => Promise<infer R>
      ? never
      : (...args: P) => R
    : never;
};
