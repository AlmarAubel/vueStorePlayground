import useStore from "@/useStore";
import { reactive } from "vue";

const initialState = reactive({
  bookname: "harry snotter" as string,
  loading: false,
  counter: 1,
});

const bookStore = useStore(
  "bookStore",
  initialState,
  (s) => ({
    setBookname(name: string) {
      s.bookname = name;
      s.counter++;
    },
  }),
  (m, s) => {
    const setBooknameAsync = async (name: string) => {
      s.bookname = name + Date.now();
    };
    return { setBooknameAsync };
  },
  { logging: true }
);

export default bookStore;
