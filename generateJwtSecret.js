import crypto from 'crypto';

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(64).toString('hex');
  console.log(secretKey);
};

generateSecretKey();
