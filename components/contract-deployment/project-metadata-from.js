import { useState, useEffect } from "react";
import { MAX_LAYERS } from "@/tock.config";

import { FileUploader } from "react-drag-drop-files";
import { projectImageFileTypes } from "@/constants/constants";
import NewMetadataModal from "./modals/modal-new-metadata";
import TestAppModal from "./modals/modal-test-app";
import RemoveLayerModal from "./modals/modal-warning";
import RenameModal from "./modals/modal-rename";
import ClipLoader from "react-spinners/ClipLoader";
import Button from "../design/button/button";

export default function ProjectMetadataFrom() {
  const [layers, setLayers] = useState([]);
  const [layersFiles, setLayerFiles] = useState({});
  const [layerToDelete, setLayerToDelete] = useState(null);
  const [layerToRename, setLayerToRename] = useState(null);
  const [key, setKey] = useState(0);

  // Modals
  const [newMetadataModalShow, setNewMetadataModelShow] = useState(false);
  const [testAppModalShow, setTestAppModalShow] = useState(false);
  const [showRemoveLayerModal, setShowRemoveLayerModal] = useState(false);
  const [renameModalShow, setRenameModalShow] = useState(false);

  function noSubmit(e) {
    e.preventDefault();
  }

  function handleLayerFileUpload(_file, _layer) {
    let layerTemp = layersFiles;
    layerTemp[_layer] = _file;
    setLayerFiles(layerTemp);
    setKey(key + 1);
  }

  function handleCloseNewMetadaModal() {
    setNewMetadataModelShow(false);
  }

  function handleSumbitNewLayer(_newLayer) {
    if (layers.length + 1 <= MAX_LAYERS) {
      setLayers([...layers, _newLayer]);
    }
    setNewMetadataModelShow(false);
  }

  function handleCloseTestAppModal() {
    setTestAppModalShow(false);
  }

  // Handle remove layer modal
  useEffect(() => {
    if (!layerToDelete) return;
    setShowRemoveLayerModal(true);
  }, [layerToDelete]);

  function handleRemoveLayer() {
    const newLayers = [...layers];
    const index = newLayers.indexOf(layerToDelete);
    newLayers.splice(index, 1);
    setLayers(newLayers);

    const newLayersFiles = { ...layersFiles };
    if (newLayersFiles.hasOwnProperty(layerToDelete)) {
      delete newLayersFiles[layerToDelete];
    }

    setLayerFiles(newLayersFiles);
    handleCloseRemoveLayerModal();
  }

  function handleCloseRemoveLayerModal() {
    setLayerToDelete(null);
    setShowRemoveLayerModal(false);
  }

  // Handle rename layer modal
  useEffect(() => {
    if (!layerToRename) return;
    setRenameModalShow(true);
  }, [layerToRename]);

  function handleCloseRenameModal() {
    setLayerToRename(null);
    setRenameModalShow(false);
  }

  function handleRenameLayer(_newName) {
    const newLayers = [...layers];
    const index = layers.indexOf(layerToRename);
    if (index !== -1) {
      newLayers[index] = _newName;
      setLayers(newLayers);
    }
    const newLayersFiles = {};
    Object.keys(layersFiles).forEach((key) => {
      const value = layersFiles[key];
      if (key === layerToRename) {
        newLayersFiles[_newName] = value;
      } else {
        newLayersFiles[key] = value;
      }
    });
    setLayerFiles(newLayersFiles);
    handleCloseRenameModal();
  }

  function handleClearLayerFiles(_layer) {
    let layerTemp = layersFiles;
    layerTemp[_layer] = [];
    setLayerFiles(layerTemp);
    setKey(key + 1);
  }

  return (
    <div>
      <div id="modals">
        <NewMetadataModal
          isOpen={newMetadataModalShow}
          onClose={handleCloseNewMetadaModal}
          onSubmit={handleSumbitNewLayer}
        />
        {testAppModalShow && (
          <TestAppModal
            onClose={handleCloseTestAppModal}
            layersFiles={layersFiles}
          />
        )}
        {showRemoveLayerModal && (
          <RemoveLayerModal
            layerName={layerToDelete}
            onClose={handleCloseRemoveLayerModal}
            onSubmit={handleRemoveLayer}
          />
        )}

        {renameModalShow && (
          <RenameModal
            oldName={layerToRename}
            onClose={handleCloseRenameModal}
            onSubmit={handleRenameLayer}
          />
        )}
      </div>

      <form onSubmit={noSubmit}>
        <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
          add tockable metadata
        </h1>
        <p className="text-sm text-zinc-400 mb-10">
          Create one layer per desinged trait, then drag & drop the image files
          related to each layer on the related box at once.{" "}
          <a className="font-bold text-sm text-blue-400 hover:text-blue-300 hover:cursor-pointer">
            learn with examples in our guide page.
          </a>
        </p>
        <div key={key}>
          {layers.map((layer, i) => (
            <div>
              <div className="flex flex-row">
                <label className="block text-tock-orange text-sm font-bold mb-2">
                  <span className="text-zinc-400">{i}: </span> {layer}
                </label>

                <div className="flex grow justify-end">
                  <button
                    type="button"
                    onClick={() => setLayerToRename(layer)}
                    className="mb-2 transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-blue-400"
                  >
                    rename
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayerToDelete(layer)}
                    className="mb-2 mx-2 transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
                  >
                    remove layer
                  </button>
                </div>
              </div>
              {layersFiles.hasOwnProperty(layer) &&
                layersFiles[layer]?.length > 0 && (
                  <div className="mb-10">
                    <span
                      key={"layer_loadded_" + i}
                      className="text-xs text-zinc-400"
                    >
                      {layersFiles[layer].length}{" "}
                      {layersFiles[layer].length > 1 ? "images" : "image"} added
                      successfully.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleClearLayerFiles(layer)}
                      className="ml-2 transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
                    >
                      Clear images
                    </button>
                  </div>
                )}
              {(layersFiles[layer]?.length == 0 ||
                !layersFiles.hasOwnProperty(layer)) && (
                <div className="mb-10">
                  <FileUploader
                    handleChange={(file) => handleLayerFileUpload(file, layer)}
                    name="file"
                    maxSize={2}
                    //   onSizeError={() => setCoverSizeError(true)}
                    //   onTypeError={() => setCoverTypeError(true)}
                    types={projectImageFileTypes}
                    hoverTitle="Drop"
                    multiple
                    children={
                      <div className="border border-dashed border-zinc-200 rounded-xl text-sm text-zinc-500 h-24 text-center pt-8">
                        <span className="mt-2">drop files here</span>
                      </div>
                    }
                    dropMessageStyle={{
                      backgroundColor: "grey",
                      color: "white",
                      border: "1px dashed white",
                      borderRadius: "12px",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border rounded-xl border-dashed border-zinc-500 flex justify-center p-4 mb-6">
          <Button
            variant="primary"
            type="button"
            onClick={() => setNewMetadataModelShow(true)}
          >
            + add layer
          </Button>
        </div>
        <Button
          variant="primary"
          type="button"
          onClick={() =>
            handleUpdateProjectContract(address, {
              uuid,
              tokenName,
              totalSupply,
              tokenSymbol,
              firstTokenId,
            })
          }
          //   disabled={saving || !updateNeeded()}
        >
          Save
        </Button>
        <Button
          variant="secondary"
          className="xs:mt-2"
          type="button"
          onClick={() => {
            setTestAppModalShow(true);
          }}
          disabled={Object.keys(layersFiles).length == 0}
        >
          test app
        </Button>
      </form>
    </div>
  );
}
