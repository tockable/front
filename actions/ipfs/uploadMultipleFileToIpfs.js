"use server";
import storeFileToIpfs from "./uploadFileToIpfs";

/**
 *
 * @param {*} _files
 * @returns
 */
export default async function storeMultipleFilesToIpfs(_files) {
  const buffers = await prepareBuffers(_files);
  let _success = true;
  const cids = [];
  for (let key of _files.entries()) {
    const res = await storeFileToIpfs(
      buffers[Number(key[0])].buffer,
      buffers[Number(key[0])].type
    );
    if (res.success === true) {
      cids.push(res.cid);
    } else {
      _success = false;
      return;
    }
  }
  if (!_success) {
    return { success: false, cids: null };
  }
  return { success: true, cids };
}

/**
 *
 * @param {*} _files
 * @returns
 */
async function prepareBuffers(_files) {
  const buffers = [];
  for (let key of _files.entries()) {
    const file = key[1];
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    buffers.push({ buffer, type: "image/png" });
  }
  return buffers;
}
