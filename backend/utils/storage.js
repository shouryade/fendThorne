import bytes from "bytes";
import { ref, onBeforeMount, inject } from "vue";
import { useStore } from "redux";

import padPublicKey from "../utils/padPublicKey";
import { authInstance } from "./arcanaAuth";

const ARCANA_APP_ID = process.env.ARCANA_APP_ID;

const NO_SPACE = "No space left for user";
const UNAUTHORIZED = "UNAUTHORIZED";

const successToast = {
  styles: {
    backgroundColor: "green",
  },
  type: "success",
};
const errorToast = {
  styles: {
    backgroundColor: "red",
  },
  type: "error",
};

function useArcanaStorage() {
  const store = useStore();
  // const toast = inject("$toast");
  const storageInstanceRef = ref(null);

  let storageInstance;

  onBeforeMount(() => {
    if (!storageInstanceRef.value) {
      // STORAGE-1: Create an instance of Arcana StorageProvider.
      // storageInstanceRef.value = ...
    }
    storageInstance = storageInstanceRef.value;
  });

  async function fetchStorageLimits() {
    // STORAGE-2: Fetch the user's upload and download limits.
    // store.dispatch("updateStorage", {
    //   totalStorage,
    //   storageUsed,
    // });
    // store.dispatch("updateBandwidth", {
    //   totalBandwidth,
    //   bandwidthUsed,
    // });
  }

  async function fetchMyFiles() {
    store.dispatch("showLoader", "Fetching uploaded files...");
    // STORAGE-3: Fetch the user's uploaded files.
    // const myFiles = ...
    // storage.dispatch("updateMyFiles", myFiles);
    store.dispatch("hideLoader");
  }

  async function fetchSharedFiles() {
    store.dispatch("showLoader", "Fetching shared files...");
    // STORAGE-4: Fetch the user's uploaded files.
    // const sharedFiles = ...
    // storage.dispatch("updateMyFiles", sharedFiles);
    store.dispatch("hideLoader");
  }

  async function upload(fileToUpload) {
    store.dispatch("showLoader", "Encrypting file...");
    let uploadStart = Date.now(),
      uploadDate = new Date(),
      totalSize,
      did;

    // STORAGE-5: Upload a file.
    store.dispatch("showLoader", "Uploading file to distributed storage...");
  }

  async function download(file) {
    store.dispatch(
      "showLoader",
      "Downloading chunks from distributed storage..."
    );

    let did = file.fileId;
    did = did.substring(0, 2) !== "0x" ? "0x" + did : did;

    // STORAGE-6: Download a file.
  }

  async function share(fileToShare, email) {
    store.dispatch("showLoader", "Sharing file...");

    let did = fileToShare.fileId;
    did = did.substring(0, 2) != "0x" ? "0x" + did : did;

    const publicKey = await authInstance.getPublicKey({
      verifier: "google",
      id: email,
    });
    const actualPublicKey = padPublicKey(publicKey);

    const validity = 1000000;

    try {
      // STORAGE-7: Share a file.

      toast(`Shared file successfully with ${email}`, successToast);
    } catch (error) {
      toast("Something went wrong. Try again", errorToast);
    }

    store.dispatch("hideLoader");
  }

  async function getSharedUsers(did) {
    try {
      // STORAGE-8: Get a list of shared users.
    } catch (error) {
      toast(
        "Something went wrong while fetching shared users list",
        errorToast
      );
    }
  }

  async function revoke(fileToRevoke, address) {
    store.dispatch("showLoader", "Revoking file access...");

    const did = fileToRevoke.fileId;
    const fileId = did.substring(0, 2) !== "0x" ? "0x" + did : did;

    try {
      // STORAGE-9: Revoke access to a shared file.

      toast(`File Access Revoked`, successToast);
    } catch (error) {
      toast("Something went wrong. Try again", errorToast);
    }

    store.dispatch("hideLoader");
  }

  async function remove(fileToDelete) {
    store.dispatch("showLoader", "Deleting file...");

    let did = fileToDelete.fileId;
    did = did.substring(0, 2) != "0x" ? "0x" + did : did;

    try {
      // STORAGE-10: Delete a file.

      toast(`File Deleted`, successToast);
    } catch (error) {
      toast("Something went wrong. Try again", errorToast);
    }
    store.dispatch("hideLoader");
  }

  return {
    download,
    fetchMyFiles,
    fetchSharedFiles,
    fetchStorageLimits,
    getSharedUsers,
    remove,
    revoke,
    share,
    upload,
  };
}

export default useArcanaStorage;
