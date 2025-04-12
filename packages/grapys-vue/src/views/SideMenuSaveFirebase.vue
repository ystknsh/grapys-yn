<template>
  Save to Firebase
  <div>
    <button @click="save" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Save as New</button>
  </div>
  <hr />
  <div v-if="graphDataSet.length > 0">
    <select class="mt-2 w-full resize-none rounded-md border-2 border-gray-300 p-1 text-black" v-model="selectedGraph">
      <option v-for="(graph, key) in graphDataSet" :key="key" :value="key">
        {{ graph.name }}
      </option>
    </select>

    <div>
      <button @click="loadData" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Load Graph</button>
    </div>

    <div>
      <button @click="updateData" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Overwrite save</button>
    </div>

    <div>
      <button @click="deleteData" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Delete data</button>
    </div>
  </div>
  <hr />
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from "vue";
import { useStore } from "../store";
import { useFirebaseStore } from "../store/firebase";
import { serverTimestamp, doc, collection, setDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase/firebase";

type FirebaseGraphData = {
  name: string;
  jsonString: string;
  uid: string;
  graphId: string;
};

export default defineComponent({
  components: {},
  setup() {
    const store = useStore();
    const firebaseStore = useFirebaseStore();

    const uid = firebaseStore?.firebaseUser?.uid;
    const path = `/users/${uid}/graphData`;

    const save = async () => {
      const name = window.prompt("Input data name");
      if (name) {
        const dataStr = JSON.stringify(store.graphData);
        const graphDoc = doc(collection(db, path));
        // console.log(graphId);
        const saveData = {
          name,
          jsonString: dataStr,
          uid,
          graphId: graphDoc.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        console.log(saveData, graphDoc.path);
        await setDoc(graphDoc, saveData);
      }
      // window.localStorage.setItem("GRAPHAIGUI", dataStr);
    };

    const selectedGraph = ref(0);
    const graphDataSet = ref<FirebaseGraphData[]>([]);
    const graphDataDetacher = onSnapshot(collection(db, path), (dataSet) => {
      if (dataSet.empty) {
        graphDataSet.value = [];
      } else {
        graphDataSet.value = dataSet.docs.map((data) => {
          return data.data() as FirebaseGraphData;
        });
        //
        if (graphDataSet.value.length >= selectedGraph.value) {
          selectedGraph.value = graphDataSet.value.length - 1;
        }
      }
    });

    const loadData = () => {
      const data = graphDataSet.value[selectedGraph.value];
      try {
        if (data) {
          const graphData = JSON.parse(data.jsonString);
          store.loadData(graphData.metadata.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const updateData = async () => {
      const data = graphDataSet.value[selectedGraph.value];
      if (window.confirm(`Realy update data to ${data.name} ??`)) {
        const dataPath = `${path}/${data?.graphId}`;
        const dataStr = JSON.stringify(store.graphData);

        await updateDoc(doc(db, dataPath), {
          jsonString: dataStr,
          updatedAt: serverTimestamp(),
        });
      }
    };
    const deleteData = async () => {
      const data = graphDataSet.value[selectedGraph.value];
      if (window.confirm(`Realy delete ${data.name} ??`)) {
        const dataPath = `${path}/${data?.graphId}`;
        await deleteDoc(doc(db, dataPath));
      }
    };

    onUnmounted(() => {
      if (graphDataDetacher) {
        graphDataDetacher();
      }
    });

    return {
      save,
      updateData,
      loadData,
      deleteData,

      graphDataSet,
      selectedGraph,
    };
  },
});
</script>
