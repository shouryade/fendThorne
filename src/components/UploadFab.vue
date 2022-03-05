<template>
  <button
    class="
      fixed
      rounded-3xl
      right-8
      lg:right-14 lg:bottom-12
      bottom-8
      px-6
      py-2
      cursor-pointer
      upload-fab
      focus:outline-none
      ripple
      font-ubuntu
    "
    @click.stop="openFileUploadView"
  >
    Upload File
  </button>
</template>

<style scoped>
.upload-fab {
  background-color: #058aff;
  color: white;
  font-weight: 500;
  box-shadow: 0px 3px 20px #058aff66;
  z-index: 3000;
}
</style>

<script>
import { onBeforeUnmount, onMounted } from "@vue/runtime-core";

import useArcanaStorage from "../use/arcanaStorage";

export default {
  setup() {
    const { upload } = useArcanaStorage();

    let file;

    onMounted(() => {
      file = document.createElement("input");
      file.type = "file";
      file.hidden = true;
      file.multiple = false;
      file.onchange = fileChangeHandler;
    });

    onBeforeUnmount(() => {
      file.remove();
    });

    function openFileUploadView() {
      file.click();
    }

    function fileChangeHandler() {
      if (this.files[0]) {
        upload(this.files[0]);
        file.value = "";
      }
    }
    return {
      openFileUploadView,
    };
  },
};
</script>
