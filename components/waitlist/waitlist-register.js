"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CopyToClipboard from "react-copy-to-clipboard";
import { BASEURL } from "@/tock.config";
import addToRegistery from "@/api/waitlist/regsitery";
import Fade from "@/components/design/fade/fade";

export default function Register() {
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  const [wallet, setWallet] = useState("");

  const [regReferral, setRegReferral] = useState("");

  const [correctMail, setCorrectMail] = useState(false);
  const [correctWallet, setCorrectWallet] = useState(false);
  const [correctReferral, setCorrectReferral] = useState(true);
  const [showWarnings, setShowWarnings] = useState(false);
  const [showApiErrors, setShowApiErrors] = useState(false);
  const [apiErrors, setApiErrors] = useState([]);
  const [submitting, isSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [renderFrom, setRenderForm] = useState(true);
  const [renderResult, setRenderResult] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (regSuccess) {
      setRenderForm(false);
      const timeOut = setTimeout(() => {
        setRenderResult(true);
      }, 400);
    }
  }, [regSuccess]);

  function onChangeEmail(e) {
    setEmail(e.target.value);
    if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      setCorrectMail(true);
    } else setCorrectMail(false);
  }

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const ref = queryParameters.get("ref");
    if (ref) {
      setReferral(ref);
    }
  }, []);

  // function onChangeReferral(e) {
  //   setReferral(e.target.value);
  //   if (e.target.value.match(/^[a-zA-Z0-9]{5}$/g) || e.target.value == 0) {
  //     setCorrectReferral(true);
  //   } else setCorrectReferral(false);
  // }

  function onChangeWallet(e) {
    setWallet(e.target.value);
    if (e.target.value.match(/^0x[a-fA-F0-9]{40}$/gm)) {
      setCorrectWallet(true);
    } else setCorrectWallet(false);
  }

  async function register() {
    isSubmitting(true);
    try {
      if (correctMail && correctWallet) {
        setShowWarnings(false);
        console.log(referral);
        const res = await addToRegistery(email, referral, wallet);
        if (res.success === true) {
          setEmail("");
          setWallet("");
          setReferral("");
          setShowApiErrors(false);
          setRegSuccess(true);
          setRegReferral(res.newReferral);
          console.log("REGISTER: SUCCESS");
        } else {
          setShowApiErrors(true);
          setApiErrors(res.message);
          console.error("REGISTER: FAILED");
        }
      } else {
        setShowApiErrors(false);
        setShowWarnings(true);
        console.error("REGISTER: FAILED");
      }
    } catch (err) {
      console.error(err);
    }
    isSubmitting(false);
  }

  return (
    <div className="flex justify-center items-center">
      <div className="basis-11/12 md:basis-3/4 lg:basis-1/2">
        <Fade show={renderFrom}>
          <form className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
            <h1 className="mb-12 mt-6 text-xl font-bold text-tock-green">
              JOIN TOCKABLE WAITLIST
            </h1>
            <div className="mb-10">
              <label className="block text-tock-blue text-sm font-bold mb-2">
                Email
                {/* <span className="text-tock-red"> *</span> */}
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
                EVM-wallet address
                {/* <span className="text-tock-red"> *</span> */}
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

            {/* <div className="mb-8">
              <label className="block text-white text-sm font-bold mb-2">
                Referral Code
              </label>
              <input
                className="appearance-none border border-gray-300 rounded-xl w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={referral}
                id="referral"
                type="text"
                // disabled={false}
                placeholder="You can leave it empty if you haven't any"
                onChange={onChangeReferral}
              />
            </div> */}

            <button
              className="transition ease-in-out mr-4 hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
              type="button"
              disabled={submitting}
              onClick={() => {
                register();
              }}
            >
              Join Waitlist!
            </button>

            <div className="inline-block">
              <span className="inline-block align-baseline text-sm text-tock-blue mr-2 mt-4">
                Already joined?
              </span>
              <Link
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="./status"
              >
                Check your status
              </Link>
            </div>
            {/* </div> */}
            {showWarnings && (
              <div className="mt-6 text-sm">
                {(!correctMail || !correctReferral || !correctWallet) && (
                  <div className="border border-tock-red rounded-2xl p-4 mb-4">
                    {!correctMail && (
                      <p className="text-tock-red">
                        - Email address seems not correct.
                      </p>
                    )}
                    {!correctWallet && (
                      <p className="text-tock-red">
                        - It seems wallet address does not have the correct
                        format.
                      </p>
                    )}
                    {!correctReferral && (
                      <p className="text-tock-red">
                        - Not sure about referral code? You can leave it empty.
                      </p>
                    )}
                  </div>
                )}
                {(correctMail || correctReferral || correctWallet) && (
                  <div className="border border-tock-green rounded-2xl opacity-80 p-4">
                    {correctMail && (
                      <p className="text-tock-green">
                        - Email address format: OK
                      </p>
                    )}
                    {correctReferral && (
                      <p className="text-tock-green">
                        - Referral code format: OK
                      </p>
                    )}
                    {correctWallet && (
                      <p className="text-green-600">
                        - Wallet address format: OK
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            {showApiErrors && apiErrors.length > 0 && (
              <div className="mt-6 text-sm">
                {apiErrors.map((err, i) => {
                  return (
                    <div className="border border-tock-red rounded-2xl p-4 mb-4 opacity:80">
                      <p className="text-tock-red" id={i}>
                        {err}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </form>
        </Fade>
        <Fade show={renderResult}>
          <div className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
            <h1 className="mb-2 text-xl font-bold text-tock-green">
              Thank you for Joining us!
            </h1>
            <p className="mb-12 text-zinc-200 text-sm">
              You can use your invitation link to invite your friends. We'll
              make sure your invitations count٬
            </p>
            <div className="pb-12">
              <p className="pb-2 font-bold text-zinc-200">
                Your invitation link
              </p>
              <p className="border-2 border-zinc-600 rounded-2xl text-gray-200 p-2 bg-zinc-700 text-sm">
                {BASEURL}/?ref=
                {regReferral}
              </p>
            </div>
            <CopyToClipboard
              text={BASEURL + "/?ref=" + regReferral}
              onCopy={() => setCopied(true)}
            >
              <button className="transition ease-in-out hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white">
                {copied ? "Link Copied" : "Copy Link"}
              </button>
            </CopyToClipboard>
          </div>
        </Fade>
        <p className="text-center text-gray-500 text-xs">
          &copy;2023 Tockable. All rights reserved.
        </p>
      </div>
    </div>
  );
}
