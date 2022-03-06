<template>
  <div class="text-black mt-6 ml-6 lg:ml-16">
    <div
      class="inline-block px-6 py-1 font-bold"
      style="
        background: #eef1f6;
        font-size: 0.9rem;
        border-radius: 20px;
        color: #4b4b4b;
      "
    >
      {{ pageTitle }}
    </div>
    <div v-if="!files.length">
      <div
        class="absolute inline-block top-1/2 left-1/2 font-bold text-center"
        style="
          transform: translate(-50%, -50%);
          color: #bcb8b8;
          font-size: 1.15rem;
        "
      >
        <img
          class="inline-block mb-2"
          src="@/assets/file_image.png"
          style="
            min-width: 160px;
            max-width: 300px;
            width: 22%;
            filter: invert(5%);
          "
        />
        <br />
        <span class="text-black" v-if="pageTitle === 'My Files'">Upload a file to begin</span>
        <span class="text-black" v-else-if="pageTitle === 'Shared With Me'">
          No files shared with you
        </span>
        <span class="text-black" v-else>No files added to Bin</span>
      </div>
    </div>
    <div v-else class="mt-6 lg:ml-4 mr-6 lg:mr-16">
      <div
        v-if="listType === 'table'"
        class="overflow-x-auto transition-fade lg:mb-20 mb-20"
        style="min-width: 200px"
      >
        <table style="min-width: 100%; width: max-content" class="font-bold">
          <thead style="color: #b9b8b8">
            <tr>
              <th class="text-black uppercase text-left">File ID</th>
              <th class="text-black uppercase" style="width: 140px">Last Modified</th>
              <th class="text-black uppercase mb-6 text-left" style="width: 80px">Size</th>
              <th class="text-black uppercase mb-6" style="width: 240px">Actions</th>
            </tr>
          </thead>
          <tbody style="color: #707070">
            <tr
              v-for="file in files"
              :key="file.fileId"
              style="border-bottom: 2px solid #a1cdf8"
            >
              <td class="text-black pt-6 pb-3" style="width: calc(30vw + 3em)">
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <span
                      class="
                        text-black
                        inline-block
                        overflow-ellipsis overflow-hidden
                        whitespace-nowrap
                        pr-3
                        align-middle
                      "
                      style="width: 30vw; max-width: max-content"
                    >
                      {{ file.fileId }}
                    </span>
                  </template>
                  {{ file.fileId }}
                </n-tooltip>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <InformationCircleIcon
                      class="h-5 w-5 inline-block cursor-pointer outline-none"
                    />
                  </template>
                  Pseudonymous File ID
                </n-tooltip>
              </td>
              <td class="text-black pt-6 pb-3 align-middle text-center">
                {{ getReadableDate(file.uploaded_on) }}
              </td>
              <td class="text-black pt-6 pb-3 align-middle">
                {{ getReadableSize(file.size) }}
              </td>
              <td>
                <div class="text-black mt-2 py-2 text-center">
                  <n-tooltip
                    trigger="hover"
                    v-for="item in menuItems"
                    :key="item.label + '-action'"
                  >
                    <template #trigger>
                      <span
                        class="file-menu inline-block"
                        @click.stop="item.command(file)"
                      >
                        <component
                          :is="item.icon"
                          class="w-5 inline-block m-2"
                        />
                      </span>
                    </template>
                    {{ item.label }}
                  </n-tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <dialog-box v-if="shareDialog" @close="closeDialog">
    <h3 class="font-ubuntu font-bold" style="color: #253d52; font-size: 1.5em">
      Share file
    </h3>
    <label
      class="block mt-4 mb-2 font-semibold"
      for="recipient-email"
      style="color: #707070; font-size: 1.2em"
    >
      Recipient Email
    </label>
    <input
      type="email"
      id="recipient-email"
      v-model="shareEmail"
      class="focus:outline-none rounded-full px-4 py-2 w-full"
    />
    <div class="text-center mt-5 mb-3">
      <button
        class="focus:outline-none py-2 px-5 rounded-full font-bold shadow-2xl"
        :class="!isShareEmailInvalid ? 'cursor-pointer' : 'cursor-not-allowed'"
        :style="{
          background: !isShareEmailInvalid ? '#058aff' : '#a1cdf8',
          color: 'white',
        }"
        :disabled="isShareEmailInvalid"
        @click.stop="shareFile"
      >
        Share
      </button>
    </div>
  </dialog-box>

  <dialog-box v-if="revokeDialog" @close="closeDialog">
    <h3 class="font-ubuntu font-bold" style="color: #253d52; font-size: 1.5em">
      List of user addresses
    </h3>
    <ul
      v-if="sharedUsers.users?.length"
      class="my-3 overflow-y-auto overflow-hidden"
      style="max-height: 60vh"
    >
      <li
        v-for="user in sharedUsers.users"
        :key="user"
        class="py-3"
        style="border-bottom: 2px solid #a1cdf8"
      >
        <n-tooltip trigger="hover">
          <template #trigger>
            <span
              class="
                inline-block
                overflow-hidden overflow-ellipsis
                align-middle
                font-black
                text-base
              "
              style="width: calc(100% - 2em); color: #707070"
            >
              {{ user }}
            </span>
          </template>
          {{ user }}
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <BackspaceIcon
              class="inline-block h-6 w-6 cursor-pointer ml-1 outline-none"
              @click.stop="revokeAccess(sharedUsers.file, user)"
            />
          </template>
          Revoke Access
        </n-tooltip>
      </li>
    </ul>
    <div v-else class="my-3">
      <span class="font-black text-xl" style="color: #707070">
        Not shared with anyone
      </span>
    </div>
  </dialog-box>
</template>

<style scoped>
.list-type {
  color: #c6c9c9;
  border: 2px solid #c6c9c9;
}

.list-type:hover {
  background-color: #c6c9c966;
}

.list-active {
  background-color: #c6c9c9;
  color: white;
}

.list-active:hover {
  background-color: #c6c9c9;
}

.file-menu {
  color: #4b4b4b;
  cursor: pointer;
  border-radius: 20px;
}

#recipient-email {
  border: 2px solid #a1cdf8;
}

#recipient-email:focus {
  border: 2px solid #058aff;
}

.file-menu:hover {
  background-color: #4b4b4b;
  color: white;
}
</style>

<script>
import bytes from "bytes";
import isValidEmail from "pragmatic-email-regex";
import moment from "moment";
import { ref } from "@vue/reactivity";
import { inject, onMounted, watch } from "@vue/runtime-core";
import { NTooltip } from "naive-ui";
import {
  ViewGridIcon,
  ViewListIcon,
  DotsVerticalIcon,
  PencilAltIcon,
  ShareIcon,
  DownloadIcon,
  TrashIcon,
  XCircleIcon,
  RefreshIcon,
  SearchIcon,
  BackspaceIcon,
  InformationCircleIcon,
} from "@heroicons/vue/outline";

import DialogBox from "./DialogBox.vue";
import useArcanaStorage from "../use/arcanaStorage";

export default {
  name: "FilesList",
  props: ["files", "pageTitle"],
  components: {
    ViewGridIcon,
    ViewListIcon,
    DotsVerticalIcon,
    SearchIcon,
    InformationCircleIcon,
    BackspaceIcon,
    NTooltip,
    DialogBox,
  },
  setup(props) {
    let listType = ref("table");
    let menuPosition = ref({});
    let showMenu = ref(false);
    let shareDialog = ref(false);
    let revokeDialog = ref(false);
    let shareEmail = ref("");
    let sharedUsers = ref({
      file: {},
      users: [],
    });
    let isShareEmailInvalid = ref(true);
    const { download, remove, share, revoke, getSharedUsers } =
      useArcanaStorage();
    const GENESIS_ADDRESS = "0x0000000000000000000000000000000000000000";

    let menuItem = {};
    let fileToShare;
    menuItem.verify = {
      label: "Verify",
      icon: PencilAltIcon,
      command: (selectedFile) => {
        window.open(
          "https://explorer.arcana.network/did/" + selectedFile.did,
          "__blank"
        );
      },
    };

    menuItem.download = {
      label: "Download",
      icon: DownloadIcon,
      command: (selectedFile) => {
        download(selectedFile);
      },
    };

    menuItem.share = {
      label: "Share",
      icon: ShareIcon,
      command: (selectedFile) => {
        fileToShare = selectedFile;
        shareDialog.value = true;
      },
    };

    menuItem.remove = {
      label: "Delete",
      icon: TrashIcon,
      command: (selectedFile) => {
        remove(selectedFile);
      },
    };

    menuItem.revoke = {
      label: "Revoke",
      icon: BackspaceIcon,
      command: (selectedFile) => {
        revokeDialog.value = true;
        fetchSharedUsers(selectedFile);
      },
    };

    menuItem.recover = {
      label: "Recover",
      icon: RefreshIcon,
      command: () => {},
    };

    menuItem.delete = {
      label: "Delete Forever",
      icon: XCircleIcon,
      command: () => {},
    };

    let menuItemsArr = [];
    if (props.pageTitle === "My Files") {
      menuItemsArr = [
        menuItem.download,
        menuItem.share,
        menuItem.revoke,
        menuItem.remove,
      ];
    } else if (props.pageTitle === "Shared With Me") {
      menuItemsArr = [menuItem.download];
    } else {
      menuItemsArr = [menuItem.recover, menuItem.delete];
    }
    let menuItems = ref(menuItemsArr);

    function fileMenu(file, event) {
      selectedFile = file;
      showMenu.value = false;
      setTimeout(() => {
        showMenu.value = true;
        const menuEl = event.path.find(
          (el) =>
            typeof el.className === "string" &&
            el.className.includes("file-menu")
        );
        if (menuEl) {
          const rect = menuEl.getBoundingClientRect();
          menuPosition.value = {
            x: rect.left,
            y: rect.top,
            el: {
              w: rect.width,
              h: rect.height,
            },
          };
        }
      }, 100);
    }

    function hideMenu() {
      showMenu.value = false;
    }

    function closeDropdown() {
      showMenu.value = false;
    }

    function getReadableDate(date) {
      if (date) {
        return moment(date).format("DD-MM-YYYY");
      }
      return moment().format("DD-MM-YYYY");
    }

    function getReadableSize(size) {
      return bytes(size);
    }

    function closeDialog() {
      shareEmail.value = "";
      isShareEmailInvalid.value = false;
      shareDialog.value = false;
      revokeDialog.value = false;
      sharedUsers.value = {
        file: {},
        users: [],
      };
    }

    async function shareFile() {
      const emails = shareEmail.value.split(",").map((email) => email.trim());
      for (let email of emails) {
        await share(fileToShare, email);
      }
      closeDialog();
    }

    async function revokeAccess(fileToRevoke, address) {
      await revoke(fileToRevoke, address);
      fetchSharedUsers(fileToRevoke);
    }

    function fetchSharedUsers(file) {
      getSharedUsers(file.fileId).then((res) => {
        const users = res?.filter((user) => user !== GENESIS_ADDRESS);
        sharedUsers.value = {
          file,
          users: users || [],
        };
      });
    }

    onMounted(() => {
      document.querySelector(".files-container").onscroll = hideMenu;
    });

    watch(
      () => shareEmail.value,
      () => {
        const emails = shareEmail.value.split(",").map((email) => email.trim());
        isShareEmailInvalid.value = emails.some(
          (email) => !isValidEmail(email)
        );
      }
    );

    return {
      listType,
      bytes,
      menuPosition,
      showMenu,
      menuItems,
      shareDialog,
      revokeDialog,
      sharedUsers,
      shareEmail,
      isShareEmailInvalid,
      revokeAccess,
      fileMenu,
      closeDropdown,
      getReadableDate,
      getReadableSize,
      shareFile,
      closeDialog,
    };
  },
};
</script>
