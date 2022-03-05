import bytes from "bytes";
import { ref, onBeforeMount, inject } from "vue";
import { useStore } from "vuex";

import padPublicKey from "../utils/padPublicKey";
import { authInstance } from "./arcanaAuth";

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;

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

import { StorageProvider } from "@arcana/storage/dist/standalone/storage.umd.js";

function useArcanaStorage() {
  const store = useStore();
  const toast = inject("$toast");
  const storageInstanceRef = ref(null);

  let storageInstance;

  

  onBeforeMount(() => {
    if (!storageInstanceRef.value) {
      // STORAGE-1: Create an instance of Arcana StorageProvider.
      storageInstanceRef.value = new StorageProvider({
        appId: ARCANA_APP_ID,
        privateKey: store.getters.privateKey,
        email: store.getters.email,
      });
    }
    storageInstance = storageInstanceRef.value;
  });

  async function fetchStorageLimits() {
    // STORAGE-2: Fetch the user's upload and download limits.
    const access = await storageInstance.getAccess();
    const [storageUsed, totalStorage] = await access.getUploadLimit();
    const [bandwidthUsed, totalBandwidth] = await access.getDownloadLimit();

    store.dispatch("updateStorage", {
      totalStorage,
      storageUsed,
    });
    store.dispatch("updateBandwidth", {
      totalBandwidth,
      bandwidthUsed,
    });
  }

  async function fetchMyFiles() {
    store.dispatch("showLoader", "Fetching uploaded files...");
    // STORAGE-3: Fetch the user's uploaded files.
    const myFiles = await storageInstance.myFiles();
    store.dispatch("updateMyFiles", myFiles);
    store.dispatch("hideLoader");
  }

  async function fetchSharedFiles() {
    store.dispatch("showLoader", "Fetching shared files...");
    // STORAGE-4: Fetch the user's uploaded files.
    const sharedFiles = await storageInstance.sharedFiles();
    store.dispatch("updateSharedWithMe", sharedFiles);
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
    const uploader = await storageInstance.getUploader();

    uploader.upload(fileToUpload).then((fileDid) => {
      did = fileDid;
    });
    uploader.onProgress = (uploaded, total) => {
      store.dispatch(
        "showLoader",
        `Uploaded ${bytes(uploaded)} out of ${bytes(total)}`
      );
      totalSize = total;
    };
    uploader.onError = (error) => {
      if (error.message === NO_SPACE) {
        toast(
          "Upload failed. Storage limit exceeded. Upgrade your account to continue",
          errorToast
        );
      } else if (error.code === UNAUTHORIZED) {
        toast("Upload failed. Kindly login and try again", errorToast);
      } else {
        toast("Something went wrong. Try again", errorToast);
      }
      store.dispatch("hideLoader");
    };
    uploader.onSuccess = () => {
      // Re-fetch the user's storage limits.
      fetchStorageLimits();
    
      // Save the uploaded file in the local files list.
      let myFiles = [...store.getters.myFiles];
      myFiles.push({
        did,
        createdAt: uploadDate,
        size: totalSize,
      });
      store.dispatch("updateMyFiles", myFiles);
    
      // Announce the upload success.
      toast("Upload Success", successToast);
      toast(
        "Transaction successfully updated in arcana network's blockchain",
        successToast
      );
    
      store.dispatch("hideLoader");
    };
  }

  async function download(file) {
    store.dispatch(
      "showLoader",
      "Downloading chunks from distributed storage..."
    );
  
    let did = file.fileId;
    did = did.substring(0, 2) !== "0x" ? "0x" + did : did;
  
    // STORAGE-6: Download a file.
    const downloader = await storageInstance.getDownloader();
  
    downloader.download(did);
    downloader.onProgress = (downloaded, total) => {
      store.dispatch(
        "showLoader",
        `Completed ${bytes(downloaded)} out of ${bytes(total)}`
      );
    };
    downloader.onError = (error) => {
      if (error.message === NO_SPACE) {
        toast(
          "Download failed. Bandwidth limit exceeded. Upgrade your account to continue",
          errorToast
        );
      } else if (error.code === UNAUTHORIZED) {
        toast("Seems like you don't have access to download this file", errorToast);
      } else {
        toast("Something went wrong. Try again", errorToast);
      }
      store.dispatch("hideLoader");
    };
    downloader.onSuccess = () => {
      fetchStorageLimits();
    
      toast("All chunks downloaded", successToast);
      toast(
        "Transaction successfully updated in arcana network's blockchain",
        successToast
      );
      store.dispatch("hideLoader");
    };


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
      const access = await storageInstance.getAccess();
      await access.share([did], [actualPublicKey], [validity]);
  
      toast(`Shared file successfully with ${email}`, successToast);
    } catch (error) {
      toast("Something went wrong. Try again", errorToast);
    }
  
    store.dispatch("hideLoader");
  }

  async function getSharedUsers(did) {
    try {
      // STORAGE-8: Get a list of shared users.
      const access = await storageInstance.getAccess();
      const fileId = did.substring(0, 2) !== "0x" ? "0x" + did : did;
      const users = await access.getSharedUsers(fileId);
      return users;
    } catch (error) {
      toast("Something went wrong while fetching shared users list", errorToast);
    }
  }

  async function revoke(fileToRevoke, address) {
    store.dispatch("showLoader", "Revoking file access...");
  
    const did = fileToRevoke.fileId;
    const fileId = did.substring(0, 2) !== "0x" ? "0x" + did : did;
  
    try {
      // STORAGE-9: Revoke access to a shared file.
      const access = await storageInstance.getAccess();
      await access.revoke(fileId, address);
  
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
      const access = await storageInstance.getAccess();
      await access.deleteFile(did);
  
      fetchStorageLimits();
  
      let myFiles = [...store.getters.myFiles];
      myFiles = myFiles.filter((file) => file.fileId !== fileToDelete.fileId);
      store.dispatch("updateMyFiles", myFiles);
  
      toast("File deleted", successToast);
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
