import { NFTStorage, File } from "nft.storage";

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

export default async function storeJsonToIpfs(
  metadataJson,
  retries = 5,
  err = null
) {
  if (!retries) return { success: false, cid: null, message: err.message };

  try {
    const cid = await _storeJsonToIpfs(metadataJson);
    if (cid === "" || cid === null || cid === undefined)
      throw new Error("invalid cid");

    return { success: true, cid };
  } catch (err) {
    return await storeJsonToIpfs(metadataJson, retries - 1, err);
  }
}

async function _storeJsonToIpfs(metadataJson) {
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
  const cid = await nftstorage.storeBlob(new Blob([metadataJson]));
  return cid;
}
