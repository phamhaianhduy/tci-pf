import forge from 'node-forge';
import duyphaPublicKey from '../keys/duyphaPublicKey';

const encryptPassword = (plainPassword) => {
  const publicKey = forge.pki.publicKeyFromPem(duyphaPublicKey);
  const encryptedBytes = publicKey.encrypt(plainPassword, 'RSA-OAEP');
  return forge.util.encode64(encryptedBytes);
}

export default encryptPassword;