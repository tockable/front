"use server";

import fs from "fs";
import path from "path";
import { getAddress } from "viem";
import storeFileToIpfs from "../ipfs/uploadFileToIpfs.js";
import {
  getProjectDirectory,
  getPublishedProjectPath,
} from "../utils/path-utils.js";

const DATABASE = process.env.DATABASE;

/**
 *
 * @param {string} _creator
 * @param {string} _uuid
 * @returns
 */
export async function fetchProjectByUUID(_creator, _uuid) {
  if (!_creator.match(/(\b0x[a-fA-F0-9]{40}\b)/g))
    return { success: false, message: "Invalid wallet address" };

  const projectsPath = getProjectDirectory(_creator);
  if (!fs.existsSync(projectsPath)) {
    return { success: false };
  }
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);

  const project = projects.find((p) => p.uuid === _uuid);
  if (!project) return { success: false, message: "Project not found" };
  return { success: true, payload: project };
}

/**
 *
 * @param {string} _slug
 * @returns
 */
export async function checkUniqueSlug(_slug) {
  try {
    const json = fs.readFileSync(path.resolve(".", `${DATABASE}/slugs.json`));
    const slugs = JSON.parse(json);
    const duplicate = slugs.find(
      (slug) => slug.toLowerCase() === _slug.toLowerCase()
    );
    if (duplicate) return { success: true, duplicate: true };
    return { success: true, duplicate: false };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
/**
 *
 * @param {string} _creator
 * @param {object} _project
 */
export async function updateProjectDetails(_creator, _projectDetails, _files) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _projectDetails.uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }

  let image, cover;
  const { name, description, website, twitter, discord, slug } =
    _projectDetails;
  if (_files !== null) {
    image = _files.get("image");
    cover = _files.get("cover");
  } else {
    image = null;
    cover = null;
  }

  try {
    projects[ind].name = name;
    projects[ind].description = description;
    projects[ind].website = website;
    projects[ind].twitter = twitter;
    projects[ind].discord = discord;
    projects[ind].slug = slug;

    if (image !== null && image !== "null") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const res = await storeFileToIpfs(buffer, image.type, image.name);
      if (
        res.success === true &&
        res.cid &&
        res.cid !== "" &&
        res.cid !== undefined
      ) {
        projects[ind].image = res.cid;
      } else {
        return { success: false, message: "Something wrong with ipfs" };
      }
    }

    if (cover !== null && cover !== "null") {
      const bytes = await cover.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const res = await storeFileToIpfs(buffer, cover.type, cover.name);
      if (
        res.success === true &&
        res.cid &&
        res.cid !== "" &&
        res.cid !== undefined
      ) {
        projects[ind].cover = res.cid;
      } else {
        return { success: false, message: "Something wrong with ipfs" };
      }
    }
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));

    const slugPath = path.resolve(".", `${DATABASE}/slugs.json`);
    const slugsJSon = fs.readFileSync(slugPath, { encoding: "utf8" });
    const slugs = JSON.parse(slugsJSon);
    const writedBefore = slugs.find(
      (s) => s.toLowerCase() === slug.toLowerCase()
    );

    if (!writedBefore) {
      await fs.promises.writeFile(slugPath, JSON.stringify([...slugs, slug]));
    }

    return {
      success: true,
      payload: projects[ind],
      message: "Project details updated successfully",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {string} _creator
 * @param {object} _project
 */
export async function updateProjectContract(_creator, _projectContract) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _projectContract.uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }

  try {
    const {
      tokenName,
      tokenSymbol,
      isUnlimited,
      totalSupply,
      firstTokenId,
      duplicateVerification,
    } = _projectContract;
    projects[ind].tokenName = tokenName;
    projects[ind].isUnlimited = isUnlimited;
    projects[ind].tokenSymbol = tokenSymbol;
    projects[ind].totalSupply = totalSupply;
    projects[ind].firstTokenId = firstTokenId;
    projects[ind].duplicateVerification = duplicateVerification;

    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));
    return {
      success: true,
      payload: projects[ind],
      message: "project contract updated successfully.",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _creator
 * @param {*} _projectRoles
 * @returns
 */
export async function updateProjectRoles(_creator, _projectRoles) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _projectRoles.uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }
  try {
    projects[ind].roles = _projectRoles.roles;
    projects[ind].roleDeployed = true;
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));
    return {
      success: true,
      payload: projects[ind],
      message: "project roles updated successfully.",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _creator
 * @param {*} _projectSessions
 * @returns
 */
export async function updateProjectSessions(_creator, _projectSessions) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _projectSessions.uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }
  try {
    projects[ind].sessions = _projectSessions.sessions;
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));
    return {
      success: true,
      payload: projects[ind],
      message: "project sessions updated successfully.",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _uuid
 * @param {*} _creator
 * @returns
 */
export async function publishProject(_uuid, _creator) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }
  try {
    projects[ind].isPublished = true;
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));

    const publishedProjectPath = getPublishedProjectPath();

    const json = fs.readFileSync(publishedProjectPath, { encoding: "utf8" });
    const publishedProjects = JSON.parse(json);
    const newPublishedProject = {
      name: projects[ind].tokenName,
      image: projects[ind].image,
      chain: projects[ind].chain,
      slug: projects[ind].slug,
      creator: projects[ind].creator,
      contractAddress: projects[ind].contractAddress,
    };
    const editedPublishedProjects = [...publishedProjects, newPublishedProject];
    await fs.promises.writeFile(
      publishedProjectPath,
      JSON.stringify(editedPublishedProjects)
    );

    return {
      success: true,
      payload: projects[ind],
      message: "project successfully published.",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _uuid
 * @param {*} _creator
 * @returns
 */
export async function unPublishProject(_uuid, _creator) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);

  const ind = projects.findIndex((p) => p.uuid === _uuid);

  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }

  try {
    projects[ind].isPublished = false;
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));

    const publishedProjectPath = getPublishedProjectPath();

    const json = fs.readFileSync(publishedProjectPath, { encoding: "utf8" });
    const publishedProjects = JSON.parse(json);
    const publishedInd = publishedProjects.findIndex(
      (p) => p.slug.toLowerCase() === projects[ind].slug.toLowerCase()
    );

    publishedProjects.splice(publishedInd, 1);

    await fs.promises.writeFile(
      publishedProjectPath,
      JSON.stringify(publishedProjects)
    );

    return {
      success: true,
      payload: projects[ind],
      message: "project successfully unpublished.",
    };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _uuid
 * @param {*} _creator
 * @param {*} _contractAddress
 * @returns
 */
export async function updateDeployStatus(_uuid, _creator, _contractAddress) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }
  try {
    projects[ind].isDeployed = true;
    projects[ind].contractAddress = getAddress(_contractAddress);
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));

    return {
      success: true,
      payload: projects[ind],
      message: "project successfully unpublished.",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _uuid
 * @param {*} _creator
 * @param {*} _signer
 * @returns
 */
export async function upddateProjectSigner(_uuid, _creator, _signer) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }
  try {
    projects[ind].signer = _signer;
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));

    return {
      success: true,
      payload: projects[ind],
      message: "updated successfully",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _uuid
 * @param {*} _creator
 * @param {*} _layers
 * @param {*} _layerFilesNames
 * @param {*} _cids
 * @returns
 */
export async function updateProjectMetadata(
  _uuid,
  _creator,
  _layers,
  _layerFilesNames,
  _cids
) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }
  try {
    projects[ind].layers = _layers;
    projects[ind].fileNames = _layerFilesNames;
    projects[ind].cids = _cids;
    fs.writeFileSync(projectsPath, JSON.stringify(projects));

    return {
      success: true,
      payload: projects[ind],
      message: "metadata updated successfully",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _creator
 * @param {*} _uuid
 * @param {*} _activeSession
 * @returns
 */
export async function updateActiveSession(_creator, _uuid, _activeSession) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }
  try {
    projects[ind].activeSession = Number(_activeSession);
    projects[ind].paused = false;
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));

    return {
      success: true,
      payload: projects[ind],
      message: "active session updated successfully",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _creator
 * @param {*} _uuid
 * @returns
 */
export async function setMintPaused(_creator, _uuid) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }
  try {
    projects[ind].paused = true;
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));

    return {
      success: true,
      payload: projects[ind],
      message: "mint status updated!",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _creator
 * @param {*} _uuid
 * @returns
 */
export async function updateIsVerified(_creator, _uuid) {
  const projectsPath = getProjectDirectory(_creator);
  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);
  const ind = projects.findIndex((p) => p.uuid === _uuid);
  if (_creator.toLowerCase() !== projects[ind].creator.toLowerCase()) {
    return { success: false, message: "forbidden" };
  }
  try {
    projects[ind].isVerified = true;
    await fs.promises.writeFile(projectsPath, JSON.stringify(projects));

    return {
      success: true,
      payload: projects[ind],
      message: "mint status updated!",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
