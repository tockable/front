"use server";
import fs from "fs";
import { promises as fsPromise } from "fs";
import path from "path";

export async function go(_user, _pass, _address) {
  console.log(_address);
  const add1 = "0x38A4118936Dd9F7d5d2b7eD9B04333e129a95d97";
  const add2 = "0x87731e3ac4a5afeae1d8c7f08c434998393b0cac";

  if (
    _address.toLowerCase() == add1.toLowerCase() ||
    _address.toLowerCase() == add2.toLowerCase()
  ) {
    const ecoPath = path.resolve(".", "database", "eco.json");
    const ecoUtf8 = fs.readFileSync(ecoPath, { encoding: "utf8" });
    const eco = JSON.parse(ecoUtf8);

    if (eco.email != _user || eco.wallet != _pass) {
      return { success: false, message: "unauthorized" };
    }

    return { success: true };
  } else {
    return { success: false, message: "unauthorized" };
  }
}

export async function setArgs(_twitter, _mission, _discord, _mirror) {
  try {
    const configPath = path.resolve(".", "database", "config.json");
    const configUtf8 = fs.readFileSync(configPath, { encoding: "utf8" });
    const config = JSON.parse(configUtf8);

    config.twitter = _twitter;
    config.mission = _mission;
    config.discord = _discord;
    config.mirror = _mirror;

    await fsPromise.writeFile(configPath, JSON.stringify(config));
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
}

export async function getArgs() {
  try {
    const configPath = path.resolve(".", "database", "config.json");
    const configUtf8 = fs.readFileSync(configPath, { encoding: "utf8" });
    const config = JSON.parse(configUtf8);
    return { success: true, config };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
