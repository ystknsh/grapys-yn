<template>
  <h2 class="text-lg font-bold">Menu</h2>

  <AddNode />

  <hr />
  <button
    @click="store.undo"
    class="m-1 cursor-pointer items-center rounded-full px-4 py-2 font-bold text-white"
    :class="store.undoable ? 'bg-sky-500 hover:bg-sky-700' : 'bg-sky-200'"
  >
    Undo
  </button>
  <button
    @click="store.redo"
    class="m-1 cursor-pointer items-center rounded-full px-4 py-2 font-bold text-white"
    :class="store.redoable ? 'bg-sky-500 hover:bg-sky-700' : 'bg-sky-200'"
  >
    Redo
  </button>
  <hr />

  <div>
    <button @click="store.reset()" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Clear Graph</button>
  </div>
  <hr />

  <SideMenuSaveFirebase v-if="enableFirebase && firebaseStore.isSignedIn" />
  <SideMenuSaveBrowser v-else />

  <div>
    <button @click="() => handleDownload(store.graphData)" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">
      Download
    </button>
  </div>
  <hr />

  <TemplateGraph @set-graph="setGraph" />
  <hr />

  <div>
    <div v-if="firebaseStore.isSignedIn">
      <button @click="logout" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Logout</button>
    </div>
    <div v-if="firebaseStore.isSignedIn === false">
      <GoogleSignin />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import type { GraphData } from "graphai";
import { signOut } from "firebase/auth";

import { useStore } from "../store";
import { useFirebaseStore } from "../store/firebase";

import AddNode from "./AddNode.vue";
import SideMenuSaveBrowser from "./SideMenuSaveBrowser.vue";
import SideMenuSaveFirebase from "./SideMenuSaveFirebase.vue";
import TemplateGraph from "./TemplateGraph.vue";

import GoogleSignin from "../components/SigninButton.vue";

import { handleDownload } from "../utils/gui/utils";
import { auth } from "../utils/firebase/firebase";

import { enableFirebase } from "../config/project";

export default defineComponent({
  components: {
    AddNode,
    SideMenuSaveBrowser,
    SideMenuSaveFirebase,
    TemplateGraph,
    GoogleSignin,
  },
  setup() {
    const store = useStore();
    const firebaseStore = useFirebaseStore();

    const setGraph = async (graph: GraphData) => {
      store.reset();
      await nextTick(); // to reset edge position. Due to duplicate edge keys, the position will be incorrect.
      store.initFromGraphData(graph);
    };

    const logout = () => {
      signOut(auth);
    };

    return {
      store,
      firebaseStore,
      handleDownload,
      setGraph,
      enableFirebase,
      logout,
    };
  },
});
</script>
