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
  //Getters For computed  props
  TGetters extends (s: TState) => ReturnType<TGetters>,
  // Actions that have side effects. Actions can change state. Side effects for example an api call
  TActions extends (
    m: ReturnType<TMutations>,
    s: TState
  ) => ReturnType<TActions>
>(
  name: string,
  state: TState,
  additionalProps: {
    mutations: TMutations;
    getters?: TGetters;
    actions: TActions;
    options?: Options;
  }
) => {
  const redux = reduxHelper(name, state);

  redux.subscribe((s: TState) => {
    console.log("subscrirbe", s);
    Object.assign(state, s);
  });
  const readonlyState = toRefs(readonly(state));

  const wrappedMutations = additionalProps.mutations(state);
  const wrappedActions = additionalProps.actions(
    wrappedMutations,
    state as TState
  );
  const getters = additionalProps.getters(state);
  const store = {
    state: readonlyState,
    mutations: wrappedMutations,
    actions: wrappedActions,
    getters,
  };

  const initMockStore = (a: TActions): typeof store => {
    return {
      ...store,
      actions: a(wrappedMutations, state as TState),
    };
  };

  const injectionKey: InjectionKey<typeof store> = Symbol(name);

  watch(state, (value) => {
    redux.send("changed", value, value);
  });

  return {
    name,
    store,
    injectionKey,
  };
};
// eslint-disable-next-line @typescript-eslint/ban-types
export default useStore;
