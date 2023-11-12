"use server";

import { promises as fsPromises } from "fs";
import path from "path";
const DATABASE = process.env.DATABASE
export default async function addToRegistery(_email) {
  const registeryPath = path.resolve(
    ".",
    DATABASE,
    "waitlists",
    "waitlist.json"
  );
  const registery = JSON.parse(
    await fsPromises.readFile(registeryPath, { encoding: "utf8" })
  );

  let duplicateEmail = false;
  let wrongEmail = false;

  // Check email
  if (_email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
    const index = registery.findIndex((w) => w.email === _email);
    if (index !== -1) {
      duplicateEmail = true;
    }
  } else {
    wrongEmail = true;
  }

  let message = [];

  if (wrongEmail) {
    message.push("email address must have the correct format.");
  }

  if (duplicateEmail) {
    message.push("This e-mail has been registered before.");
  }

  if (message.length > 0) {
    return {
      success: false,
      message,
    };
  }

  const new_waitlist = {
    email: _email,
  };

  await fsPromises.writeFile(
    registeryPath,
    JSON.stringify([...registery, new_waitlist])
  );

  return {
    success: true,
  };
}
