import path from "path";
import { camelize } from "@/utils/string-utils";

const DATABASE = process.env.DATABASE;
const publishedProjectPath = path.resolve(
  ".",
  `${DATABASE}/publishedProjects/publishedProjects.json`
);

/**
 *
 * @param {*} _creator
 * @returns
 */
export function getProjectDirectory(_creator) {
  const dir = _creator.slice(2, 42);
  const projectsPath = path.resolve(
    ".",
    DATABASE,
    "projects",
    dir,
    "projects.json"
  );
  return projectsPath;
}

/**
 *
 * @returns
 */
export function getPublishedProjectPath() {
  return publishedProjectPath;
}

/**
 *
 * @param {*} _creator
 * @param {*} _uuid
 * @returns
 */
export function getProjectFilesDirectory(_creator, _uuid) {
  const dir = _creator.slice(2, 42);
  const filesPath = path.resolve(".", DATABASE, "projects", dir, _uuid);
  return filesPath;
}

/**
 *
 * @param {*} _creator
 * @param {*} _uuid
 * @param {*} _contractName
 * @returns
 */
export function getProjectMetadataPath(_creator, _uuid, _projectName) {
  const contractName = camelize(_projectName, true);
  const dir = _creator.slice(2, 42);
  const abiPath = path.resolve(
    ".",
    DATABASE,
    "projects",
    dir,
    _uuid,
    `${contractName}.json`
  );
  return abiPath;
}

/**
 *
 * @param {*} _creator
 * @returns
 */
export function getProjectDataDirectory(_creator) {
  const dir = _creator.slice(2, 42);
  const projectsDataPath = path.resolve(
    ".",
    DATABASE,
    "projects",
    dir,
    "projectsData.json"
  );
  return projectsDataPath;
}

/**
 *
 * @param {*} _project
 * @returns
 */
export function getBuildDirectory(_project) {
  const dir = _project.creator.slice(2, 42);
  const buildDirectory = path.resolve(
    ".",
    DATABASE,
    "projects",
    dir,
    _project.uuid
  );
  return buildDirectory;
}
