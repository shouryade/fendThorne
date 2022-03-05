<template>
  <div
    class="
      bg-white
      files-container
      fixed
      right-3
      top-20
      lg:top-4
      overflow-y-auto
    "
  >
    <div id="my-files-container" class="transition-fade">
      <user-profile />
      <files-list :files="files" pageTitle="Shared With Me" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import FilesList from "../components/FilesList.vue";
import useArcanaStorage from "../use/arcanaStorage";
import UserProfile from "../components/UserProfile.vue";

export default {
  name: "SharedWithMe",
  setup() {
    const store = useStore();
    const { fetchStorageLimits, fetchSharedFiles } = useArcanaStorage();

    const files = computed(() => store.getters.sharedWithMe);

    onMounted(async () => {
      document.title = "Shared With Me | fendThorne";
      await fetchStorageLimits();
      await fetchSharedFiles();
    });

    return {
      files,
    };
  },
  components: { UserProfile, FilesList },
};
</script>
