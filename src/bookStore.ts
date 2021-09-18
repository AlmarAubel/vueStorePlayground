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
      s.bookname = name + Date.now();
      setTimeout(() => (s.loading = false), 500);
    };
    return { setBooknameAsync };
  },
  getters: (s) => {
    const combined = computed(() => s.bookname + "-" + s.counter);
    return { combined };
  },

  options: { logging: true },
});

export default bookStore;
