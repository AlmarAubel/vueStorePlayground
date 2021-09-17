import useStore from "@/useStore";
import { reactive } from "vue";

const initialState = reactive({
  bookname: "harry snotter" as string,
  loading: false,
  counter: 1,
});

const bookStore = useStore(
  "book",
  initialState,
  (s) => ({
    setBookname(name: string) {
      s.bookname = name;
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

export default bookStore;
