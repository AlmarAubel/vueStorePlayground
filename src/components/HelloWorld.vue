<template>
  <div class="hello">
    Book:
    {{ state.bookname }} {{ state.counter }} <br />Getter:{{ x }}
    <br />
    {{ fruitState.counter }}
    Getter2 {{ getters.filtered(9999) }}
    <button v-on:click="actions.setBooknameAsync('Lord of the rings')">
      klik maar 2x
    </button>
    <br />
    fruit: {{ fruitState.fruit }} {{ fruitState.counter }}
    <button v-on:click="fruitM.setFruit('Peach')">klik maar fruit</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import bookStore from "/@/bookStore";
import fruitStore from "/@/superMarketStore";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const { state, mutations, actions, getters } = bookStore.store;
    const {
      state: fruitState,
      mutations: fruitM,
      getters: fruitG,
    } = fruitStore.store;

    return {
      state,
      mutations,
      getters,
      x: getters.combined,
      actions,
      fruitState,
      fruitM,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
