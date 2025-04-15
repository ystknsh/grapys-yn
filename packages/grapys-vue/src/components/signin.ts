import { defineComponent } from "vue";
import { googleSignin } from "../utils/firebase/SocialLogin";

export default defineComponent({
  name: "AccountPage",
  setup() {
    return {
      googleSignin: googleSignin(
        () => {
          console.log("success");
        },
        (err) => {
          console.log(err.message);
        },
      ),
    };
  },
});
