<template>
  <div class="absolute login-container p-10 text-center">
    <img
      src="@/assets/cloudStorage.png"
      style="height: 200px; display: inline"
    />
    <h1 class="font-medium leading-tight text-5xl mt-4 mb-2 "> fendThorne </h1>
    <div class="inline-block mt-8">
      By clicking on Sign In with Google, you agree to share your email with fendThorne.
      <!-- <a href="/" style="color: #058aff; text-decoration: none"> Privacy </a>
      &
      <a href="/" style="color: #058aff; text-decoration: none"> Terms </a> -->
    </div>
    <div
      id="google-signin-button"
      @click.stop="overrideClick"
      class="font-ubuntu"
    ></div>
    <a class="google-button" @click.stop="signIn">Sign In with Google</a>
  </div>
</template>

<style scoped>
#google-signin-button {
  position: relative;
  margin: 0 auto;
  margin-top: 2rem;
  width: 240px;
}
.login-container {
  min-width: 480px;
  max-width: 640px;
  width: 50%;
  color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background: #1B163A;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.upload-fab {
  background-color: #058aff;
  color: white;
  font-weight: 500;
  box-shadow: 0px 3px 20px #058aff66;
}

.ripple {
  background-position: center;
  transition: background 0.8s;
}
.ripple:hover {
  background: #47a7f5 radial-gradient(circle, transparent 1%, #47a7f5 1%)
    center/15000%;
}
.ripple:active {
  background-color: #6eb9f7;
  background-size: 100%;
  transition: background 0s;
}

@media screen and (max-width: 1024px) {
  .files-container {
    width: calc(100% - 1.5rem);
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
}

.google-button {
  padding: 0.8em 1.2em;
  border: 1px solid rgb(5, 138, 255);
  background-color: rgb(5, 138, 255);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  margin: 1em 0;
  white-space: nowrap;
  font-weight: 800;
  font-size: 1.2em;
}
</style>

<script>
import { onBeforeMount, inject } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import useArcanaAuth from "../use/arcanaAuth";

export default {
  name: "AppLogin",
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = inject("$toast");

    const { isLoggedIn, login } = useArcanaAuth();

    onBeforeMount(() => {
      document.title = "Login | fendThorne";
      if (isLoggedIn()) {
        signIn();
      }
    });

    async function signIn() {
      try {
        await login();

        store.dispatch("showLoader");
        await router.push({ name: "My Files" });
        store.dispatch("hideLoader");
        toast("Login Success", {
          styles: {
            backgroundColor: "green",
          },
          type: "success",
        });
      } catch (e) {
        toast("Something went wrong", {
          styles: {
            backgroundColor: "blue",
          },
          type: "error",
        });
        console.error("error", e);
      }
    }

    return {
      signIn,
    };
  },
};
</script>
