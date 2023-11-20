"use client";

import { useState } from "react";
import IpfsUploader from "./ipfs-uploader";
import IpfsImporter from "./ipfs-importer";
import Modal from "@/components/design/modals/modal";
import { TestApp } from "./test-app";

export default function AppBuilderModal({ onClose, layersFiles, layers }) {
  const [hideApp, setHideApp] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [layerFilesNames, setLayersFilesNames] = useState([]);

  function handleShowUploader() {
    setHideApp(true);
    setShowUploader(true);
    setShowImporter(false);
  }

  function handleShowImporter() {
    setHideApp(true);
    setShowUploader(false);
    setShowImporter(true);
  }

  function handleGetBack() {
    setHideApp(false);
    setShowUploader(false);
    setShowImporter(false);
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          {hideApp && showUploader && (
            <IpfsUploader
              layers={layers}
              layerFilesNames={layerFilesNames}
              layersFiles={layersFiles}
              handleGetBack={handleGetBack}
            />
          )}
          {hideApp && showImporter && (
            <IpfsImporter
              layers={layers}
              layerFilesNames={layerFilesNames}
              handleGetBack={handleGetBack}
            />
          )}

          {!hideApp && (
            <div>
              <h1 className="text-tock-green font-bold text-xl mt-4 mb-6">
                test your app
              </h1>
              <p className="text-zinc-400 text-sm my-2">
                you can check how your app works on mintpad. (in product mode,
                the image resolution will be the same as your original images)
              </p>
              <TestApp
                layersFiles={layersFiles}
                layers={layers}
                setLayersFilesNames={setLayersFilesNames}
              />
              <div>
                <h1 className="text-tock-blue mt-16">
                  choose your deployin method:
                </h1>
                <p className="text-zinc-400 text-xs my-2">
                  if you are happy with your app, use one of following options
                  to deploy traits on contract.
                </p>

                <div>
                  <button
                    onClick={handleShowImporter}
                    className="my-4 rounded-2xl p-4 w-full border-2 duration-200 ease-in-out border-zinc-600 hover:bg-zinc-700 hover:border-zinc-400"
                  >
                    <h1 className="text-tock-blue text-start mb-2">
                      I've uploaded my files and have my cids{" "}
                      <span className="text-tock-green text-xs">
                        (recommended)
                      </span>
                    </h1>
                    <p className="text-xs text-start text-zinc-400">
                      you can use one of ipfs pinning services like Pinata,
                      Infura, Nft Storage or Web3 storage, upload your layer
                      files using upload directory (one directory per each
                      layer), and copy/paste your cids.
                    </p>
                  </button>
                  <button
                    onClick={handleShowUploader}
                    className="mb-4 rounded-2xl p-4 w-full border-2 duration-200 ease-in-out border-zinc-600 hover:bg-zinc-700 hover:border-zinc-400"
                  >
                    <h1 className="text-tock-blue text-start mb-2">
                      I want to upload using tockable{" "}
                      <span className="text-tock-orange text-xs">
                        (not recommended)
                      </span>
                    </h1>
                    <p className="text-xs text-start text-zinc-400">
                      you can let tockable to upload your files to Ipfs.
                      currently, this is an unstable and experimental feature
                      and not recommended, but we are working hard on it.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
