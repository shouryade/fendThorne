<template>
  <div
    class="
      bg-lightblue-400
      files-container
      fixed
      right-3
      top-16
      lg:top-4
      overflow-y-auto
    "
  >
    <div id="my-files-container" class="transition-fade">
      <user-profile />
      <files-list :files="files" pageTitle="Bin" />
    </div>
  </div>
</template>

<script>
/* IGNORE THIS COMPONENT. IT IS NOT NEEDED FOR NOW */

import { onMounted, computed } from "@vue/runtime-core";
import UserProfile from "../components/UserProfile.vue";
import FilesList from "../components/FilesList.vue";
import { useStore } from "vuex";

export default {
  name: "TrashBin",
  components: { UserProfile, FilesList },
  setup() {
    const store = useStore();
    let files = computed(() => {
      return store.getters.trash;
    });
    onMounted(() => {
      document.title = "Bin | foreThorne";
    });

    return {
      files,
    };
  },
};
</script>
