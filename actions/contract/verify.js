"use server";
import fs from "fs";
import path from "path";
import { camelize } from "@/utils/string-utils";
import getVerifyChainData from "./getVerifyChainData";
import { encodeAbiParameters } from "viem";
import { TOCKABLE_ADDRESS } from "@/tock.config";
import { updateIsVerified } from "../launchpad/projects";

// const COMPILER_VERSIONS = {
//   v800: "v0.8.0+commit.c7dfd78e",
//   v819: "v0.8.19+commit.7dd6d404",
//   v820: "v0.8.20+commit.a1b79de6",
//   v821: "v0.8.21+commit.d9974bed",
//   v822: "v0.8.22+commit.4fc1097e",
//   v823: "v0.8.23+commit.f704f362",
// };

const DATABASE = process.env.DATABASE;

const constructorAbi = {
  inputs: [
    { internalType: "address", name: "_tockableAddress", type: "address" },
    { internalType: "address", name: "_signerAddress", type: "address" },
  ],
  stateMutability: "nonpayable",
  type: "constructor",
};
export default async function verify(_project) {
  try {
    const chainData = await getVerifyChainData(Number(_project.chainId));
    const contractName = camelize(_project.name, true);

    const cargs = encodeAbiParameters(constructorAbi.inputs, [
      TOCKABLE_ADDRESS,
      _project.signer,
    ]);
    const editedcargs = cargs.slice(2);
    const sourcepath = path.resolve(
      ".",
      DATABASE,
      "projects",
      _project.creator.slice(2),
      _project.uuid,
      `${contractName}.sol`
    );

    const source = fs.readFileSync(sourcepath, { encoding: "utf8" });
    const editedsource = source.slice(0, -1);

    const request = {
      apikey: chainData.apikey,
      module: "contract",
      action: "verifysourcecode",
      sourceCode: editedsource,
      contractaddress: _project.contractAddress,
      codeformat: "solidity-single-file",
      contractname: contractName,
      compilerversion: "v0.8.21+commit.d9974bed",
      optimizationused: 1,
      runs: 200,
      evmversiom: "paris",
      constructorArguements: editedcargs,
      licenseType: 3,
    };

    let formBody = [];
    for (let property in request) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(request[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const res = await fetch(chainData.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: formBody,
    });
    const data = await res.json();
    if (data.ok) {
      if (data.status === 1) {
        // console.log(data.result);
        const res = await updateIsVerified(_project._creator, _project.uuid);
        if (res.success === true) {
          // fs.unlinkSync(sourcepath);
          return { success: true, payload: res.payload };
        } else {
          throw new Error("not updated");
        }
      } else {
        throw new Error("not verified");
      }
    } else {
      throw new Error("not fetched");
    }
  } catch (err) {
    // console.log(err);
    return { success: false, payload: null, message: err.message };
  }
}
