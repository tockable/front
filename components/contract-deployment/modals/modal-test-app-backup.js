"use client";
import { useState, useEffect, useRef, useContext } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSwitchNetwork,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { imageUrlFromBlob } from "@/utils/image-utils";
import uploadDirectoryToIpfs from "@/actions/ipfs/uploadDirectory";
import { updateProjectMetadata } from "@/actions/launchpad/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import { hexEncode } from "@/utils/crypto-utils";
import LabeledInput from "@/components/design/labeled-input/labeled-input";
import Modal from "@/components/design/modals/modal";
import Loading from "@/components/loading/loading";
import Button from "@/components/design/button/button";

export default function TestAppModal({ onClose, layersFiles, layers }) {
  const { abi, project, callGetContractAbi, setProject } =
    useContext(LaunchpadContext);

  const [loaded, setLoaded] = useState(false);
  const [built, setBuilt] = useState(false);
  const [builtLayers, setBuiltLayers] = useState({});
  const [assets, setAssets] = useState([]);
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [drawing, setDrawing] = useState({});
  const [building, setBuilding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [layerFilesNames, setLayersFilesNames] = useState([]);
  const [last, setLast] = useState(-1);
  const [cids, setCids] = useState([]);
  const [abiNotFetched, setAbiNotFetched] = useState(false);
  const [gettingAbi, setGettingAbi] = useState(false);
  const [uploaded, setUploaded] = useState(0);

  const [hideApp, setHideApp] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showImportSection, setShowImportSection] = useState(false);
  const [errorOnIpfs, setErrorOnIpfs] = useState(false);
  const [successOnIpfs, setSuccessOnIpfs] = useState(false);
  const [traits, setTraits] = useState([]);
  const [readyToDeploy, setReadyToDeploy] = useState(false);

  const totalCount = useRef(0);
  const loadedCount = useRef(0);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "addTraitTypes",
    args: [traits],
    enabled: readyToDeploy,
  });
  const sn = useSwitchNetwork();

  const { chain } = useNetwork();

  const { data, isLoading, isSuccess, isError, write, error } =
    useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  function resetModal() {
    if (loaded) setLoaded(false);
    if (built) setBuilt(false);
    if (totalCount > 0) totalCount.current = 0;
    if (loadedCount.current > 0) loadedCount.current = 0;
    if (assets !== null) setAssets(null);
  }

  async function getAbiAgain() {
    setGettingAbi(true);
    const res = await callGetContractAbi();
    if (res.success === true) {
      setAbiNotFetched(false);
      setReadyToDeploy(true);
    }
    setGettingAbi(false);
  }

  useEffect(() => {
    if (!project) return;
    if (traits.length == 0) return;
    if (abi) setReadyToDeploy(true);
    else {
      callGetContractAbi().then((res) => {
        if (res.success === false) {
          setAbiNotFetched(true);
        } else setReadyToDeploy(true);
      });
    }
  }, [traits]);

  async function deploy() {
    setSuccessOnIpfs(false);
    write?.();
  }

  useEffect(() => {
    if (!uwt.isSuccess) return;

    const sortedCids = [];

    for (let i = 0; i < layers.length; i++) {
      const cid = cids.find((cid) => cid.name === layers[i]);
      sortedCids.push(cid.cid);
    }

    updateProjectMetadata(
      project.uuid,
      project.creator,
      layers,
      layerFilesNames,
      sortedCids
    ).then((res) => {
      if (res.success === true) {
        setSuccessOnIpfs(true);
        setProject(res.payload);
      } else {
        setTraits([]);
        setErrorOnIpfs(true);
      }
    });
  }, [uwt.isSuccess]);

  useEffect(() => {
    if (!isError) {
      setTraits([]);
      setErrorOnIpfs(true);
    }
  }, [isError]);

  async function callUploadDirectoryToIpfs() {
    setUploading(true);

    setHideApp(true);
    setShowUploader(true);
    setErrorOnIpfs(false);

    let uploadNeaded = true;
    let uploadSuccess = true;
    let _cids = cids;
    if (last == layersFiles.length - 1) uploadNeaded = false;

    if (uploadNeaded) {
      for (let i = last + 1; i < layersFiles.length; i++) {
        const files = new FormData();
        for (let j = 0; j < layersFiles[i].length; j++) {
          files.append(`${j}`, layersFiles[i][j]);
        }
        const res = await uploadDirectoryToIpfs(files);
        if (res.success === true) {
          _cids.push({ name: layers[i], cid: res.cid });
          setUploaded(i + 1);
        } else {
          setLast(i - 1);
          setUploading(false);
          setErrorOnIpfs(true);
          setCids(_cids);
          uploadSuccess = false;
          return;
        }
      }
      setCids(_cids);
    }
    if (!uploadSuccess) return;

    const _traits = createTaits(layers);
    setTraits(_traits);
    setUploading(false);
  }

  useEffect(() => {
    let len = 0;
    for (let i in layersFiles) {
      len = len + layersFiles[i].length;
    }
    totalCount.current = len;
  }, []);

  function handleClose() {
    resetModal();
    onClose();
  }

  function handleOpenImportSection() {
    setShowImportSection(true);
  }

  useEffect(() => {
    if (!built) return;
    redraw();
  }, [drawing]);

  useEffect(() => {
    if (!loaded) return;
    if (canvas) return;
    let _canvas = document.getElementById("test-app-canvas");
    setCanvas(_canvas);
    let ctx = _canvas.getContext("2d");
    setCtx(ctx);
    let newDrawing = {};
    for (let layer in assets) newDrawing[layer] = 0;
    setDrawing(newDrawing);
    setBuilt(true);
  }, [loaded]);

  function drawImage(layer) {
    if (!built) return;
    const selectedLayer = assets[layer];
    ctx.drawImage(selectedLayer[drawing[layer]].img, 0, 0, 200, 200);
  }

  function nextImg(layer) {
    const selectedLayer = assets[layer];
    if (drawing[layer] + 1 < selectedLayer.length) {
      const newDrawing = { ...drawing };
      newDrawing[layer] = drawing[layer] + 1;
      setDrawing(newDrawing);
    }
  }

  function IsNextImgNotAvailable(layer) {
    const selectedLayer = assets[layer];
    if (drawing[layer] + 1 < selectedLayer.length) return false;
    else return true;
  }

  function IsPrevImgNotAvailable(layer) {
    if (drawing[layer] - 1 >= 0) return false;
    else return true;
  }

  function prevImg(layer) {
    if (drawing[layer] - 1 >= 0) {
      const newDrawing = { ...drawing };
      newDrawing[layer] = drawing[layer] - 1;
      setDrawing(newDrawing);
    }
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let layer in drawing) drawImage(layer);
  }

  async function build() {
    setBuilding(true);
    const res = await buildLayers();
    if (res.success === true) {
      const _assets = [];
      for (let i in builtLayers) {
        const filesArray = builtLayers[i];
        const images = [];
        for (let j = 0; j < filesArray.length; j++) {
          let img = new Image();
          img.onload = imageLoaded;
          img.src = filesArray[j].url;
          images.push({ img, name: filesArray[j].name });
        }
        _assets[i] = images;
      }
      setAssets(_assets);
    }
  }

  function imageLoaded(_) {
    loadedCount.current = loadedCount.current + 1;
    if (loadedCount.current === totalCount.current) {
      setLoaded(true);
    }
  }

  async function buildLayers() {
    let tempBuiltLayers = builtLayers;
    const _layersFilesNames = [];

    for (let i in layersFiles) {
      const _layerFileNames = [];
      const tempLayer = [];

      for (let file of layersFiles[i]) {
        const url = imageUrlFromBlob(file);
        _layerFileNames.push(file.name);
        tempLayer.push({ url, name: file.name });
      }

      _layersFilesNames.push(_layerFileNames);
      tempBuiltLayers[i] = tempLayer;
    }

    setLayersFilesNames(_layersFilesNames);
    setBuiltLayers(tempBuiltLayers);
    return { success: true };
  }

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <div>
            <h1 className="text-tock-green font-bold text-xl mt-4 mb-6">
              build and test your app
            </h1>
            <p className="text-zinc-400 text-sm my-2">
              build and test the preview of your app before deploy and publish
            </p>
            {hideApp && (
              <div>
                {uploading && (
                  <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
                    <h1 className="text-tock-green font-normal text-lg mb-2">
                      uploading to ipfs...
                    </h1>
                    <p className="text-tock-orange text-xs font-normal mb-6">
                      depending on your files size, it may take 5 to 30 minutes,
                      please do not close this window ...
                    </p>
                    <p className="text-center text-tock-green mb-2 text-xs font-normal">
                      {Math.ceil((uploaded * 100) / layers.length)}%
                    </p>
                    <div className="flex justify-center items-center">
                      <div className="flex justify-center h-12 mb-8 items-center">
                        <Loading isLoading={uploading} size={20} />
                      </div>
                    </div>
                  </div>
                )}
                {errorOnIpfs && (
                  <IpfsStatus
                    layers={layers}
                    cids={cids}
                    last={last}
                    retry={callUploadDirectoryToIpfs}
                  />
                )}
                {abiNotFetched && (
                  <Button
                    onClick={() => {
                      getAbiAgain();
                    }}
                    disabled={isLoading}
                    variant="warning"
                  >
                    {!abi && <p>retry</p>}
                    {abiNotFetched && (
                      <Loading isLoading={gettingAbi} size={10} />
                    )}
                  </Button>
                )}
                {successOnIpfs && (
                  <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
                    <h1 className="text-tock-green font-normal text-lg mb-6">
                      Metadata deployed successully!
                    </h1>
                  </div>
                )}
                {uwt.isLoading && (
                  <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
                    <h1 className="text-tock-green font-normal text-lg mb-2">
                      wait for transaction...
                    </h1>
                    <p className="text-tock-orange text-xs font-normal mb-6">
                      please do not close this window...
                    </p>
                    <div className="flex justify-center items-center">
                      <div className="flex justify-center h-12 mb-8 items-center">
                        <Loading isLoading={uwt.isLoading} size={20} />
                      </div>
                    </div>
                  </div>
                )}
                {readyToDeploy &&
                  !uwt.isSuccess &&
                  !successOnIpfs &&
                  !uwt.isLoading && (
                    <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
                      <h1 className="text-tock-green font-normal text-lg mb-6">
                        sign to deploy
                      </h1>

                      {chain.id != project.chainId && (
                        <Button
                          className="xs:mt-2"
                          variant="warning"
                          type="button"
                          onClick={() =>
                            sn.switchNetwork?.(Number(project.chainId))
                          }
                          disabled={sn.isLoading}
                        >
                          <div>
                            {sn.isLoading &&
                              sn.pendingChainId === Number(project.chainId) && (
                                <Loading
                                  isLoading={
                                    sn.isLoading &&
                                    sn.pendingChainId ===
                                      Number(project.chainId)
                                  }
                                  size={10}
                                />
                              )}
                            {!sn.isLoading && (
                              <div> switch network to {project.chain}</div>
                            )}
                          </div>
                        </Button>
                      )}

                      {isError && (
                        <p className="text-tock-red text-sx mt-2">
                          {error.name}
                        </p>
                      )}
                      {sn.error && (
                        <p className="text-tock-red text-xs mt-2">
                          Switch network failed. please try again, or changing
                          manually using one of the following:
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
                      {chain.id === Number(project.chainId) && (
                        <div className="flex justify-center items-center">
                          <Button
                            onClick={() => {
                              deploy();
                            }}
                            disabled={isLoading || uwt.isLoading}
                            variant="primary"
                          >
                            {!isError &&
                              !isLoading &&
                              !uwt.isLoading &&
                              !uwt.isError && <p>deploy</p>}
                            {isLoading && (
                              <Loading
                                isLoading={isLoading || !uwt.isLoading}
                                size={10}
                              />
                            )}
                          </Button>
                          {isError && (
                            <p className="text-tock-red mt-2 text-sm">
                              {error}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            )}
            {!hideApp && (
              <div>
                {!loaded && (
                  <div className="my-4">
                    <button
                      className="mb-6 transition ease-in-out mr-4 hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                      type="button"
                      disabled={building}
                      onClick={() => build()}
                    >
                      <div className="w-14">
                        {building && <Loading isLoading={building} size={10} />}
                        {!building && <div>build</div>}
                      </div>
                    </button>
                    {building && (
                      <p className="mb-6 text-xs text-blue-400">
                        depends on your images, it may take a while to build...
                      </p>
                    )}
                  </div>
                )}
                {loaded && (
                  <div className="flex flex-col justify-center w-full">
                    <div className=" flex justify-center">
                      <canvas
                        id="test-app-canvas"
                        className="rounded-xl border border-zinc-500 mb-2"
                        width={200}
                        height={200}
                      ></canvas>
                    </div>
                    {built && (
                      <div className="mb-6 mt-2 px-10">
                        {Object.keys(drawing).map((layer, i) => {
                          return (
                            <div
                              key={"drawing_" + i}
                              className="mb-4 flex flex-col sm:grid sm:grid-cols-2 items-center justify-center"
                            >
                              <p className="text-sm text-zinc-400 text-start">
                                <span className="text-tock-orange">
                                  {layers[layer]}:
                                </span>{" "}
                                {assets[layer][drawing[layer]].name.slice(
                                  0,
                                  assets[layer][drawing[layer]].name.length - 4
                                )}
                              </p>
                              <div className="flex justify-center select-none">
                                <button
                                  className="disabled:border-zinc-700 disabled:text-zinc-700 mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 enabled:hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                                  onClick={() => prevImg(layer)}
                                  disabled={IsPrevImgNotAvailable(layer)}
                                >
                                  &lt;
                                </button>

                                <p className="text-zinc-500 text-xs w-12 text-center align-middle mt-4">
                                  {drawing[layer] + 1}/{assets[layer].length}
                                </p>
                                <button
                                  className="disabled:border-zinc-700 disabled:text-zinc-700 mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 enabled:hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                                  onClick={() => nextImg(layer)}
                                  disabled={IsNextImgNotAvailable(layer)}
                                >
                                  &gt;
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        <p className="text-blue-400 text-xs my-2">
                          if you are happy with your app, use one of following
                          options to deploy traits on contract.
                        </p>
                        <p className="text-tock-orange text-xs my-2">
                          PLEASE NOTE THAT THIS ACTION IS IRREVERSIBLE.
                        </p>
                        <div>
                          <div className="rounded-2xl p-4 w-full border-2 duration-200 ease-in-out border-zinc-600 hover:bg-zinc-700 hover:border-zinc-400">
                            <h1 className="text-tock-blue text-start mb-2">
                              I've uploaded my files and have my cids{" "}
                              <span className="text-tock-green">
                                (recommended)
                              </span>
                            </h1>
                            <p className="text-sm text-start text-zinc-400">
                              you can use one of ipfs pinning services like
                              Pinata, Infura, Nft Storage or Web3 storage,
                              uploading your layer files using upload directory
                              (one directory per each layer), and copy/paste
                              your cids.
                            </p>
                            <Button
                              variant="secondary"
                              className="xs:mt-2 mb-4"
                              type="button"
                              oncClick={handleOpenImportSection}
                            >
                              import & deploy
                            </Button>
                          </div>
                          <div className="rounded-2xl p-4 w-full border-2 duration-200 ease-in-out border-zinc-600 hover:bg-zinc-700 hover:border-zinc-400">
                            <h1 className="text-tock-blue text-start mb-2">
                              I want to upload using tockable uploader
                              <span className="text-tock-oragne">
                                (currently not recommended)
                              </span>
                            </h1>
                            <p className="text-sm text-start text-zinc-400">
                              you can let tockable to upload your files to Ipfs.
                              currently, this is an unstable and experimental
                              feature and not recommended, but we are working
                              hard on it.
                            </p>
                            <Button
                              variant="secondary"
                              className="xs:mt-2 mb-4"
                              type="button"
                              onClick={() => callUploadDirectoryToIpfs()}
                              disabled={layersFiles.length == 0 || uploading}
                            >
                              {!uploading && <p>upload & deploy</p>}
                              {uploading && (
                                <Loading isLoading={uploading} size={10} />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function IpfsStatus({ cids, layers, retry, last }) {
  return (
    <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
      <h1 className="text-tock-red font-normal text-lg mt-2 mb-4">
        oops :( we had errors on some directories
      </h1>
      {cids?.length > 0 && (
        <div className=" my-1 text-tock-green text-xs">
          <p className=" my-2">Successful directory uploads:</p>
          {cids.map((cid, i) => {
            return (
              <p key={"cid_" + i} className="my-1 indent-2">
                {cid.name}: {cid.cid}
              </p>
            );
          })}
        </div>
      )}
      <div className=" my-4 text-tock-red text-xs">
        <p className="my-2">failed directory uploads:</p>
        {layers?.map((layer, i) => {
          if (i > last) {
            return (
              <p key={"failed_" + i} className="my-1 indent-2">
                {layer} failed
              </p>
            );
          }
        })}
      </div>
      <div>
        <Button variant="warning" className="mt-4" onClick={() => retry()}>
          retry
        </Button>
      </div>
    </div>
  );
}

function createTaits(_layers) {
  const _traits = [];
  for (let i = 0; i < _layers.length; i++) {
    let bytes = hexEncode(_layers[i]);
    let zeroPaddingLen = 64 - bytes.length;
    for (let i = 0; i < zeroPaddingLen; i++) {
      bytes = bytes + "0";
    }
    const hex = "0x" + bytes;
    _traits.push(hex);
  }
  return _traits;
}

function IpfsInput({ layers }) {
  const [layerIpfsCids, setLayerIpfsCids] = useState({});
  const [traits, setTraits] = useState([]);

  function handleIpfsAdd(_index, _cid) {
    const _layerIpfsCids = layerIpfsCids;
    _layerIpfsCids[_index] = _cid.trim();
    setLayerIpfsCids(_layerIpfsCids);
  }

  async function deploy() {
    const sortedCids = [];
    for (let i = 0; i < layerIpfsCids.length; i++) {
      sortedCids.push(layerIpfsCids[i]);
    }
  }

  return (
    <div>
      <p className="text-zinc-400 text-sm">
        please make sure that you input correct cid for each directory, since
        this action is IRREVERSIBLE after deploying.{" "}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferer"
          className="text-blue-400 hover:text-blue-200"
        >
          learn how do this correctly
        </a>
      </p>
      {layers.map((layer, i) => (
        <div key={"layer_ipfs_" + i}>
          <LabeledInput onChange={handleIpfsAdd(i, e.target.value)}>
            ipfs cid for <span className="text-toc-orange">{layer}</span>
          </LabeledInput>
        </div>
      ))}
      <Button />
    </div>
  );
}
