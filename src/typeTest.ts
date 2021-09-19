import { computed } from "vue";
import { Getters } from "@/types";

type functionType = <T extends Array<any>, U>(...args: any) => U;
type functionType2 = (...args: any[]) => any;
type Actions<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;
};
const computers = () => {
  return {
    fiets: computed(() => "fiets"),
  };
};

const app: Getters<ReturnType<typeof computers>> = computers();

type Mutations<M> = Actions<M>;
const bar = () => ({
  fiets: async (a: string, b: number) => Promise.resolve("fiets"),
});

const createstore = <T extends () => Actions<ReturnType<T>>>(foo: T) => {
  return {
    foo: foo(),
  };
};

const store = createstore(bar);

store.foo.fiets("a", 2);
store.foo.fiets("a", 3);
const x: Actions<typeof bar> = bar;
