"use client";
import { useState, useEffect, useRef } from "react";
import { imageUrlFromBlob } from "@/utils/image-utils";

export function TestApp({
  layers,
  layersFiles,
  setLayersFilesNames,
}) {
  const [built, setBuilt] = useState(false);
  const [builtLayers, setBuiltLayers] = useState({});
  const [assets, setAssets] = useState([]);
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [drawing, setDrawing] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const totalCount = useRef(0);
  const loadedCount = useRef(0);
  const cnv = useRef(null);

  useEffect(() => {
    let len = 0;
    for (let i in layersFiles) len = len + layersFiles[i].length;
    totalCount.current = len;
    build();
  }, []);

  useEffect(() => {
    if (!built) return;
    redraw();
  }, [drawing]);

  useEffect(() => {
    if (!imagesLoaded) return;
    if (canvas) return;
    const _canvas = cnv.current;
    const _ctx = _canvas.getContext("2d");
    const newDrawing = {};

    for (let layer in assets) newDrawing[layer] = 0;

    setCanvas(cnv.current);
    setCtx(_ctx);
    setDrawing(newDrawing);
    setBuilt(true);
  }, [imagesLoaded]);

  function drawImage(layer) {
    if (!built) return;
    const selectedLayer = assets[layer];
    ctx.drawImage(selectedLayer[drawing[layer]].img, 0, 0, 200, 200);
  }

  function nextImg(layer) {
    const selectedLayer = assets[layer];
    if (drawing[layer] + 1 >= selectedLayer.length) return;
    const newDrawing = { ...drawing };
    newDrawing[layer] = drawing[layer] + 1;
    setDrawing(newDrawing);
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
    if (drawing[layer] - 1 < 0) return;
    const newDrawing = { ...drawing };
    newDrawing[layer] = drawing[layer] - 1;
    setDrawing(newDrawing);
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let layer in drawing) drawImage(layer);
  }

  function imageLoaded(_) {
    loadedCount.current = loadedCount.current + 1;
    if (loadedCount.current === totalCount.current) setImagesLoaded(true);
  }

  function build() {
    buildLayers();
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

  function buildLayers() {
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
  }

  return (
    <div classNaFme="flex flex-col justify-center w-full">
      <div className=" flex justify-center mt-12">
        <canvas
          ref={cnv}
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
                  <span className="text-tock-orange">{layers[layer]}:</span>{" "}
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
        </div>
      )}
    </div>
  );
}
