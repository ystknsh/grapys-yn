<template>
  <div
    @dragover.prevent
    @drop.prevent="handleDrop"
    style="border: 2px dashed #aaa; padding: 20px; text-align: center; max-width: 500px; margin: 40px auto;"
  >
    <p>Drop json file here.</p>

    <div v-if="fileName" style="margin-top: 20px;">
      <p>File: {{ fileName }}</p>
      <button
        @click="loadFile"
        style="padding: 8px 16px; border: 1px solid #333; background-color: #f0f0f0; cursor: pointer;"
      >
        Load
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from "../store";

export default defineComponent({
  name: 'JsonDropLoader',
  setup() {
    const store = useStore();

    let file: null | File = null;
    const fileName = ref<string | null>('')

    const handleDrop = (event: DragEvent) => {
      
      file = event?.dataTransfer?.files[0] as File | null
      if (!file || file.type !== 'application/json') {
        file = null;
        alert('JSONファイルをドロップしてください')
        return
      }
      fileName.value = file.name
    };

    const loadFile = () => {
      if (!file) {
        return;
      };
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const json = JSON.parse(e?.target?.result as string)
          store.initFromGraphData(json);
          file = null;
          fileName.value = null;
        } catch (err) {
          console.log(err);
          alert('Faild JSON load')
        }
      }
      reader.readAsText(file)
    }

    return {
      fileName,
      handleDrop,
      loadFile,
    }
  },
})
</script>
