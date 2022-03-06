<template>
  <div class="min-h-screen w-full bg-color padding-20px">
    <slot></slot>
  </div>
</template>

<style scoped>
.bg-color {
  background-color: #D086B6;
  overflow-y: hidden;
}
.padding-20px {
  padding: 20px;
  padding-left: 0;
}

@media screen and (max-width: 1024px) {
  .padding-20px {
    padding-left: 20px;
  }
}
</style>

<script>
export default {
  name: "FullSizeBackground",
};
</script>
