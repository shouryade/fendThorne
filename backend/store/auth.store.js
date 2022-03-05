const state = {
  publicKey: "",
  privateKey: "",
  walletAddress: "",
  email: "",
  profileImage: "",
  givenName: "",
};

const getters = {
  basicProfile: (state) => {
    return {
      givenName: state.givenName,
      profileImage: state.profileImage,
      email: state.email,
      walletAddress: state.walletAddress,
    };
  },
  publicKey: (state) => {
    return state.publicKey;
  },
  privateKey: (state) => {
    return state.privateKey;
  },
  cryptoDetails: (state) => {
    return {
      publicKey: state.publicKey,
      privateKey: state.privateKey,
      walletAddress: state.walletAddress,
    };
  },
  email: (state) => {
    return state.email;
  },
  givenName: (state) => {
    return state.givenName;
  },
};

const mutations = {
  addEmail(state, email) {
    state.email = email;
  },
  addProfileImage(state, profileImage) {
    state.profileImage = profileImage;
  },
  addGivenName(state, givenName) {
    state.givenName = givenName;
  },
  addPublicKey(state, publicKey) {
    state.publicKey = publicKey;
  },
  addPrivateKey(state, privateKey) {
    state.privateKey = privateKey;
  },
  addWalletAddress(state, walletAddress) {
    state.walletAddress = walletAddress;
  },
};

const actions = {
  addBasicDetails({ commit }, { email, profileImage, givenName }) {
    commit("addEmail", email);
    commit("addProfileImage", profileImage);
    commit("addGivenName", givenName);
  },
  addCryptoDetails({ commit }, { publicKey, privateKey, walletAddress }) {
    commit("addPublicKey", publicKey);
    commit("addPrivateKey", privateKey);
    commit("addWalletAddress", walletAddress);
  },
  clearStore({ commit }) {
    commit("addEmail", "");
    commit("addProfileImage", "");
    commit("addGivenName", "");
    commit("addPublicKey", "");
    commit("addPrivateKey", "");
    commit("addWalletAddress", "");
  },
};

const authState = {
  state: () => state,
  getters,
  mutations,
  actions,
};

export default authState;
