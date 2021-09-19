import { InjectionKey, readonly, toRefs, watch } from "vue";

import reduxHelper from "./reduxDevHelper";

import { Getters, Actions, Mutations } from "@/types";
type Options = {
  logging: boolean;
};

const useStore = <
  // The state
  // eslint-disable-next-line @typescript-eslint/ban-types
  TState extends object,
  // Mutations that have no side effects beside changing the state
  TMutationsReturnType extends Mutations<ReturnType<TMutations>>,
  TMutations extends (s: TState) => TMutationsReturnType,
  //Getters For computed  props
  TGetters extends (s: TState) => Getters<ReturnType<TGetters>>,
  // Actions that have side effects. Actions can change state. Side effects for example an api call
  TActions extends (
    m: TMutationsReturnType,
    s: TState
  ) => Actions<ReturnType<TActions>>
>(
  name: string,
  state: TState,
  additionalProps: {
    mutations: TMutations;
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

  const mutations = additionalProps.mutations(state);
  const actions = additionalProps.actions(mutations, state as TState);
  const getters = additionalProps.getters(state);
  const store = {
    state: readonlyState,
    mutations,
    actions,
    getters,
  };

  const initMockStore = (a: TActions): typeof store => {
    return {
      ...store,
      actions: a(mutations, state as TState),
    };
  };

  const injectionKey: InjectionKey<typeof store> = Symbol(name);

  watch(
    state,
    (value) => {
      redux.send("changed", value, value);
    },
    //Zou mooi zijn als deze call stack kloppend is met de source map....
    { onTrigger: (event) => console.error("aaaaa", event, new Error().stack) }
  );

  return {
    name,
    store,
    injectionKey,
  };
};
// eslint-disable-next-line @typescript-eslint/ban-types
export default useStore;
