import { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Navbar from "@/components/design/navbar/nabvar";
import Socialbar from "../design/social-bar/socialbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import getStatus from "@/api/waitlist/status";
import { BASEURL } from "@/tock.config";
import Fade from "@/components/design/fade/fade";

export default function Status() {
  const { address, isConnected } = useAccount();

  const [userStatus, setUserStatus] = useState({
    email: "",
    walletAddress: "",
    referral: "",
    invites: 0,
  });

  const [submitting, isSubmitting] = useState(false);
  const [showApiErrors, setShowApiErrors] = useState(false);
  const [apiErrors, setApiErrors] = useState([]);
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

  async function checkStatus(_address) {
    if (isConnected) {
      isSubmitting(true);
      try {
        const res = await getStatus(_address);
        if (res.success === true) {
          setShowApiErrors(false);
          setRegSuccess(true);
          setUserStatus({
            email: res.userData.email,
            walletAddress: res.userData.walletAddress,
            referral: res.userData.referral,
            invites: res.userData.invites,
          });
          console.log("CHECK-STATUS: SUCCESS");
        } else {
          setShowApiErrors(true);
          setApiErrors([res.message]);
          console.error("CHECK-STATUS: FAILED");
        }
      } catch (err) {
        console.error(err);
      }
      isSubmitting(false);
    }
  }

  return (
    <main className="h-screen bg-tock-dark">
      {/* className="flex w-screen min-h-screen flex-col items-center gap-6 mt-8" */}
      <Navbar />

      <div id="banner" className="h-screen mt-20">
        <div className="relative top-12">
          <div className="mb-10">
        <Socialbar/>
        </div>
          <div className="basis-11/12 md:basis-3/4 lg:basis-1/2">
            <div className="flex justify-center items-center">
              <div className="basis-11/12 md:basis-3/4 lg:basis-1/2">
                <Fade show={renderFrom}>
                  <form className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
                    <h1 className="mb-12 mt-6 text-xl font-bold text-tock-green">
                      CHECK YOUR STATUS
                    </h1>
                    <p className="text-zinc-200 text-sm">
                      By connecting your submitted wallet, you can check your
                      status
                    </p>
                    <div className="flex justify-center mt-12">
                      {" "}
                      <ConnectButton showBalance={false} chainStatus="none" />
                    </div>

                    <div className="flex justify-center mt-12">
                      <button
                        className="transition ease-in-out hover:bg-tock-darkgreen duration-300 bg-tock-green text-black font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:bg-tock-green active:text-white disabled:bg-zinc-500 disabled:text-zinc-400"
                        type="button"
                        disabled={submitting || !isConnected}
                        onClick={() => {
                          checkStatus(address);
                        }}
                      >
                        {isConnected
                          ? "Check status"
                          : "Please connect wallet first"}
                      </button>
                    </div>
                    {showApiErrors && apiErrors.length > 0 && (
                      <div className="mt-6 text-sm">
                        {apiErrors.map((err, i) => {
                          return (
                            <p className="text-red-600" id={i}>
                              {err}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </form>
                </Fade>
                <Fade show={renderResult}>
                  <div className="bg-tock-semiblack text-sm rounded-2xl px-8 pt-6 pb-8 mb-4">
                    <h1 className="mb-2 text-xl font-bold text-tock-green">
                      Waitlist Status
                    </h1>
                    <div className="pb-12 pt-12">
                      <p className="pb-2 text-zinc-400">Points</p>

                      <p className="border-2 border-zinc-600 rounded-2xl text-gray-200 p-2 bg-zinc-700">
                        {userStatus.invites}
                      </p>
                    </div>
                    <div className="pb-12">
                      <p className="pb-2 text-zinc-400">Email</p>{" "}
                      <p className="border-2 border-zinc-600 rounded-2xl text-gray-200 p-2 bg-zinc-700">
                        {userStatus.email}
                      </p>
                    </div>
                    <div className="pb-12">
                      <p className="pb-2 text-zinc-400">Wallet address</p>{" "}
                      <p className="border-2 border-zinc-600 rounded-2xl text-gray-200 p-2 bg-zinc-700">
                        {userStatus.walletAddress}
                      </p>
                    </div>
                    <div className="pb-6">
                      <p className="pb-2 text-zinc-400">Invitation link</p>
                      <p className="border-2 border-zinc-600 rounded-2xl text-gray-200 p-2 bg-zinc-700">
                        {BASEURL}/?ref=
                        {userStatus.referral}
                      </p>
                    </div>
                    <CopyToClipboard
                      text={{ BASEURL } + "/?ref=" + userStatus.referral}
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
          </div>
        </div>
      </div>
    </main>
  );
}
