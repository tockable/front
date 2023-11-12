"use server";

import { ethers } from "ethers";
import fs from "fs";
import { getProjectDataDirectory } from "../utils/path-utils";
import { fetchProjectByUUID } from "../launchpad/projects";

export async function createNewSigner(_creator, _uuid) {
  try {
    const projectsDataPath = getProjectDataDirectory(_creator);
    const project = await fetchProjectByUUID(_uuid);

    let projectsData = [];

    if (fs.existsSync(projectsDataPath)) {
      const json = fs.readFileSync(projectsDataPath, {
        encoding: "utf8",
      });
      projectsData = JSON.parse(json);
    }
    const wallet = ethers.Wallet.createRandom();

    const newData = {
      address: wallet.address,
      mnemonic: wallet.mnemonic.phrase,
      privateKey: wallet.privateKey,
      uuid: project.uuid,
    };

    fs.writeFileSync(
      projectsDataPath,
      JSON.stringify([...projectsData, newData])
    );
    return { success: true, signer: wallet.address };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
