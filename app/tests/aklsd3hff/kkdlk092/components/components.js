"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { go } from "@/api/admin/admin";
import { useAccount } from "wagmi";
import { getArgs } from "@/api/admin/admin";
import { setArgs } from "@/api/admin/admin";

export default function Components() {
  const { address, isConnected } = useAccount();
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [submitting, isSubmitting] = useState(false);
  const [setting, isSetting] = useState(false);
  const [correctMail, setCorrectMail] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [ok, setOk] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");
  const [mission, setMission] = useState("");
  const [discord, setDiscord] = useState("");
  const [twitter, setTwitter] = useState("");
  const [mirror, setMirror] = useState("");

  useEffect(() => {
    if (!isConnected) return;
    if (!loggedIn) return;
    getArgs().then((res) => {
      if (res.success) {
        setMission(res.config.mission);
        setTwitter(res.config.twitter);
        setDiscord(res.config.discord);
        setMirror(res.config.mirror);
        setOk(true);
        setErr("");
      } else {
        setOk(false);
        setSuccess("");
        setErr(
          "login failed. please disconnet, refresh the page, and connect again"
        );
      }
    });
  }, [loggedIn]);

  function onChangeEmail(e) {
    setEmail(e.target.value);
    if (e.target.value.match(/^.+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      setCorrectMail(true);
    }
  }

  function onMissionChange(e) {
    setMission(e.target.value);
  }
  function onDiscordChange(e) {
    setDiscord(e.target.value);
  }
  function onTwitterChange(e) {
    setTwitter(e.target.value);
  }
  function onMirrorChange(e) {
    setMirror(e.target.value);
  }

  function onChangeWallet(e) {
    setWallet(e.target.value);
  }

  async function login() {
    if (!isConnected) {
      return;
    }
    if (!email || !wallet) {
      return;
    }
    if (!correctMail) {
      return;
    }

    isSubmitting(true);
    const res = await go(email, wallet, address);
    if (res.success === true) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    isSubmitting(false);
  }

  async function setConfig() {
    console.log("S")
    isSetting(true);
    const res = await setArgs(twitter, mission, discord, mirror);
    if (res.success === true) {
      setErr("");

      setSuccess("successful, you can disconnect now");
    } else {
      setErr("try again");
      setSuccess("");
    }
    isSetting(false);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="my-10">
        <ConnectButton />
      </div>
      {isConnected && !ok && (
        <div className="basis-11/12 md:basis-3/4 lg:basis-1/2">
          <form className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
            <h1 className="mb-12 mt-6 text-xl font-bold text-tock-green">
              JOIN TOCKABLE WAITLIST
            </h1>
            <div className="mb-10">
              <label className="block text-tock-blue text-sm font-bold mb-2">
                email:
              </label>
              <input
                className="appearance-none bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
                value={email}
                id="email"
                type="text"
                placeholder="me@mail.me"
                onChange={onChangeEmail}
                required
              />
            </div>
            <div className="mb-14">
              <label className="block text-tock-blue text-sm font-bold mb-2">
                pass:
              </label>
              <input
                className="appearance-none bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
                value={wallet}
                id="wallet"
                type="text"
                placeholder="0x0"
                onChange={onChangeWallet}
                required
              />
            </div>

            <button
              className="transition ease-in-out mr-4 hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
              type="button"
              disabled={submitting}
              onClick={() => {
                login();
              }}
            >
              go
            </button>
            {err && <p className="tex-sm text-red-500">{err}</p>}
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2023 Tockable. All rights reserved.
          </p>
        </div>
      )}
      {isConnected && ok && (
        <div className="flex justify-center w-full">
          <div className="basis-11/12 md:basis-3/4 lg:basis-1/2">
            <form className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
              <div className="mb-14">
                <label className="block text-tock-blue text-sm font-bold mb-2">
                  set mission(doc) link:
                </label>
                <input
                  className="appearance-none bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
                  value={mission}
                  id="mission"
                  type="text"
                  placeholder="mission"
                  onChange={onMissionChange}
                />
              </div>
              <div className="mb-14">
                <label className="block text-tock-blue text-sm font-bold mb-2">
                  set mirror link:
                </label>
                <input
                  className="appearance-none bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
                  value={mirror}
                  id="mirror"
                  type="text"
                  placeholder="mirror profile"
                  onChange={onMirrorChange}
                />
              </div>
              <div className="mb-14">
                <label className="block text-tock-blue text-sm font-bold mb-2">
                  set twitter link:
                </label>
                <input
                  className="appearance-none bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
                  value={twitter}
                  id="twitter"
                  type="text"
                  placeholder="mission"
                  onChange={onTwitterChange}
                />
              </div>
              <div className="mb-14">
                <label className="block text-tock-blue text-sm font-bold mb-2">
                  set discord link:
                </label>
                <input
                  className="appearance-none bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
                  value={discord}
                  id="wallet"
                  type="text"
                  placeholder="mission"
                  onChange={onDiscordChange}
                />
              </div>

<div className="my-4"> {err && <p className="tex-sm text-tock-red">{err}</p>}</div>
             
              {success && <p className="tex-sm text-tock-green">{success}</p>}
              <button
                className="transition ease-in-out mr-4 hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                type="button"
                disabled={setting}
                onClick={() => {
                  setConfig();
                }}
              >
                set
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
