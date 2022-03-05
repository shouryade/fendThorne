import { useStore } from "vuex";
import { Wallet } from "ethers";

import padPublicKey from "../utils/padPublicKey";

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

import { AuthProvider } from "@arcana/auth";

// AUTH-1: Create an instance of Arcana AuthProvider.
const authInstance = new AuthProvider({
  appID: ARCANA_APP_ID,
  network: "testnet",
  oauthCreds: [
    {
      type: "google",
      clientId: GOOGLE_CLIENT_ID,
    },
  ],
  redirectUri: `${window.location.origin}/auth/redirect`,
});

function useArcanaAuth() {
  const store = useStore();

  function isLoggedIn() {
    // AUTH-2: Check if the user is already logged in.
    return authInstance.isLoggedIn();
  }

  async function login() {
    if (!isLoggedIn()) {
      store.dispatch("showLoader", "Logging in...");
      // AUTH-3a: If user does not have an active session,
      // trigger the Google authentication process.
      await authInstance.loginWithSocial("google");
    }

    store.dispatch(
      "showLoader",
      "Fetching keys and generating wallet address..."
    );

    const { userInfo, privateKey } = await authInstance.getUserInfo();
    store.dispatch("addBasicDetails", {
      email: userInfo.id,
      profileImage: userInfo.picture,
      givenName: userInfo.name,
    });

    const publicKey = await authInstance.getPublicKey({
      verifier: "google",
      id: userInfo.id,
    });
    const actualPublicKey = padPublicKey(publicKey);
    const wallet = new Wallet(privateKey);
    store.dispatch("addCryptoDetails", {
      walletAddress: wallet.address,
      privateKey: privateKey,
      publicKey: actualPublicKey,
    });

    store.dispatch("hideLoader");
  }

  function handleRedirect() {
    AuthProvider.handleRedirectPage(window.location);
  }

  async function logout() {
    // AUTH-5: Log a user out.
    await authInstance.logout();
    store.dispatch("clearStore");
  }

  return {
    handleRedirect,
    isLoggedIn,
    login,
    logout,
  };
}

export { authInstance };

export default useArcanaAuth;
