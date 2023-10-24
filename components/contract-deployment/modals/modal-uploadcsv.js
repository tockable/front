import { useState, useEffect } from "react";
import Papa from "papaparse";
import { FileUploader } from "react-drag-drop-files";
import { TagsInput } from "react-tag-input-component";
import { regex } from "@/constants/regex";
import Modal from "@/components/design/modals/modal";
import Button from "@/components/design/button/button";

export default function UploadCsvModal({ entries, total, onClose, onChange }) {
  const [csvTypeError, setCsvTypeError] = useState(false);
  const [csvFileError, setCsvFileError] = useState(false);
  const [file, setFile] = useState(null);

  function handleFile(file) {
    setCsvTypeError(false);
    setCsvFileError(false);
    setFile(file);
  }

  useEffect(() => {
    if (!file) return;
    async function handleCsv(file) {
      try {
        Papa.parse(file, {
          worker: true,
          complete({ data }) {
            const cleanAddress = [];
            data.flat().forEach((address) => {
              if (address.match(regex.evmAddress)) {
                cleanAddress.push(address);
              }
            });
            onChange(cleanAddress);
          },
        });
        setTotal(total + data.length);
      } catch (err) {
        setCsvFileError(true);
      }
    }
    handleCsv(file);
  }, [file]);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="flex basis-3/4 px-4 pb-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            upload csv
          </h1>
          <div>
            <div className="mb-10">
              <FileUploader
                handleChange={handleFile}
                name="file"
                maxSize={2}
                onTypeError={() => setCsvTypeError(true)}
                types={["csv"]}
                hoverTitle="Drop"
                children={
                  <div className="border border-dashed border-zinc-200 rounded-xl text-sm text-zinc-500 h-24 text-center pt-8">
                    <span className="mt-2">drop .csv file here</span>
                  </div>
                }
                dropMessageStyle={{
                  backgroundColor: "grey",
                  color: "white",
                  border: "1px dashed white",
                  borderRadius: "12px",
                }}
              />
              {csvTypeError && (
                <p className="text-xs text-tock-red mt-1">
                  upload .csv files only
                </p>
              )}
              {csvFileError && (
                <p className="text-xs text-tock-red mt-1">not valid .csv</p>
              )}
            </div>
            <div className="mb-10">
              <p className="text-xs text-zinc-400 mb-1">{total} addresses</p>
              <TagsInput
                value={entries}
                onChange={onChange}
                name="allowedAddressess"
                separators={["Enter", ","]}
                beforeAddValidate={(tag, _) => tag.match(regex.evmAddress)}
                placeHolder="add new 0x..."
              />
              <button
                type="button"
                onClick={() => onChange([])}
                className="transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
              >
                Clear addresses
              </button>
            </div>

            <Button variant="primary" type="button" onClick={onClose}>
              done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
