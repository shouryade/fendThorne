function padPublicKey(publicKey) {
  return "0x04" + publicKey.X.padStart(64, "0") + publicKey.Y.padStart(64, "0");
}

export default padPublicKey;
