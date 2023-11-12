"use server";
import { NFTStorage, File } from "nft.storage";

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;
export default async function storeFileToIpfs(
  buffer,
  mimeType,
  fileName = "image.png",
  retries = 5,
  err = null
) {
  if (!retries) return { success: false, cid: null, message: err.message };

  try {
    const cid = await _storeFileToIpfs(buffer, mimeType, fileName);
    if (cid === "" || cid === null || cid === undefined)
      throw new Error("invalid cid");
    return { success: true, cid };
  } catch (err) {
    return await storeFileToIpfs(buffer, mimeType, fileName, retries - 1, err);
  }
}

async function _storeFileToIpfs(buffer, mimeType, fileName) {
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
  const img = fileFromBuffer(buffer, mimeType, fileName);
  const cid = await nftstorage.storeBlob(img);
  return cid;
}

function fileFromBuffer(buffer, type, fileName) {
  return new File([buffer], fileName, { type: type });
}
