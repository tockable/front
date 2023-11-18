"use server";

import { NFTStorage, File } from "nft.storage";
import path from "path";

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

export default async function uploadDirectoryToIpfs(
  _files,
  retries = 5,
  err = null
) {
  if (!retries) return { success: false, cid: null, message: err.message };
  try {
    const cid = await _uploadDirectoryToIpfs(_files);
    if (cid === "" || cid === null || cid === undefined)
      throw new Error("invalid cid");
    return { success: true, cid };
  } catch (err) {
    return await uploadDirectoryToIpfs(_files, retries - 1, err);
  }
}

async function prepareFiles(_files) {
  const files = [];
  for (let key of _files.entries()) {
    const file = key[1];
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    files.push(
      new File([buffer], path.basename(file.name), {
        type: file.type,
      })
    );
  }
  return files;
}

async function _uploadDirectoryToIpfs(_files) {
  const storage = new NFTStorage({ token: NFT_STORAGE_KEY });
  const files = await prepareFiles(_files);
  const cid = await storage.storeDirectory(files);
  return cid;
}
