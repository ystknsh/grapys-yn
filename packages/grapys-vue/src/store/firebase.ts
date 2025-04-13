import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "firebase/auth";

export const useFirebaseStore = defineStore("firebase", () => {
  const firebaseUser = ref<User | null>(null);
  const setFirebaseUser = (user: User) => {
    firebaseUser.value = user;
  };
  return {
    setFirebaseUser,
    firebaseUser,
  };
});
