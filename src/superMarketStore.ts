import useStore from "@/useStore";
import { reactive } from "vue";

const initialState = reactive({
  fruit: "apple" as string,
  loading: false,
  counter: 1,
});

const fruitStore = useStore(
  "fruitStore",
  initialState,
  (s) => ({
    setFruit(name: string) {
      s.fruit = name;
      s.counter++;
    },
    setLoading(loading: boolean) {
      s.loading = loading;
    },
  }),
  (m, s) => {
    return {};
  },
  { logging: true }
);

export default fruitStore;
