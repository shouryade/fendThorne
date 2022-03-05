<template>
  <full-screen-overlay @click.stop="closeDialog" />
  <div
    class="fixed top-1/2 left-1/2 h-auto p-8 pb-4 bg-white"
    style="
      min-width: 210px;
      max-width: 420px;
      width: 50%;
      min-height: 20px;
      z-index: 10001;
      transform: translate(-50%, -50%);
      border: 7px solid #2c2525;
      border-radius: 3.6em;
    "
  >
    <XIcon
      class="absolute h-6 w-6 right-7 top-7 cursor-pointer"
      style="color: #058aff"
      @click.stop="closeDialog"
    />
    <slot></slot>
  </div>
</template>

<script>
import FullScreenOverlay from "./FullScreenOverlay.vue";
import { XIcon } from "@heroicons/vue/outline";

export default {
  name: "DialogBox",
  components: { FullScreenOverlay, XIcon },
  emits: ["close"],
  setup(props, { emit }) {
    function closeDialog() {
      emit("close");
    }

    return {
      closeDialog,
    };
  },
};
</script>
