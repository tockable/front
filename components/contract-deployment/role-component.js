import { useState, useEffect } from "react";
import { TagsInput } from "react-tag-input-component";
import { regex } from "@/constants/regex";
import LabeledInput from "../design/labeled-input/labeled-input";
import UploadCsvModal from "./modals/modal-uploadcsv";

export default function Role({ role, onChangeRole, onDeleteRole }) {
  const [showUploadCsvModal, setShowUploadCsvModal] = useState(false);
  const [total, setTotal] = useState(role.allowedAddresses.length);

  useEffect(() => {
    setTotal(role.allowedAddresses.length);
  }, [role]);

  function handleShowUploadCsvModal() {
    setShowUploadCsvModal(true);
  }

  function handleCloseUploadCsvModal() {
    setShowUploadCsvModal(false);
  }

  function onChangeQouta(e, role) {
    if (e.target.value.match(regex.number) || e.target.value === "") {
      onChangeRole({ ...role, quota: e.target.value });
    }
  }

  function handleAllowedAddressesChange(allowedAddresses) {
    onChangeRole({ ...role, allowedAddresses });
  }

  return (
    <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
      <div id="modals">
        {showUploadCsvModal && (
          <UploadCsvModal
            total={total}
            entries={role.allowedAddresses}
            onClose={handleCloseUploadCsvModal}
            onChange={handleAllowedAddressesChange}
          />
        )}
      </div>
      <div className="flex flex-row">
        <label className="block text-tock-orange text-sm font-bold mb-2">
          <span className="text-zinc-400">{role.id}: </span> {role.name}
        </label>
        <div className="flex grow justify-end">
          <button
            type="button"
            onClick={() => onDeleteRole(role.id)}
            className="mb-2 mx-2 transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
          >
            remove role
          </button>
        </div>
      </div>
      <LabeledInput
        value={role.name}
        id={`role_name_${role.id}`}
        type="text"
        placeholder="role name"
        onChange={(e) => onChangeRole({ ...role, name: e.target.value })}
        required={true}
      >
        role name{" "}
        <span className="text-xs font-normal text-zinc-400">(required)</span>
      </LabeledInput>

      <LabeledInput
        value={role.quota}
        id={`role_qouta_${role.id}`}
        type="number"
        step="1"
        min="0"
        placeholder="max allowed mint by each wallet"
        onChange={(e) => onChangeQouta(e, role)}
        required={true}
      >
        max allowed mint by each address{" "}
        <span className="text-xs font-normal text-zinc-400">(required)</span>
      </LabeledInput>
      <LabeledInput
        value={role.price}
        id={`role_price_${role.id}`}
        type="number"
        min="0"
        step="0.0001"
        placeholder="0.0005"
        onChange={(e) => onChangeRole({ ...role, price: e.target.value })}
        required={true}
      >
        price for <span className="text-tock-orange">{role.name} </span>
        addresses (ETH){" "}
        <span className="text-xs font-normal text-zinc-400">(required)</span>
      </LabeledInput>

      <div className="mb-8">
        <label className="block text-tock-blue text-sm font-bold mb-2">
          allowed addresses{" "}
          <span className="text-xs text-zinc-400 text-end">
            {total} addresses
          </span>
        </label>

        <TagsInput
          name="allowedAddressess"
          value={role.allowedAddresses}
          onChange={handleAllowedAddressesChange}
          beforeAddValidate={(tag, _) => tag.match(regex.evmAddress)}
          placeHolder="add new 0x..."
          separators={["Enter", ","]}
        />
        <button
          type="button"
          onClick={handleShowUploadCsvModal}
          className="transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-blue-400 mr-2"
        >
          upload CSV
        </button>
        <button
          type="button"
          onClick={() => handleAllowedAddressesChange([])}
          className="transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
        >
          Clear addresses
        </button>
      </div>
    </div>
  );
}
