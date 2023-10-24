"use client";
import { useEffect, useState, useContext } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import ClipLoader from "react-spinners/ClipLoader";
import { regex } from "@/constants/regex";
import createFile from "@/api/compile/compile";
import { updateProjectContract } from "@/api/projects/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import Button from "../design/button/button";
import LabeledInput from "../design/labeled-input/labeled-input";

export default function ProjectContractForm() {
  // Contexts
  const { project, setProject } = useContext(LaunchpadContext);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  // Page states
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pleaseFillRequired, setPleaseFillRequied] = useState(false);

  // Form states
  const [tokenName, setTokenName] = useState(project.tokenName);
  const [tokenSymbol, setTokenSymbol] = useState(project.tokenSymbol);
  const [isUnlimited, setIsUnlimited] = useState(project.isUnlimited);
  const [totalSupply, setTotalSupply] = useState(Number(project.totalSupply));
  const [firstTokenId, setFirstTokenId] = useState(
    Number(project.firstTokenId)
  );

  // useEffect(() => {
  //   if (project.isDeployed) {
  //     setContractDeployed(true);
  //   }
  // }, []);

  function updateNeeded() {
    if (
      project.tokenName != tokenName ||
      project.tokenSymbol != tokenSymbol ||
      project.firstTokenId != firstTokenId ||
      project.totalSupply != totalSupply ||
      project.isUnlimited != isUnlimited
    ) {
      return true;
    } else {
      return false;
    }
  }

  async function callUpdateProjectContract() {
    setSaving(true);

    const projectContract = {
      uuid: project.uuid,
      tokenName,
      isUnlimited,
      totalSupply,
      tokenSymbol,
      firstTokenId,
    };

    const res = await updateProjectContract(address, projectContract);
    if (res.success === true) {
      if (failed) setFailed(false);
      if (!success) setSuccess(true);

      setSuccessMessage("Contract info updated successfully.");
      setProject(res.payload);
    } else {
      if (success) setSuccess(false);
      if (!failed) setFailed(true);
      if (res.message === "forbidden") {
        setErrorMessage("Only creator can edit the project");
      } else {
        setErrorMessage("Something wrong in our side, please try again.");
      }
    }
    setSaving(false);
  }

  async function deploy() {
    if (
      tokenName.length == 0 ||
      tokenSymbol.length == 0 ||
      totalSupply.length == 0
    ) {
      if (!pleaseFillRequired) setPleaseFillRequied(true);
      return;
    }

    if (pleaseFillRequired) setPleaseFillRequied(false);
    if (success) setSuccess(false);
    if (failed) setFailed(false);

    setDeploying(true);
    setSaving(true);

    let updated = true;
    let updatedProject = project;

    if (updateNeeded()) {
      updated = false;
      const projectContract = {
        uuid,
        tokenName,
        totalSupply,
        isUnlimited,
        tokenSymbol,
        firstTokenId,
      };
      const res = await updateProjectContract(address, projectContract);
      if (res.success === true) {
        updated = true;
        updatedProject = res.payload;
      } else {
        setFailed(true);
        if (res.message === "forbidden") {
          setErrorMessage("Only creator can edit the project");
        } else {
          setErrorMessage("Something wrong in our side, please try again.");
        }
      }
    }

    if (updated) {
      const res = await createFile(address, updatedProject);
      if (res.success === true) {
        setProject(updatedProject);
        setContractDeployed(true);
      }
    }
    setSaving(false);
    setDeploying(false);
  }

  function onChangeTokenName(e) {
    setTokenName(e.target.value);
  }

  function onChangeTokenSymbol(e) {
    setTokenSymbol(e.target.value);
  }

  function onChangeTotalSupply(e) {
    if (e.target.value.match(regex.number) || e.target.value === "") {
      setTotalSupply(e.target.value);
    }
  }

  // function onChangeFirstTokenId(e) {
  //   setFirstTokenId(e.target.value);
  // }

  function onChangeUnlimited(e) {
    if (e.target.value == "false") {
      setIsUnlimited(false);
    }
    if (e.target.value == "true") {
      setIsUnlimited(true);
    }
  }

  function noSubmit(e) {
    e.key === "Enter" && e.preventDefault();
  }

  return (
    <form onKeyDown={noSubmit}>
      <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
        contract info & deploy
      </h1>
      <LabeledInput
        value={tokenName}
        id="token-name"
        type="text"
        placeholder="Tockable Donkeys"
        onChange={onChangeTokenName}
      >
        Token Name / Collection name
      </LabeledInput>

      <LabeledInput
        value={tokenSymbol}
        id="token-symbol"
        type="text"
        placeholder="TCKBL"
        onChange={onChangeTokenSymbol}
      >
        Token symbol
      </LabeledInput>

      <div className="mb-10">
        <label className="block text-tock-blue text-sm font-bold mb-2">
          Do you want to make your supply unlimited?
          <div>
            <p className="text-zinc-400 text-xs mt-1 mb-2 font-normal">
              With Tockable dynamic drops, you can create collection with an
              unlimited supply (maxSupply = 2^256).
            </p>
          </div>
        </label>
        <div className="flex items-center mb-4">
          <input
            id="unlimited-0"
            type="radio"
            value="false"
            name="isUnlimited"
            className="w-4 h-4 accent-tock-green text-blue-100"
            onChange={onChangeUnlimited}
            checked={!isUnlimited}
          />
          <label
            for="unlimited-0"
            className="ml-2 text-sm text-gray-200 dark:text-gray-300"
          >
            No
          </label>
        </div>
        <div class="flex items-center">
          <input
            id="unlimited-1"
            type="radio"
            value="true"
            name="isUnlimited"
            className="w-4 h-4 accent-tock-green text-blue-100"
            onChange={onChangeUnlimited}
            checked={isUnlimited}
          />
          <label
            for="unlimited-1"
            className="ml-2 text-sm text-gray-200 dark:text-gray-300"
          >
            Yes
          </label>
        </div>
      </div>
      <LabeledInput
        value={!isUnlimited ? totalSupply : ""}
        id="total-suplly"
        type="text"
        placeholder={!isUnlimited ? "9999" : "unlimited"}
        onChange={onChangeTotalSupply}
        required={true}
        disabled={isUnlimited}
      >
        Total supply (required if not unlimited)
      </LabeledInput>

      <div className="mb-10">
        <label
          className={`block ${
            project.dropType.slice(0, 8) !== "tockable"
              ? "text-tock-blue"
              : "text-zinc-600"
          } text-sm font-bold mb-2`}
        >
          {project.dropType.slice(0, 8) === "tockable" && (
            <p className="text-blue-400 text-xs font-normal t-1">
              All Tockable dynamic drops starts with tokenId = 1
            </p>
          )}
          First token Id (0 or 1)
        </label>
        <div className="flex items-center mb-4">
          <input
            id="first-token-id-0"
            type="radio"
            value="0"
            name="first-token-id"
            className="w-4 h-4 accent-tock-green text-blue-100"
            // onChange={onChangeFirstTokenId}
            checked={firstTokenId == 0}
            disabled={project.dropType.slice(0, 8) === "tockable"}
          />
          <label
            for="first-token-id-0"
            className="ml-2 text-sm text-gray-200 dark:text-gray-300"
          >
            0
          </label>
        </div>
        <div class="flex items-center">
          <input
            id="first-token-id-1"
            type="radio"
            value="1"
            name="first-token-id"
            className="w-4 h-4 accent-tock-green text-blue-100"
            // onChange={onChangeFirstTokenId}
            checked={firstTokenId == 1}
            disabled={project.dropType.slice(0, 8) === "tockable"}
          />
          <label
            for="first-token-id-1"
            className="ml-2 text-sm text-gray-200 dark:text-gray-300"
          >
            1
          </label>
        </div>
      </div>
      <p className="text-tock-orange text-sm mb-2">
        IMPORTANT: please note that contract data connat be changed after
        deployment.
      </p>
      <Button
        variant="primary"
        type="button"
        onClick={() => callUpdateProjectContract()}
        disabled={saving || !updateNeeded()}
      >
        Save
      </Button>

      {chain.id != project.chainId && (
        <Button
          className="xs:mt-2"
          variant="warning"
          type="button"
          onClick={() => switchNetwork?.(Number(project.chainId))}
          disabled={isLoading}
        >
          <div>
            {isLoading && pendingChainId === Number(project.chainId) && (
              <ClipLoader
                color="#ffffff"
                loading={
                  isLoading && pendingChainId === Number(project.chainId)
                }
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            )}
            {!isLoading && <div> switch network to {project.chain}</div>}
          </div>
        </Button>
      )}

      {chain.id === Number(project.chainId) && (
        <Button
          className="xs:mt-2"
          variant="secondary"
          type="button"
          onClick={() => deploy()}
          disabled={deploying}
        >
          <div>
            {deploying && (
              <ClipLoader
                color="#ffffff"
                loading={deploying}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            )}
          </div>
          {!deploying && <div> Save & Deploy</div>}
        </Button>
      )}
      {success && !updateNeeded() && (
        <p className="mt-2 text-xs text-tock-green">{successMessage}</p>
      )}
      {failed && <p className="mt-2 text-xs text-tock-red">{errorMessage}</p>}
      {pleaseFillRequired && (
        <p className="mt-2 text-xs text-tock-red">
          Please provide valid information for all fields.
        </p>
      )}
      {error && (
        <p className="text-tock-red text-xs mt-2">
          Switch network failed. please try again, or changing manually using
          one of the following:
          <ul className="mt-2">
            <li>
              <a
                className="text-blue-400 hover:text-blue-300"
                href="https://chainlist.org"
              >
                chainlist.org
              </a>
            </li>
            <li>
              <a
                className="text-blue-400 hover:text-blue-300"
                href="https://chainlist.wtf"
              >
                chainlist.wtf
              </a>
            </li>
          </ul>
        </p>
      )}
    </form>
  );
}
