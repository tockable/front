import { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import { MAX_LAYERS } from "@/tock.config";
import { projectImageFileTypes } from "@/constants/constants";
import NewMetadataModal from "./modals/modal-new-metadata";
import TestAppModal from "./modals/modal-test-app";
import RemoveLayerModal from "./modals/modal-warning";
import RenameModal from "./modals/modal-rename";
import Button from "../design/button/button";

export default function ProjectMetadataFrom() {
  const [layers, setLayers] = useState([]);
  const [layersFiles, setLayerFiles] = useState([]);
  const [layerToDelete, setLayerToDelete] = useState(null);
  const [layerToRename, setLayerToRename] = useState(null);
  const [key, setKey] = useState(0);

  //Error
  const [emptyLayerError, setEmptyLayerError] = useState(false);
  // Modals
  const [newMetadataModalShow, setNewMetadataModelShow] = useState(false);
  const [testAppModalShow, setTestAppModalShow] = useState(false);
  const [showRemoveLayerModal, setShowRemoveLayerModal] = useState(false);
  const [renameModalShow, setRenameModalShow] = useState(false);

  function noSubmit(e) {
    e.preventDefault();
  }

  function handleLayerFileUpload(_files, _layer) {
    let layerTemp = layersFiles;
    const index = layers.indexOf(_layer);
    layerTemp[index] = _files;
    setLayerFiles(layerTemp);
    setKey(key + 1);
  }

  function handleCloseNewMetadaModal() {
    setNewMetadataModelShow(false);
  }

  function hanldeOpenTestAppModal() {
    const emptylayer = layersFiles.find((layer) => layer.length === 0);
    if (emptylayer) {
      setEmptyLayerError(true);
      return;
    }
    if (!emptyLayerError) setEmptyLayerError(false);
    setTestAppModalShow(true);
  }
  function handleSumbitNewLayer(_newLayer) {
    if (layers.length + 1 <= MAX_LAYERS) {
      setLayers([...layers, _newLayer]);
      setLayerFiles([...layersFiles, []]);
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
    const index = layers.indexOf(layerToDelete);

    const newLayers = [...layers];
    newLayers.splice(index, 1);
    setLayers(newLayers);

    const newLayersFiles = [...layersFiles];
    newLayersFiles.splice(index, 1);
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
    handleCloseRenameModal();
  }

  function handleClearLayerFiles(_layer) {
    const index = layers.indexOf(_layer);
    if (index !== -1) {
      const tempLayerFiles = layersFiles;
      tempLayerFiles[index] = [];
      setLayerFiles(tempLayerFiles);
    }
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
            layers={layers}
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
        <p className="text-sm text-zinc-400 mb-4">
          Create one layer per desinged trait, then drag & drop the image files
          related to each layer on the related box at once.{" "}
          <a className="font-bold text-sm text-blue-400 hover:text-blue-300 hover:cursor-pointer">
            learn with examples in our guide page.
          </a>
        </p>
        <p className="text-sm text-zinc-400 mb-10">
          choose proper and meaningful names for backgrounds and your files.
          These namse will be used to construct token metadata.
        </p>
        <div key={key}>
          {layers.map((layer, i) => (
            <div key={"layer_" + i}>
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
              {layersFiles[i].length > 0 && (
                <div className="mb-10">
                  <span
                    key={"layer_loadded_" + i}
                    className="text-xs text-zinc-400"
                  >
                    {layersFiles[i].length}{" "}
                    {layersFiles[i].length > 1 ? "images" : "image"} added
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
              {layersFiles[i].length == 0 && (
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
          variant="secondary"
          className="xs:mt-2"
          type="button"
          onClick={hanldeOpenTestAppModal}
          disabled={layersFiles.length == 0}
        >
          test app
        </Button>
        {emptyLayerError && (
          <p className="text-tock-red text-sm">
            please delete layers with no image
          </p>
        )}
      </form>
    </div>
  );
}
