import Modal from "@/components/design/modals/modal";

export default function RemoveLayerModal({ onClose, layerName, onSubmit }) {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-6 ">
        <h1 className="text-tock-red font-bold text-xl mt-4 mb-6 ">Warning</h1>
        <div className="text-zinc-400 text-sm">
          <p>You are trying to delete "{layerName}".</p>{" "}
          <p>This may affect your layers arrangement and it is undoable.</p>
          <p>Do you want to continue?</p>
        </div>

        <div className="flex justify-end">
          <button
            className="my-4 transition ease-in-out mr-4 hover:bg-blue-400 duration-300 bg-blue-500 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
            type="button"
            onClick={onClose}
          >
            no
          </button>
          <button
            className="my-4 transition ease-in-out mr-4 hover:bg-zinc-700 duration-300 text-zinc-500 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline hover:text-tock-red active:text-white"
            type="button"
            onClick={onSubmit}
          >
            yes
          </button>
        </div>
      </div>
    </Modal>
  );
}
