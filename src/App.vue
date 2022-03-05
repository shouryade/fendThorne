<template>
  <fullsize-background>
    <full-screen-loader
      v-if="loader"
      :key="'arcana-demo-app-loader'"
      :message="loadingMessage"
    />
    <app-sidebar v-if="privateKey && $route.name !== 'Login'" />
    <router-view></router-view>
  </fullsize-background>
</template>

<script>
import FullsizeBackground from "./components/FullsizeBackground.vue";
import AppSidebar from "./components/AppSidebar.vue";
import FullScreenLoader from "./components/FullScreenLoader.vue";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
export default {
  setup() {
    const store = useStore();

    let loader = computed(() => {
      return store.getters.loader;
    });
    let loadingMessage = computed(() => {
      return store.getters.loadingMessage;
    });
    let privateKey = computed(() => {
      return store.getters.privateKey;
    });

    return {
      loader,
      loadingMessage,
      privateKey,
    };
  },
  components: { FullsizeBackground, AppSidebar, FullScreenLoader },
};
</script>

<style>
</style>
