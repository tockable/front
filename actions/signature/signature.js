"use server";

import { keccak256, encodePacked, toBytes } from "viem";
import { ethers } from "ethers";
import { getProjectDataDirectory } from "../utils/path-utils";
import fs from "fs";
/**
 *
 * @param {*} _creator
 * @param {*} _contract
 * @param {*} _address
 * @param {*} _roleId
 * @param {*} _sessionId
 * @returns
 */
export default async function getHashAndSignature(
  _creator,
  _address,
  _roleId,
  _sessionId,
  _signer
) {
  try {
    const projectsDataPath = getProjectDataDirectory(_creator);
    const json = fs.readFileSync(projectsDataPath, {
      encoding: "utf8",
    });
    const projectsData = JSON.parse(json);
    const projectData = projectsData.find(
      (projectData) =>
        projectData.address.toLowerCase() === _signer.toLowerCase()
    );

    const signer = new ethers.Wallet(projectData.privateKey);

    const hash = keccak256(
      encodePacked(
        ["address", "uint256", "uint256"],
        [_address, _roleId, _sessionId]
      )
    );

    const messageBytes = toBytes(hash);
    const signature = await signer.signMessage(messageBytes);
    return { success: true, payload: { hash, signature } };
  } catch (err) {
    return { success: false, payload: {} };
  }
}
