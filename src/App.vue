<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  Book:
  {{ state.bookname }} {{ state.counter }}
  <button v-on:click="mutations.setBookname('Lord of the rings')">
    klik maar
  </button>
  <br />
  fruit: {{ fruitState.fruit }} {{ fruitState.counter }}
  <button v-on:click="fruitM.setFruit('Peach')">klik maar fruit</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import bookStore from "@/bookStore";
import fruitStore from "@/superMarketStore";

export default defineComponent({
  name: "App",
  setup() {
    const { state, mutations } = bookStore.store;
    const { state: fruitState, mutations: fruitM } = fruitStore.store;
    mutations.setLoading(true);
    return { state, mutations, fruitState, fruitM };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
