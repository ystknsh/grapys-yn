<template>
  <AddNode />

  <hr />
  <h2 class="text-lg font-bold">History</h2>

  <div class="mb-1 inline-flex items-center">
    <button
      @click="store.undo"
      :disabled="!store.undoable"
      class="rounded-l-full px-2.5 py-2 font-bold text-white transition-colors duration-200"
      :class="store.undoable ? 'bg-sky-500 hover:bg-sky-700' : 'cursor-not-allowed bg-sky-200'"
    >
      Undo
    </button>
    <div class="mx-0.5"></div>
    <button
      @click="store.redo"
      :disabled="!store.redoable"
      class="rounded-r-full px-2.5 py-2 font-bold text-white transition-colors duration-200"
      :class="store.redoable ? 'bg-sky-500 hover:bg-sky-700' : 'cursor-not-allowed bg-sky-200'"
    >
      Redo
    </button>
  </div>
  <hr />

  <SideMenuSaveFirebase v-if="enableFirebase && firebaseStore.isSignedIn" />
  <SideMenuSaveBrowser v-else />

  <h2 class="text-lg font-bold">Download</h2>
  <div>
    <button @click="() => handleDownload(store.graphData)" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">
      GraphData
    </button>
  </div>
  <hr />
  <hr />

  <TemplateGraph @set-graph="setGraph" />
  <hr />

  <div>
    <button @click="store.reset()" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Clear Graph</button>
  </div>
  <div>
    <div v-if="firebaseStore.isSignedIn">
      <button @click="logout" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Logout</button>
    </div>
    <div v-if="firebaseStore.isSignedIn === false">
      <GoogleSignin />
    </div>
  </div>
  <hr />

  <h2 class="text-lg font-bold">Key</h2>
  openai
  <ApiKey keyName="OpenAI" storageKey="GRAPYS_OPENAI_KEY" />
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
import ApiKey from "./ApiKey.vue";

import GoogleSignin from "../components/SigninButton.vue";
import { handleDownload } from "../utils/gui/utils";
import { auth } from "../utils/firebase/firebase";

import { enableFirebase } from "../config/project";

export default defineComponent({
  components: {
    AddNode,
    ApiKey,
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
