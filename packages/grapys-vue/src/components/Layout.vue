<template>
  <div class="layout">
    <div class="bg-warmgray-400 bg-opacity-20 flex min-h-screen flex-col">
      <div class="w-full flex-1">
        <div class="bg-blue-300">
          <div class="relative flex items-center text-center text-2xl">
            <div class="w-full items-center">{{ siteName }}</div>
          </div>
        </div>
        <div class="top-0 w-full sm:relative">
          <div v-if="requireLogin">
            <div v-if="firebaseStore.isSignedIn === null">loading...</div>
            <div v-if="firebaseStore.isSignedIn === true">
              <router-view />
            </div>
            <div v-if="firebaseStore.isSignedIn === false">
              <Signin />
            </div>
          </div>
          <div v-else>
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Signin from "./Signin.vue";
import { auth } from "../utils/firebase/firebase";
import { requireLogin, enableFirebase, siteName } from "../config/project";

import { useFirebaseStore } from "../store/firebase";

export default defineComponent({
  name: "AppLayout",
  components: {
    Signin,
  },
  setup() {
    const menu = ref(false);
    const firebaseStore = useFirebaseStore();

    onMounted(() => {
      auth.onAuthStateChanged((fbuser) => {
        if (fbuser) {
          console.log("authStateChanged:");
          firebaseStore.setFirebaseUser(fbuser);
        } else {
          firebaseStore.setFirebaseUser(undefined);
        }
      });
    });

    const toggleMenu = () => {
      menu.value = !menu.value;
    };

    return {
      menu,
      toggleMenu,
      enableFirebase,
      requireLogin,
      siteName,
      firebaseStore,
    };
  },
});
</script>
