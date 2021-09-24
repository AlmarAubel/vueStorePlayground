import { InjectionKey, readonly, toRefs, watch } from "vue";

import reduxHelper from "./reduxDevHelper";

import { Getters, Actions, Mutations } from "/@/types";
type Options = {
  logging: boolean;
};

const useStore = <
  // The state
  // eslint-disable-next-line @typescript-eslint/ban-types
  TState extends object,
  // Mutations that have no side effects beside changing the state
  TMutations extends (s: TState) => Mutations<ReturnType<TMutations>>,
  //Getters For computed  props
  TGetters extends (s: TState) => Getters<ReturnType<TGetters>>,
  // Actions that have side effects. Actions can change state. Side effects for example an api call
  TActions extends (
    m: Mutations<ReturnType<TMutations>>,
    s: TState
  ) => Actions<ReturnType<TActions>>
>(
  name: string,
  state: TState,
  mutations: TMutations,
  additionalProps: {
    getters: TGetters;
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

  const _mutations = mutations(state);
  const actions = additionalProps.actions(_mutations, state as TState);
  const getters = additionalProps.getters(state);
  const store = {
    state: readonlyState,
    mutations: _mutations,
    actions,
    getters,
  };

  const initMockStore = (a: TActions): typeof store => {
    return {
      ...store,
      actions: a(_mutations, state as TState),
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
