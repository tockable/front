import { useState } from "react";
import Modal from "@/components/design/modals/modal";
import Button from "@/components/design/button/button";
import LabeledInput from "@/components/design/labeled-input/labeled-input";

export default function RenameModal({ onClose, oldName, onSubmit }) {
  const [layerName, setLayerName] = useState(oldName);
  const [layerNameError, setLayerNameError] = useState(false);

  function onChangeLayerName(e) {
    setLayerName(e.target.value);
    if (e.target.value.length > 32) setLayerNameError(true);
    else {
      if (layerNameError) setLayerNameError(false);
    }
  }

  async function handleRenameLayer() {
    if (layerName.length == 0) return;
    setLayerName("");
    onSubmit(layerName);
  }

  function noSubmit(e) {
    e.key === "Enter" && e.preventDefault();
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <form className="flex basis-3/4 px-4" onKeyDown={noSubmit}>
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            rename layer
          </h1>
          <p className="text-zinc-400 text-sm mb-4">
            Choose a new name for layer
          </p>
          <div className="mb-6">
            <LabeledInput
              id="layer-name"
              value={layerName}
              type="text"
              placeholder="background"
              onChange={onChangeLayerName}
              required={true}
            >
              new name
              <span className="text-sm font-normal text-zinc-400">
                (required)
              </span>
            </LabeledInput>

            <Button
              variant="primary"
              type="button"
              disabled={layerName.length == 0 || layerName.length > 32}
              onClick={handleRenameLayer}
            >
              change name
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
