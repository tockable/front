"use client";
import { useState, useContext, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { regex } from "@/constants/regex";
import { updateProjectContract } from "@/actions/launchpad/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import { createAndCompile } from "@/actions/contract/compile";
// import { getContractAbiAndBytecode } from "@/actions/contract/metadata";
import { getContractBytecode } from "@/actions/contract/metadata";
import DeployContractModal from "./modals/modal-deploy";
import LabeledInput from "../design/labeled-input/labeled-input";
import Loading from "../loading/loading";
import Button from "../design/button/button";

export default function ProjectContractForm() {
  // Contexts
  const { project, setProject, callGetContractAbi } =
    useContext(LaunchpadContext);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  // Page states
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [takeMoment, setTakeMoment] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pleaseFillRequired, setPleaseFillRequied] = useState(false);
  const [nonZeroSupply, setNonZeroSupply] = useState(false);
  const [unlimitedDisabled, setUnlimitedDisabled] = useState(false);
  const [totalSupplyDisabled, setTotalSupplyDisabled] = useState(false);
  const [duplicateVerificationDisable, setDuplicateVerificationDisable] =
    useState(false);
  const [abiReady, setAbiReady] = useState(false);
  const [bytecode, setBytecode] = useState("");
  const [readyToDeploy, setReadyToDeploy] = useState(false);

  // Form states
  const [tokenName, setTokenName] = useState(project.tokenName);
  const [tokenSymbol, setTokenSymbol] = useState(project.tokenSymbol);
  const [isUnlimited, setIsUnlimited] = useState(project.isUnlimited);
  const [totalSupply, setTotalSupply] = useState(Number(project.totalSupply));
  const [duplicateVerification, setDuplicateVerification] = useState(
    project.duplicateVerification
  );
  const [firstTokenId, setFirstTokenId] = useState(
    Number(project.firstTokenId)
  );

  // Deploy
  const [contractCreated, setContarctCreated] = useState(false);
  const [showDeployContractModal, setShowDeployContractModal] = useState(false);

  useEffect(() => {
    if (!contractCreated) return;
    if (!abiReady) {
      setReadyToDeploy(false);
      return;
    }
    callGetContractAbi().then((res) => {
      if (res.success === true) {
        getContractBytecode(project.creator, project.uuid, project.name).then(
          (res) => {
            if (res.success === true) {
              setBytecode(res.bytecode);
              setReadyToDeploy(true);
            } else {
              readyToDeploy(false);
              setAbiReady(false);
              setTakeMoment(false);
              setErrorMessage("an error occured, please try again");
              setDeploying(false);
              setSaving(false);
            }
          }
        );
      } else {
        readyToDeploy(false);
        setAbiReady(false);
        setTakeMoment(false);
        setErrorMessage("an error occured, please try again");
        setDeploying(false);
        setSaving(false);
      }
    });
  }, [abiReady]);

  useEffect(() => {
    if (bytecode.length === 0) return;
    if (!readyToDeploy) return;
    handleShowDeployModalContract();
  }, [readyToDeploy, bytecode]);

  function updateNeeded() {
    if (
      project.tokenName != tokenName ||
      project.tokenSymbol != tokenSymbol ||
      Number(project.firstTokenId) != firstTokenId ||
      Number(project.totalSupply).toString() != totalSupply ||
      Number(project.totalSupply) != totalSupply ||
      project.totalSupply != totalSupply ||
      project.isUnlimited != isUnlimited ||
      project.duplicateVerification != duplicateVerification
    ) {
      return true;
    } else {
      return false;
    }
  }

  async function callUpdateProjectContract() {
    setSuccess(false);
    setFailed(false);
    setPleaseFillRequied(false);
    setNonZeroSupply(false);
    if (tokenName.length == 0 || tokenSymbol.length == 0) {
      if (!pleaseFillRequired) setPleaseFillRequied(true);
      return;
    }
    if (totalSupply === 0 || totalSupply === "0") {
      if (!isUnlimited) {
        if (!nonZeroSupply) setNonZeroSupply(true);
        return;
      }
    }
    setSaving(true);
    const projectContract = {
      uuid: project.uuid,
      tokenName,
      isUnlimited: duplicateVerification ? false : isUnlimited,
      duplicateVerification: isUnlimited ? false : duplicateVerification,
      totalSupply: isUnlimited ? 0 : totalSupply,
      tokenSymbol,
      firstTokenId,
    };

    const res = await updateProjectContract(address, projectContract);

    if (res.success === true) {
      setSuccess(true);
      if (isUnlimited) setTotalSupply("0");
      setSuccessMessage("Contract info updated successfully.");
      setProject(res.payload);
    } else {
      setTakeMoment(false);
      setFailed(true);
      if (res.message === "forbidden") {
        setErrorMessage("Only project creator can edit the project");
      } else {
        setErrorMessage("Something wrong in our side, please try again.");
      }
    }
    setSaving(false);
  }

  async function callSaveAndeploy() {
    if (!updateNeeded() && contractCreated) {
      setAbiReady(true);
      setTakeMoment(true);
      setDeploying(true);
      setSaving(true);
      return;
    }

    setSuccess(false);
    setFailed(false);
    setPleaseFillRequied(false);
    setNonZeroSupply(false);
    if (tokenName.length == 0 || tokenSymbol.length == 0) {
      if (!pleaseFillRequired) setPleaseFillRequied(true);
      return;
    }
    if (totalSupply === 0 || totalSupply === "0") {
      if (!isUnlimited) {
        setNonZeroSupply(true);
        return;
      }
    }

    setTakeMoment(true);
    setDeploying(true);
    setSaving(true);

    let updated = true;
    if (updateNeeded()) {
      updated = false;
      const projectContract = {
        uuid: project.uuid,
        tokenName,
        isUnlimited: duplicateVerification ? false : isUnlimited,
        duplicateVerification: isUnlimited ? false : duplicateVerification,
        totalSupply: isUnlimited ? 0 : totalSupply,
        tokenSymbol,
        firstTokenId,
      };
      const res = await updateProjectContract(address, projectContract);
      if (res.success === true) {
        updated = true;
        setProject(res.payload);
      } else {
        setTakeMoment(false);
        setFailed(true);
        setSaving(false);
        setDeploying(false);
        if (res.message === "forbidden") {
          setErrorMessage("Only creator can edit the project");
        } else {
          setErrorMessage("Something wrong in our side, please try again.");
        }
      }
    }

    if (updated) {
      const res = await createAndCompile(address, project.uuid);
      if (res.success === true) {
        if (isUnlimited) setTotalSupply(0);
        setContarctCreated(true);
        setAbiReady(true);
      } else {
        setTakeMoment(false);
        setFailed(true);
        setErrorMessage("something wrong in our side, please try again");
        setSaving(false);
        setDeploying(false);
      }
    }
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
      setTotalSupplyDisabled(false);
      setDuplicateVerificationDisable(false);
    }
    if (e.target.value == "true") {
      setIsUnlimited(true);
      setTotalSupplyDisabled(true);
      setDuplicateVerificationDisable(true);
      setTotalSupply("0");
    }
  }

  function onChangeDuplicateVerifiction(e) {
    if (e.target.value == "false") {
      setDuplicateVerification(false);
      setUnlimitedDisabled(false);
      if (isUnlimited) setTotalSupplyDisabled(true);
      else setTotalSupplyDisabled(false);
    }
    if (e.target.value == "true") {
      setDuplicateVerification(true);
      setTotalSupplyDisabled(false);
      setUnlimitedDisabled(true);
    }
  }

  function handleShowDeployModalContract() {
    setShowDeployContractModal(true);
  }

  function handleCloseDeployModalContract() {
    setReadyToDeploy(false);
    setAbiReady(false);
    setTakeMoment(false);
    setSaving(false);
    setDeploying(false);
    setShowDeployContractModal(false);
  }

  function noSubmit(e) {
    e.key === "Enter" && e.preventDefault();
  }

  return (
    <form onKeyDown={noSubmit}>
      <div id="modals">
        {showDeployContractModal && (
          <DeployContractModal
            onClose={handleCloseDeployModalContract}
            bytecode={bytecode}
          />
        )}
      </div>
      <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
        contract info & deploy
      </h1>
      <LabeledInput
        value={tokenName}
        id="token-name"
        type="text"
        placeholder="Tockable Donkeys"
        onChange={onChangeTokenName}
        subtitle={
          <p>
            This will be your token name in token metadata: e.g name: Tockable
            Donkeys #23
          </p>
        }
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
        <label
          className={`block ${
            duplicateVerificationDisable ? "text-zinc-600" : "text-tock-blue"
          }  text-sm font-bold mb-2`}
        >
          With dynamic NFTs, there is a chance that minters may create
          duplicates tokens, do you want to prevent this?
          <div>
            <p
              className={`${
                duplicateVerificationDisable ? "text-zinc-600" : "text-zinc-400"
              } text-xs mt-1 mb-2 font-normal`}
            >
              The great thing is that unique-ness verification will be handled
              by the contract and is totally on-chain. However, this will
              disable unlimited-supply collections.
            </p>
          </div>
        </label>
        <div className="flex items-center mb-4">
          <input
            id="duplicate-0"
            type="radio"
            value="false"
            name="duplication"
            className="w-4 h-4 accent-tock-green text-blue-100"
            onChange={onChangeDuplicateVerifiction}
            checked={!duplicateVerification}
            disabled={duplicateVerificationDisable}
          />
          <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
            No
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="duplicate-1"
            type="radio"
            value="true"
            name="duplication"
            className="w-4 h-4 accent-tock-green text-blue-100"
            onChange={onChangeDuplicateVerifiction}
            checked={duplicateVerification}
            disabled={duplicateVerificationDisable}
          />
          <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
            Yes
          </label>
        </div>
      </div>

      <div className="mb-10">
        <label
          className={`block ${
            !duplicateVerification ? "text-tock-blue" : "text-zinc-600"
          } text-sm font-bold mb-2`}
        >
          Do you want to make your supply unlimited?
          <div>
            <p
              className={`${
                duplicateVerification ? "text-zinc-600" : "text-zinc-400 "
              } text-xs mt-1 mb-2 font-normal`}
            >
              With Tockable drops, you can create erc721 collection with an
              unlimited supply (maxsSupply = 2^256).
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
            disabled={unlimitedDisabled}
          />
          <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
            No
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="unlimited-1"
            type="radio"
            value="true"
            name="isUnlimited"
            className="w-4 h-4 accent-tock-green text-blue-100"
            onChange={onChangeUnlimited}
            checked={isUnlimited}
            disabled={unlimitedDisabled}
          />
          <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
            Yes
          </label>
        </div>
      </div>
      <LabeledInput
        value={!isUnlimited ? totalSupply || "" : ""}
        id="total-suplly"
        type="text"
        placeholder={!isUnlimited ? "10000" : "unlimited"}
        onChange={onChangeTotalSupply}
        required={true}
        disabled={totalSupplyDisabled}
      >
        Total supply{" "}
        <span className="text-xs font-normal text-zinc-400">
          (Max: 10000, required if not unlimited)
        </span>
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
          <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
            0
          </label>
        </div>
        <div className="flex items-center">
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
          <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
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
              <Loading
                isLoading={
                  isLoading && pendingChainId === Number(project.chainId)
                }
                size={10}
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
          onClick={() => callSaveAndeploy()}
          disabled={deploying}
        >
          <div>{deploying && <Loading isLoading={deploying} size={10} />}</div>
          {!deploying && <div> Save & Deploy</div>}
        </Button>
      )}
      {success && !updateNeeded() && (
        <p className="mt-2 text-xs text-tock-green">{successMessage}</p>
      )}
      {takeMoment && (
        <p className="mt-2 text-xs text-blue-400">
          creating contract... please wait...
        </p>
      )}
      {nonZeroSupply && (
        <p className="mt-2 text-xs text-tock-red">
          total supply cannot be zero.
        </p>
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
