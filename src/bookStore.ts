import useStore from "@/useStore";
import { computed, reactive } from "vue";
import component from "*.vue";

const initialState = reactive({
  bookname: "harry snotter" as string,
  loading: false,
  counter: 1,
});

const bookStore = useStore("bookStore", initialState, {
  mutations: (s) => ({
    setBookname(name: string) {
      s.bookname = name;
      s.counter++;
    },
  }),
  actions: (m, s) => {
    const setBooknameAsync = async (name: string) => {
      s.loading = true;

      setTimeout(() => {
        s.loading = false;
        s.bookname = name + Date.now();
      }, 500);
    };
    return { setBooknameAsync };
  },
  getters: (s) => ({
    combined: computed(() => s.bookname + "-" + s.counter),
    filtered: (filter: number) =>
      computed(() => s.bookname + "-" + s.counter + "-" + filter),
  }),

  options: { logging: true },
});
export default bookStore;
