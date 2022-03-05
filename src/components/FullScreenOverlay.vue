<template>
  <div class="fixed top-0 left-0 h-screen w-full overlay"></div>
</template>

<style scoped>
.overlay {
  background-color: black;
  opacity: 0.7;
  z-index: 10000;
  filter: blur(4px);
}
</style>

<script>
export default {
  name: "FullScreenOverlay",
};
</script>
