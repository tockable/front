"use server";

const pinataSDK = require("@pinata/sdk");
import { getProjectFilesDirectory } from "../utils/path-utils";

export async function pinToPinataIpfs(_path, _contractName) {
  try {
    const pinata = new pinataSDK(
      process.env.PINATA_API_KEY,
      process.env.PINATA_SECRET_KEY
    );
    const options = {
      pinataMetadata: {
        name: _contractName,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const res = await pinata.pinFromFS(_path, options);
    return { success: true, cid: res.IpfsHash };
  } catch (err) {
    return { success: false, cid: null };
  }
}
