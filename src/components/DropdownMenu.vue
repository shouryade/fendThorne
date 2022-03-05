<template>
  <div
    class="fixed h-auto bg-white shadow-xl overflow-hidden"
    id="arcana-dropdown-menu"
    :style="{
      top: `${top}px`,
      left: `${left}px`,
      'border-top-left-radius': `${topLeftRadius}px`,
      'border-top-right-radius': `${topRightRadius}px`,
      'border-bottom-left-radius': `${bottomLeftRadius}px`,
      'border-bottom-right-radius': `${bottomRightRadius}px`,
      visibility: show ? 'visible' : 'hidden',
      opacity: show ? 1 : 0,
    }"
    style="
      color: #707070;
      border: 3px solid #e0e0e0;
      z-index: 3001;
      min-width: 12rem;
    "
  >
    <ul v-for="item in items" :key="item">
      <li
        class="py-4 px-6"
        :class="
          item.disabled
            ? 'bg-gray-100 cursor-not-allowed'
            : 'cursor-pointer hover:bg-gray-100'
        "
        @click.stop="executeCommand(item)"
      >
        <component
          v-if="item.icon"
          :is="item.icon"
          class="h-5 w-5 inline-block mr-2 -mt-1"
        ></component>
        <span v-if="item.label" class="font-ubuntu font-bold">{{
          item.label
        }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
#arcana-dropdown-menu {
  transition: opacity 100ms;
}
</style>

<script>
import { onMounted, ref, watch } from "@vue/runtime-core";

export default {
  name: "DropdownMenu",
  props: ["show", "position", "items"],
  setup(props, { emit }) {
    let topLeftRadius = ref(20);
    let topRightRadius = ref(20);
    let bottomLeftRadius = ref(20);
    let bottomRightRadius = ref(20);
    let top = ref("");
    let left = ref("");
    let dropdownMenuContainer;

    onMounted(() => {
      document.addEventListener("click", handleMenuCollapse);
      dropdownMenuContainer = document.querySelector("#arcana-dropdown-menu");
    });

    watch(() => props.position.x, updatePosition);
    watch(() => props.position.y, updatePosition);

    function handleMenuCollapse(event) {
      const dropdownContainer = event.path.find(
        (el) => el.id === "arcana-dropdown-menu"
      );
      if (!dropdownContainer) {
        emit("close");
      }
    }

    function updatePosition() {
      if (
        props.position.y >=
        window.innerHeight -
          dropdownMenuContainer.clientHeight -
          props.position.el.h
      ) {
        top.value = props.position.y - dropdownMenuContainer.clientHeight - 5;
        if (
          props.position.x <=
          dropdownMenuContainer.clientWidth + props.position.el.w
        ) {
          topLeftRadius.value = 20;
          topRightRadius.value = 20;
          bottomLeftRadius.value = 0;
          bottomRightRadius.value = 20;
          left.value = props.position.x + props.position.el.w;
        } else {
          topLeftRadius.value = 20;
          topRightRadius.value = 20;
          bottomLeftRadius.value = 20;
          bottomRightRadius.value = 0;
          left.value = props.position.x - dropdownMenuContainer.clientWidth;
        }
      } else {
        top.value = props.position.y + props.position.el.h;
        if (
          props.position.x <=
          dropdownMenuContainer.clientWidth + props.position.el.w
        ) {
          topLeftRadius.value = 0;
          topRightRadius.value = 20;
          bottomLeftRadius.value = 20;
          bottomRightRadius.value = 20;
          left.value = props.position.x + props.position.el.w;
        } else {
          topLeftRadius.value = 20;
          topRightRadius.value = 0;
          bottomLeftRadius.value = 20;
          bottomRightRadius.value = 20;
          left.value = props.position.x - dropdownMenuContainer.clientWidth;
        }
      }
    }

    function executeCommand(item) {
      if (!item.disabled && item.command) {
        item.command.call();
      }
      emit("close");
    }

    return {
      topRightRadius,
      topLeftRadius,
      bottomRightRadius,
      bottomLeftRadius,
      top,
      left,
      executeCommand,
    };
  },
};
</script>

