import { useState } from "react";
import Modal from "@/components/design/modals/modal";
import LabeledInput from "@/components/design/labeled-input/labeled-input";
import Button from "@/components/design/button/button";

export default function NewMetadataModal({ isOpen, onClose, onSubmit }) {
  const [layerName, setLayerName] = useState("");
  const [layerNameError, setLayerNameError] = useState(false);

  function onChangeLayerName(e) {
    setLayerName(e.target.value);
    if (e.target.value.length > 32) setLayerNameError(true);
    else {
      if (layerNameError) setLayerNameError(false);
    }
  }

  async function handleCreateNewLayer() {
    if (layerName.length == 0) return;
    setLayerName("");
    onSubmit(layerName);
  }
  function noSubmit(e) {
    e.key === "Enter" && e.preventDefault();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="flex basis-3/4 px-4" onKeyDown={noSubmit}>
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            add a new layer
          </h1>
          <p className="text-zinc-300 text-sm mb-8">Choose a name for layer</p>
          <div className="mb-6">
            <LabeledInput
              id="layer-name"
              value={layerName}
              type="text"
              placeholder="background"
              onChange={onChangeLayerName}
              required={true}
            >
              layer name{" "}
              <span className="text-sm font-normal text-zinc-400">
                (required)
              </span>
            </LabeledInput>
            <Button
              variant="primary"
              type="button"
              disabled={layerName.length == 0 || layerName.length > 32}
              onClick={handleCreateNewLayer}
            >
              + add layer
            </Button>
            {layerNameError && (
              <p className="text-tock-red text-sm mt-2">
                Layer names must be less than 32 charcters.
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
