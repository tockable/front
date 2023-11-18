"use server";

import fs from "fs";
import {
  getPublishedProjectPath,
  getProjectDirectory,
} from "../utils/path-utils";
import getChainData from "@/utils/chain-utils";

export async function fetchProjectMintData(slug) {
  const publishedProjectPath = getPublishedProjectPath();
  try {
    const publishedProjectJson = fs.readFileSync(publishedProjectPath, {
      encoding: "utf8",
    });
    const publishedProjects = JSON.parse(publishedProjectJson);
    const projectBySlug = publishedProjects.find(
      (publishedProject) => publishedProject.slug === slug
    );

    if (!projectBySlug) {
      return { success: false, notFound: true };
    }
    const creatorProjectsDir = getProjectDirectory(projectBySlug.creator);
    const creatorProjectsJson = fs.readFileSync(creatorProjectsDir, {
      encoding: "utf8",
    });
    const creatorProjects = JSON.parse(creatorProjectsJson);
    const project = creatorProjects.find(
      (project) => projectBySlug.slug === project.slug
    );

    const chainData = getChainData(project.chainId);
    const payload = {
      uuid: project.uuid,
      name: project.name,
      tokenName: project.tokenName,
      description: project.description,
      twitter: project.twitter,
      discord: project.discord,
      website: project.website,
      creator: project.creator,
      image: project.image,
      cover: project.cover,
      totalSupply: project.totalSupply,
      isUnlimited: project.isUnlimited,
      duplicateVerification: project.duplicateVerification,
      contractAddress: project.contractAddress,
      dropType: project.dropType,
      layers: project.layers,
      fileNames: project.fileNames,
      cids: project.cids,
      signer: project.signer,
      chainData,
      activeSession: project.activeSession,
      slug,
    };
    return { success: true, payload };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function getElligibility(_address, _creator, _slug) {
  try {
    const creatorProjectsDir = getProjectDirectory(_creator);
    const creatorProjectsJson = fs.readFileSync(creatorProjectsDir, {
      encoding: "utf8",
    });
    const creatorProjects = JSON.parse(creatorProjectsJson);
    const project = creatorProjects.find((project) => _slug === project.slug);
    const activeSessionData = project.activeSession;

    const _current = new Date();
    const current = Date.UTC(
      _current.getUTCFullYear(),
      _current.getUTCMonth(),
      _current.getUTCDate(),
      _current.getUTCHours(),
      _current.getUTCMinutes()
    );
    // const current = _current.getTime();

    // if mint not started
    if (project.activeSession.toString().length === 0) {
      const timestamps = [];
      for (let i = 0; i < project.sessions.length; i++) {
        const _append = project.sessions[i].start + ":00Z";
        const _date = new Date(_append);
        timestamps.push(_date.getTime());
      }
      timestamps.sort((a, b) => a - b);

      const firstSession = timestamps[0];
      const untilStart = firstSession - current;

      return { success: true, notStarted: true, untilStart };
    }

    if (project.paused) {
      return { success: true, paused: true };
    }

    const timestamps = [];
    for (let i = 0; i < project.sessions.length; i++) {
      const _append = project.sessions[i].start + ":00Z";
      const _date = new Date(_append);
      timestamps.push(_date.getTime());
    }

    timestamps.sort((a, b) => b - a);

    const endOfMint = timestamps[0];

    // if mint ended
    if (current < endOfMint) {
      return { success: true, mintEnded: true };
    }

    // until current session
    const currentSession = project.sessions[Number(project.activeSession)];

    const _append = currentSession.end + ":00Z";
    const _end = new Date(_append);

    const end = _end.getTime();

    let untilEnd;
    if (current < end) {
      untilEnd = end - current;
    }

    if (project.activeSession == 0) {
      return {
        success: true,
        payload: {
          untilEnd,
          elligibility: true,
          justPublicMint: true,
          activeSession: project.activeSession,
          availableRoles: [
            {
              id: project.roles[0].id,
              name: project.roles[0].name,
              price: project.roles[0].price,
              quota: project.roles[0].quota,
            },
          ],
        },
      };
    }

    const availableRoles = [];
    for (let roleId of project.sessions[activeSessionData].roles) {
      if (roleId == 0) {
        const newRole = {
          id: project.roles[0].id,
          name: project.roles[0].name,
          price: project.roles[0].price,
          quota: project.roles[0].quota,
        };
        availableRoles.push(newRole);
      } else {
        const index = project.roles[roleId].allowedAddresses.findIndex(
          (allowedAddress) =>
            allowedAddress.toLowerCase() === _address.toLowerCase()
        );
        if (index !== -1) {
          const newRole = {
            id: project.roles[roleId].id,
            name: project.roles[roleId].name,
            price: project.roles[roleId].price,
            quota: project.roles[roleId].quota,
          };
          availableRoles.push(newRole);
        }
      }
    }
    if (availableRoles.length == 1) {
      if (availableRoles[0].id == 0) {
        return {
          success: true,
          payload: {
            untilEnd,
            elligibility: true,
            activeSession: project.activeSession,
            justPublicMint: true,
            availableRoles,
          },
        };
      } else {
        return {
          success: true,
          payload: {
            untilEnd,
            activeSession: project.activeSession,
            elligibility: true,
            justPublicMint: false,
            availableRoles,
          },
        };
      }
    } else if (availableRoles.length > 1) {
      return {
        success: true,
        payload: {
          untilEnd,
          elligibility: true,
          activeSession: project.activeSession,
          justPublicMint: false,
          availableRoles,
        },
      };
    } else {
      return {
        success: true,
        payload: {
          untilEnd,
          elligibility: false,
          activeSession: project.activeSession,
          justPublicMint: false,
          availableRoles,
        },
      };
    }
  } catch (err) {
    return { success: false };
  }
}
