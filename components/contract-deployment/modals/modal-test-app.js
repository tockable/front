import { useState, useEffect } from "react";
import { imageUrlFromBlob } from "@/utils/image-utils";
import Modal from "@/components/design/modals/modal";
import ClipLoader from "react-spinners/ClipLoader";

export default function TestAppModal({ onClose, layersFiles }) {
  const [loaded, setLoaded] = useState(false);
  const [built, setBuilt] = useState(false);
  const [builtLayersUrl, setBuiltLayersUrl] = useState({});
  const [savedlayersFiles, setSavedLayerFiles] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [resources, setResources] = useState({});
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [drawing, setDrawing] = useState({});
  const [building, setBuilding] = useState(false);
  let loadedCount = 0;
  function resetModal() {
    if (loaded) setLoaded(false);
    if (built) setBuilt(false);
    if (totalCount > 0) setTotalCount(0);
    if (loadedCount > 0) loadedCount = 0;
    if (resources !== null) setResources(null);
  }

  useEffect(() => {
    let len = 0;
    for (let layer in layersFiles) {
      len = len + layersFiles[layer].length;
    }
    setTotalCount(len);
    setSavedLayerFiles(layersFiles);
  }, []);

  function handleClose() {
    resetModal();
    onClose();
  }

  useEffect(() => {
    if (!built) return;
    redraw();
  }, [drawing]);

  useEffect(() => {
    if (!loaded) return;
    let _canvas = document.getElementById("test-app-canvas");
    setCanvas(_canvas);
    let ctx = _canvas.getContext("2d");
    setCtx(ctx);
    let newDrawing = {};
    for (let layer in resources) {
      newDrawing[layer] = 0;
    }
    setDrawing(newDrawing);
    setBuilt(true);
  }, [loaded]);

  function drawImage(layer) {
    if (!built) return;
    const selectedLayer = resources[layer];
    ctx.drawImage(selectedLayer[drawing[layer]], 0, 0, 200, 200);
  }

  function nextImg(layer) {
    const selectedLayer = resources[layer];
    if (drawing[layer] + 1 < selectedLayer.length) {
      let newDrawing = { ...drawing };
      newDrawing[layer] = drawing[layer] + 1;
      setDrawing(newDrawing);
    }
  }

  function prevImg(layer) {
    if (drawing[layer] - 1 >= 0) {
      let newDrawing = { ...drawing };
      newDrawing[layer] = drawing[layer] - 1;
      setDrawing(newDrawing);
    }
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let layer in drawing) {
      drawImage(layer);
    }
  }

  async function build() {
    setBuilding(true);
    const res = await buildLayers();
    if (res.success === true) {
      let assets = {};
      for (let layer in builtLayersUrl) {
        let filesArray = builtLayersUrl[layer];
        let images = [];
        for (let i = 0; i < filesArray.length; i++) {
          let img = new Image();
          img.onload = imageLoaded;
          img.src = filesArray[i];
          images.push(img);
        }
        assets[layer] = images;
      }
      setResources(assets);
    }
  }

  function imageLoaded(e) {
    loadedCount = loadedCount + 1;

    if (loadedCount == totalCount) {
      setLoaded(true);
    }
  }

  async function buildLayers() {
    let tempBuiltLayersUrl = builtLayersUrl;
    for (let layer in savedlayersFiles) {
      const tempLayer = [];
      for (let file of savedlayersFiles[layer]) {
        const builtImageUrl = imageUrlFromBlob(file);
        tempLayer.push(builtImageUrl);
      }
      if (!tempBuiltLayersUrl.hasOwnProperty(layer)) {
        tempBuiltLayersUrl[layer] = tempLayer;
      }
    }
    setBuiltLayersUrl(tempBuiltLayersUrl);
    return { success: true };
  }

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6">
            build and test your app
          </h1>

          {!loaded && (
            <div>
              <button
                className="mb-6 transition ease-in-out mr-4 hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                type="button"
                disabled={building}
                onClick={() => build()}
              >
                <div className="w-14">
                  {building && (
                    <ClipLoader
                      color="#ffffff"
                      loading={building}
                      size={10}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  )}
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
                <div className="mb-6 mt-2">
                  {Object.keys(drawing).map((layer) => {
                    return (
                      <div className="mb-4 flex flex-col sm:grid sm:grid-cols-2 items-center justify-center">
                        <p className="text-sm text-zinc-400 text-start">
                          {layer}:
                        </p>
                        <div className="flex justify-center select-none">
                          <button
                            className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                            onClick={() => prevImg(layer)}
                          >
                            &lt;
                          </button>

                          <button
                            className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                            onClick={() => nextImg(layer)}
                          >
                            &gt;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
