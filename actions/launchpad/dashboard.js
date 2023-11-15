"use server";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getProjectDirectory } from "../utils/path-utils.js";

const DATABASE = process.env.DATABASE;

/**
 *
 * @param {*} creator
 * @param {*} name
 * @param {*} chain
 * @param {*} chainId
 * @param {*} dropType
 * @returns
 */
function initProject(creator, name, chain, chainId, dropType) {
  const uuid = uuidv4();
  return {
    uuid,
    version: 1,
    creator,
    chain,
    chainId,
    dropType,
    name,
    description: "",
    website: "",
    twitter: "",
    discord: "",
    slug: "",
    image: null,
    cover: null,
    tokenName: "",
    tokenSymbol: "",
    duplicateVerification: null,
    firstTokenId: 1,
    roles: [],
    sessions: [],
    signer: "",
    contractAddress: "",
    layers: [],
    fileNames: [],
    cids: [],
    paused: true,
    activeSession: "",
    isDeployed: false,
    isPublished: false,
    isUnlimited: false,
    isVerified: false,
  };
}

/**
 *
 * @param {string} _creator
 * @returns
 */
export async function fetchAllProjectsByWallet(_creator) {
  if (!_creator.match(/^0x[a-fA-F0-9]{40}$/g))
    return { success: false, message: "invalid wallet address: ", _creator };

  const projectsPath = getProjectDirectory(_creator);

  try {
    const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
    const projects = JSON.parse(json);

    let payload = [];

    projects.forEach((project) => {
      const p = {
        uuid: project.uuid,
        name: project.name,
        image: project.image,
        chainId: project.chainId,
      };
      payload.push(p);
    });

    return { success: true, payload };
  } catch (err) {
    return { success: false };
  }
}

/**
 *
 * @param {string} _creator
 * @param {object} _project
 * @returns
 */
export async function createNewProject(_creator, _project) {
  if (!_creator.match(/(\b0x[a-fA-F0-9]{40}\b)/g))
    return { success: false, message: "Invalid wallet address" };

  const projectsPath = getProjectDirectory(_creator);
  let projects = [];

  if (fs.existsSync(projectsPath)) {
    const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
    projects = JSON.parse(json);
  } else {
    const dirPath = path.resolve(
      ".",
      DATABASE,
      "projects",
      _creator.slice(2, 42)
    );
    fs.mkdirSync(dirPath);
  }

  const { name, chain, chainId, dropType } = _project;

  const newProject = initProject(_creator, name, chain, chainId, dropType);

  await fs.promises.writeFile(
    projectsPath,
    JSON.stringify([...projects, newProject])
  );

  return {
    success: true,
    uuid: newProject.uuid,
    chain,
    message: "The project successfully created",
  };
}
