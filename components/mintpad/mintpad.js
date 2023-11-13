"use client";
import { useState, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { getElligibility } from "@/actions/mintpad/mintpad";
import { MintContext } from "@/contexts/mint-context";
import MintpadMintSection from "./mintpad-mint-section";
import MintpadAdminMintSection from "./admin-mintpad-section";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import MintpadDapp from "./mintpad-mintdapp";
import Loading from "../loading/loading";
import Button from "../design/button/button";
import CountDown from "../design/timer/timer";

export default function Mintpad({ project, prepareMint, abiAction }) {
  // Hooks and Contexts
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  // States

  const [paused, setPaused] = useState(false);
  const [mintEnded, setMintEnded] = useState(false);
  const [untilStart, setUntilStart] = useState(0);
  const [untilEnd, setUntilEnd] = useState(0);
  const [notStarted, setNotStarted] = useState(false);
  const [blobState, setBlobState] = useState(0);

  const [blob, setBlob] = useState(null);
  const [roles, setRoles] = useState();
  const [session, setSession] = useState();
  const [elligibility, setElligibility] = useState(null);
  const [abi, setAbi] = useState([]);
  const [publicSession, setPublicSession] = useState();
  const [abiError, setAbiError] = useState(false);
  const [errorGettingElligibility, setErrorGettingElligibility] =
    useState(false);

  // Effects
  useEffect(() => {
    if (!project || !isConnected) return;
    getElligibility(address, project.creator, project.slug).then((res) => {
      if (res.success === true) {
        if (res.notStarted) {
          setNotStarted(true);
          setUntilStart(res.untilStart);
          return;
        }

        if (res.paused) {
          setPaused(true);
          return;
        }

        if (res.mintEnded) {
          setMintEnded(true);
          return;
        }

        if (res.payload.untilEnd <= 0) {
          setMintEnded(true);
          return;
        }

        setElligibility(res.payload?.elligibility);
        setPublicSession(res.payload?.justPublicMint);
        setRoles(res.payload?.availableRoles);
        setSession(Number(res?.payload.activeSession));
        setUntilEnd(res.payload.untilEnd);

        if (
          res.payload?.elligibility &&
          res.payload?.activeSession.toString().length > 0
        ) {
          abiAction(project.creator, project.uuid, project.name).then((res) => {
            if (res.success === true) {
              setAbi(res.abi);
            } else {
              setAbiError(true);
            }
          });
        }
      } else {
        setErrorGettingElligibility(true);
      }
    });
  }, [project, isConnected]);

  function incrementBlobState() {
    setBlobState(blobState + 1);
  }

  return (
    <main>
      {!project && <Loading isLoading={!project} variant="page" size={20} />}
      {project && (
        <MintContext.Provider value={{ project, abi, setAbi, blob, setBlob }}>
          {notStarted && (
            <div className="mb-8">
              <h1 className="text-center text-tock-green p-2 mt-2">
                until mint starts
              </h1>
              <CountDown variant="start" exts={untilStart} />
            </div>
          )}
          {untilEnd > 0 && (
            <div className="mb-8">
              <h1 className="text-center text-blue-400 p-2 mt-2">
                until session ends
              </h1>
              <CountDown variant="end" exts={untilEnd} />
            </div>
          )}
          <div className="flex grow justify-end">
            <ConnectButton />
          </div>

          <div className="rounded-2xl p-4 mt-8 bg-tock-semiblack">
            <MintpadDapp
              blobState={blobState}
              layers={project.layers}
              fileNames={project.fileNames}
              cids={project.cids}
            />

            {paused && (
              <p className="text-tock-orange text-center p-2 border rounded-xl border-zinc-400">
                minting is not available at this moment.
              </p>
            )}
            {address === project.creator && (
              <MintpadAdminMintSection
                incrementBlobState={incrementBlobState}
                prepareMint={prepareMint}
              />
            )}
            {/* {!notStarted && !mintEnded && !paused && (
              <div className="rounded-2xl p-4 mt-8 bg-tock-semiblack">
                under maintenance
              </div>
            )} */}
            {!notStarted && !mintEnded && !paused && (
              <div>
                {!isConnected && (
                  <p className="text-tock-orange text-center p-2 border rounded-xl border-zinc-400">
                    connect wallet to see mint options
                  </p>
                )}
                {errorGettingElligibility && isConnected && (
                  <p className="text-tock-orange p-2 border rounded-xl border-zinc-400 text-centerr">
                    Something went wrong, please refresh the page.
                  </p>
                )}
                {!errorGettingElligibility && isConnected && (
                  <div className="w-full">
                    {!elligibility && (
                      <div className="p-2 border rounded-xl border-zinc-400">
                        <p className="text-tock-orange text-xs text-center">
                          no mint plan available for this wallet at this moment
                        </p>
                      </div>
                    )}
                    {elligibility && (
                      <div>
                        {chain.id != project.chainData.chainId && (
                          <div>
                            <Button
                              className="xs:mt-2 w-64"
                              variant="warning"
                              type="button"
                              onClick={() =>
                                switchNetwork?.(
                                  Number(project.chainData.chainId)
                                )
                              }
                              disabled={isLoading}
                            >
                              <div>
                                {isLoading &&
                                  pendingChainId ===
                                    Number(project.chainData.chainId) && (
                                    <Loading
                                      isLoading={
                                        isLoading &&
                                        pendingChainId ===
                                          Number(project.chainData.chainId)
                                      }
                                      size={10}
                                    />
                                  )}
                                {!isLoading && (
                                  <div>
                                    switch network to {project.chainData.name}
                                  </div>
                                )}
                              </div>
                            </Button>
                            {error && (
                              <p className="text-tock-red text-xs mt-2">
                                Switch network failed. please try again, or
                                changing manually using one of the following:
                                <ul className="mt-2">
                                  <li>
                                    <a
                                      className="text-blue-400 hover:text-blue-300"
                                      href="https://chainlist.org"
                                    >
                                      chainlist.org
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="text-blue-400 hover:text-blue-300"
                                      href="https://chainlist.wtf"
                                    >
                                      chainlist.wtf
                                    </a>
                                  </li>
                                </ul>
                              </p>
                            )}
                          </div>
                        )}

                        {abi.length > 0 && (
                          <div>
                            {chain.id === Number(project.chainData.chainId) && (
                              <div className="w-full">
                                {!publicSession && (
                                  <p className="text-tock-blue">
                                    available roles for you:
                                  </p>
                                )}

                                <MintpadMintSection
                                  incrementBlobState={incrementBlobState}
                                  roles={roles}
                                  session={session}
                                  prepareMint={prepareMint}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {abi.length == 0 && abiError && (
                          <p className="text-tock-orange">
                            Something went wrong, please refresh the page.
                          </p>
                        )}
                      </div>
                    )}
                    {elligibility === false && (
                      <p clasName="text-tock-orange">
                        you are not elligible to mint in this session
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </MintContext.Provider>
      )}
    </main>
  );
}
