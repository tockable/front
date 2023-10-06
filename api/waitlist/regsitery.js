"use server";

import { promises as fsPromises } from "fs";
import path from "path";
const referralCodes = require("referral-codes");

export default async function addToRegistery(_email, _referral, _wallet) {
  const registeryPath = path.resolve(
    ".",
    "database",
    "waitlist",
    "waitlist.json"
  );
  const registery = JSON.parse(
    await fsPromises.readFile(registeryPath, { encoding: "utf8" })
  );

  let wrongReferral = false;
  let duplicateEmail = false;
  let wrongEmail = false;
  let wrongWallet = false;
  let duplicateWallet = false;
  let referralNotFound = false;

  // Check referral
  if (_referral.match(/^[a-zA-Z0-9]{5}$/g)) {
    console.log(_referral);
    const index = registery.findIndex((w) => w.referral === _referral);
    if (index !== -1) {
      registery[index].invites = registery[index].invites + 1;
    } else {
      referralNotFound = true;
    }
  } else if (!_referral.match(/^[a-zA-Z0-9]{5}$/g) && _referral.length !== 0) {
    wrongReferral = true;
  }

  // Check email
  if (_email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
    const index = registery.findIndex((w) => w.email === _email);
    if (index !== -1) {
      duplicateEmail = true;
    }
  } else {
    wrongEmail = true;
  }

  // Check wallet
  if (_wallet.match(/^0x[a-fA-F0-9]{40}$/gm)) {
    const index = registery.findIndex((w) => w.walletAddress === _wallet);
    if (index !== -1) {
      duplicateWallet = true;
    }
  } else {
    wrongWallet = true;
  }

  let message = [];

  if (wrongEmail) {
    message.push("email address must have the correct format.");
  }

  if (wrongReferral) {
    message.push(
      "It seems that the entered code does not have the correct format."
    );
  }

  if (duplicateEmail) {
    message.push("This e-mail has been registered before.");
  }

  if (referralNotFound) {
    message.push("Referral code not found");
  }

  if (wrongWallet) {
    message.push(
      "It seems that the entered wallet address does not have the correct format."
    );
  }

  if (duplicateWallet) {
    message.push("This wallet has been registered before.");
  }

  if (message.length > 0) {
    return {
      success: false,
      message,
    };
  }

  let newReferral = referralCodes.generate({
    length: 5,
    count: 1,
  });

  const new_waitlist = {
    email: _email,
    walletAddress: _wallet,
    referral: newReferral[0],
    invites: 0,
  };

  await fsPromises.writeFile(
    registeryPath,
    JSON.stringify([...registery, new_waitlist])
  );

  return {
    success: true,
    newReferral: newReferral[0],
  };
}
