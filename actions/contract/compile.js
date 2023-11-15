"use server";
import fs from "fs";
import rimraf from "rimraf";
import path from "path";
const solc = require("solc");
import { camelize } from "@/utils/string-utils";
import { getBuildDirectory } from "../utils/path-utils";
import { fetchProjectByUUID } from "../launchpad/projects";
import createCostimizedContractFile from "./createCustomContract";

function getContractName(_project) {
  return camelize(_project.name, true);
}

async function createContract(_project, _buildDirectory, _contractName) {
  const editedBaseContract = await createCostimizedContractFile(
    _project,
    _buildDirectory,
    _contractName
  );

  if (fs.existsSync(_buildDirectory)) {
    rimraf.sync(_buildDirectory);
    fs.mkdirSync(_buildDirectory);
  } else {
    fs.mkdirSync(_buildDirectory);
  }

  fs.writeFileSync(
    `${_buildDirectory}/${_contractName}.sol`,
    editedBaseContract
  );
}

function compile(_contractName, _project, _buildDirectory) {
  const sources = {};
  compileImports(sources, _project, _contractName, _buildDirectory);

  var input = {
    language: "Solidity",
    sources: sources,
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  // const solc_version = "0.8.21+commit.d9974bed";
  // const solc_version = "v0.8.20+commit.a1b79de6";

  // solc.loadRemoteVersion("v0.8.20+commit.a1b79de6", function (err, solcSnapshot) {
  // if (err) {
  //   console.log(err, "err");
  // } else {
  const output = solc.compile(JSON.stringify(input));
  // console.log(output);
  const contract = JSON.parse(output);

  const metadata = {
    abi: contract.contracts[`${_contractName}.sol`][_contractName].abi,
    bytecode:
      contract.contracts[`${_contractName}.sol`][_contractName].evm.bytecode
        .object,
    deployedBytecode:
      contract.contracts[`${_contractName}.sol`][_contractName].evm
        .deployedBytecode.object,
  };

  // console.log(metadata);
  // console.log(metadata,'s')
  return metadata;
  // }
  // });

  // return "s";

  // const output = solc.compile(JSON.stringify(input));
}

function compileImports(sources, _project, _contractName, _buildDirectory) {
  sources[`${_contractName}.sol`] = {
    content: fs.readFileSync(
      path.resolve(_buildDirectory, `${_contractName}.sol`),
      "utf8"
    ),
  };
}

function writeOutput(_metadata, _project, _buildDirectory, _contractName) {
  fs.writeFileSync(
    path.resolve(_buildDirectory, _contractName + ".json"),
    JSON.stringify(_metadata)
  );
}

export async function createAndCompile(_creator, _uuid) {
  try {
    let project;
    const res = await fetchProjectByUUID(_creator, _uuid);
    if (res.success) {
      project = res.payload;
    } else {
      throw new Error("No Project find");
    }

    const buildDirectory = getBuildDirectory(project);
    const contractName = getContractName(project);
    await createContract(project, buildDirectory, contractName);
    const metadata = compile(contractName, project, buildDirectory);
    writeOutput(metadata, project, buildDirectory, contractName);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
