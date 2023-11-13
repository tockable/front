"use server";
import { NFTStorage, File } from "nft.storage";

const MAX_RETRIES = 5;
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

export default async function storeFileToIpfs(
  buffer,
  mimeType,
  fileName = "image.png",
  retries = MAX_RETRIES,
  err = null
) {
  if (!retries)
    return {
      success: false,
      cid: null,
      existance: false,
      message: err.message,
    };
  try {
    const { cid, existance } = await _store(
      buffer,
      mimeType,
      fileName,
      retries
    );

    if (cid === "" || cid === null || cid === undefined)
      throw new Error("invalid cid");

    return { success: true, cid, existance };
  } catch (err) {
    return await storeFileToIpfs(buffer, mimeType, fileName, retries - 1, err);
  }
}

async function _store(buffer, mimeType, fileName, retries) {
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
  const img = fileFromBuffer(buffer, mimeType, fileName);

  let existance = false;
  let ccid = "";
  if (retries === MAX_RETRIES) {
    const { _cid, _existance } = await checkExistance(img);
    existance = _existance;
    ccid = _cid;
  }

  if (!existance) {
    const cid = await nftstorage.storeBlob(img);
    return { cid, existance };
  }

  if (existance) {
    return { cid: ccid, existance };
  }
}

function fileFromBuffer(buffer, type, fileName) {
  return new File([buffer], fileName, { type: type });
}

async function checkExistance(_client, _file) {
  try {
    const { cid } = await NFTStorage.encodeBlob(_file);
    const status = await _client.check(cid);

    if (status.pin.status === "pinned") {
      return { _cid: status.pin.cid, _existance: true };
    } else {
      throw new Error("not pinned");
    }
  } catch (err) {
    return { _cid: null, _existance: false };
  }
}
