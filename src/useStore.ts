import { InjectionKey, readonly, ref, toRefs, watch } from "vue";

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
  const wrappedMutations = addLogging(mutations(state));
  const wrappedActions = addActionLogging(
    actions(wrappedMutations, state as TState)
  );

  const store = {
    state: readonlyState,
    mutations: wrappedMutations,
    actions: wrappedActions,
  };

  const initMockStore = (a: TActions): typeof store => {
    return {
      state: readonlyState,
      mutations: wrappedMutations,
      actions: addActionLogging(a(wrappedMutations, readonlyState as TState)),
    };
  };

  const injectionKey: InjectionKey<typeof store> = Symbol(name);

  function logDecorator<T extends Array<any>, U>(fn: (...args: T) => U) {
    return (...args: T): U => {
      const result = fn(...args);
      redux.send(fn.name, args, state);
      return result;
    };
  }
  const currFunc = {
    name: "",
    args: {},
  };
  const shouldLog = ref(false);

  watch(state, (value) => {
    console.log("shoudlog", shouldLog.value);
    shouldLog.value
      ? redux.send("stateChanged" + "-" + currFunc.name, currFunc.args, value)
      : null;
  });
  function actionLogDecorator<T extends Array<any>, U>(fn: (...args: T) => U) {
    return async (...args: T): Promise<U> => {
      shouldLog.value = true;
      currFunc.name = fn.name;
      currFunc.args = args;
      const result = await fn(...args);

      currFunc.name = "";
      currFunc.args = {};
      shouldLog.value = false;
      return result;
    };
  }

  function addLogging<T>(object: T) {
    const result: Record<string, any> = {};
    Object.entries(object).forEach(
      ([key, value]) => (result[key] = logDecorator(value))
    );
    return result as unknown as ReturnType<TMutations>;
  }

  function addActionLogging<T>(object: T) {
    const result: Record<string, any> = {};
    Object.entries(object).forEach(
      ([key, value]) => (result[key] = actionLogDecorator(value))
    );
    return result as unknown as ReturnType<TActions>;
  }

  return {
    name,
    store,
    injectionKey,
  };
};
// eslint-disable-next-line @typescript-eslint/ban-types
const deepCopyObject = (object: Object) => JSON.parse(JSON.stringify(object));
export default useStore;
