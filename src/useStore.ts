import { InjectionKey, readonly, toRefs } from "vue";

import reduxHelper from "./reduxDevHelper";
type Options = {
  logging: boolean;
};

// TODO in een latere fase, Mutations afdwingen dat er alleen functie's in het object zitten die geen promise returnen
// TODO in een latere fase Actions afdwingen dat er alleen functie's in het object zitten
// TODO de log functie ook een diff tussen de state before en stateafter laten zien.

const useStore = <
  // The state
  // eslint-disable-next-line @typescript-eslint/ban-types
  TState extends object,
  // Mutations that have no side effects beside changing the state
  TMutations extends (s: TState) => ReturnType<TMutations>,
  // Actions that have side effects. Actions can change state. Side effects for example an api call
  TActions extends (
    m: ReturnType<TMutations>,
    s: TState
  ) => ReturnType<TActions>
>(
  name: string,
  state: TState,
  mutations: TMutations,
  actions: TActions,
  options?: Options
) => {
  const redux = reduxHelper(name, state);

  redux.subscribe((s: TState) => {
    console.log("subscrirbe", s);
    Object.assign(state, s);
  });
  const readonlyState = toRefs(readonly(state));
  const wrappedMutations = options?.logging
    ? addLogging(mutations(state))
    : mutations(state);
  const store = {
    state: readonlyState,
    mutations: wrappedMutations,
    actions: actions(wrappedMutations, readonlyState as TState),
  };

  const initMockStore = (a: TActions): typeof store => {
    return {
      state: readonlyState,
      mutations: wrappedMutations,
      actions: a(wrappedMutations, readonlyState as TState),
    };
  };

  const injectionKey: InjectionKey<typeof store> = Symbol(name);

  function logDecorator<T extends Array<any>, U>(fn: (...args: T) => U) {
    return (...args: T): U => {
      const stateBefore = deepCopyObject(state);
      const result = fn(...args);
      const stateAfter = deepCopyObject(state);
      redux.send(args, state);
      console.log(
        `Store: ${name} state changed by ${fn.name}`,
        stateBefore,
        stateAfter
      );
      return result;
    };
  }

  function addLogging(object: Record<string, any>) {
    const result: Record<string, any> = {};
    Object.entries(object).forEach(
      ([key, value]) => (result[key] = logDecorator(value))
    );
    return result as unknown as ReturnType<TMutations>;
  }

  return {
    store,
    injectionKey,
  };
};
// eslint-disable-next-line @typescript-eslint/ban-types
const deepCopyObject = (object: Object) => JSON.parse(JSON.stringify(object));
export default useStore;
