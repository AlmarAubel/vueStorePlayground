type functionType = <T extends Array<any>, U>(...args: any) => U;
type functionType2 = (...args: any[]) => any;

export type Actions<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => Promise<infer R>
    ? (...args: P) => Promise<R>
    : never;
};

const bar = {
  fiets: async (a: string, b: number) => Promise.resolve("fiets"),
  auto: () => "aaa",
};

const createstore = <T extends Actions<T>>(foo: T) => {
  return {
    foo,
  };
};

const store = createstore(bar);
store.foo.fiets("a", 2);
store.foo.fiets("a", 3);
const x: Actions<typeof bar> = bar;
