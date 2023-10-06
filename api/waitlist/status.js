"use server";

import { promises as fsPromises } from "fs";
import path from "path";

export default async function getStatus(_address) {
  const registeryPath = path.resolve(
    ".",
    "database",
    "waitlist",
    "waitlist.json"
  );
  const registery = JSON.parse(
    await fsPromises.readFile(registeryPath, { encoding: "utf8" })
  );

  const userIndex = registery.findIndex(
    (w) => w.walletAddress.toLowerCase() === _address.toLowerCase()
  );

  if (userIndex === -1) {
    return {
      success: false,
      message:
        "Sorry, It seems that this wallet has not been registered before.",
    };
  }

  const userData = {
    email: registery[userIndex].email,
    walletAddress: registery[userIndex].walletAddress,
    referral: registery[userIndex].referral,
    invites: registery[userIndex].invites,
  };

  return {
    success: true,
    userData,
  };
}
