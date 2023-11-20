import { useEffect, useState, useRef } from "react";

export default function Modal({ isOpen, onClose, children, hasClose = true }) {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef(null);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isModalOpen) modalElement.showModal();
      else modalElement.close();
    }
  }, [isModalOpen]);

  function handleCloseModal() {
    if (onClose) onClose();
    setModalOpen(false);
  }

  return (
    <dialog
      ref={modalRef}
      className="backdrop:opacity-70 backdrop:bg-black relative w-[90%] sm:w-[75%] md:w-[66%] lg:w-[50%] bg-tock-semiblack rounded-xl shadow-lg"
    >
      {hasClose && (
        <button
          className="transition ease-in-out duration-300 text-zinc-500 hover:text-zinc-300 absolute right-2 mt-1"
          onClick={handleCloseModal}
        >
          &#x2715;
        </button>
      )}
      {children}
    </dialog>
  );
}
