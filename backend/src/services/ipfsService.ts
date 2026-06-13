import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

export const uploadToIPFS = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: mimeType,
    });

    const metadata = JSON.stringify({ name: fileName });
    formData.append('pinataMetadata', metadata);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    return response.data.IpfsHash;
  } catch (error: any) {
    console.error('IPFS upload failed:', error.message);
    throw error;
  }
};

export const getIPFSUrl = (hash: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};