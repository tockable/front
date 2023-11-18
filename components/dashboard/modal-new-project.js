import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { DROP_TYPES } from "@/constants/dropTypes";
import getChainData from "@/utils/chain-utils";
import { createNewProject } from "@/actions/launchpad/dashboard";
import Loading from "../loading/loading";
import Modal from "../design/modals/modal";
import Button from "../design/button/button";

export default function NewProjectModal({ isOpen, onClose }) {
  // Contexts & Hooks
  const router = useRouter();
  const { address } = useAccount();

  // States
  const [name, setName] = useState("");
  const [chainId, setChainId] = useState("420");
  const [dropType, setDropType] = useState(DROP_TYPES[0].type);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(false);

  function onChangeName(e) {
    setName(e.target.value);
  }

  function onChangeChain(e) {
    setChainId(e.target.value);
  }

  async function handleCreateNewProject() {
    if (name.length == 0) return;
    setCreating(true);
    setError(false);
    const chainData = getChainData(Number(chainId));
    const project = {
      name: name,
      chainId: chainId,
      chain: chainData.name,
      dropType: dropType,
    };
    const res = await createNewProject(address, project);
    if (res.success === true) {
      const launchpadSlug = res.uuid;
      router.push(`/launchpad/${launchpadSlug}`);
    } else {
      setError(true);
      setCreating(false);
    }
  }

  function noSubmit(e) {
    e.key === "Enter" && e.preventDefault();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onKeyDown={noSubmit} className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6">
            create project
          </h1>

          <div className="mb-10">
            <h2 className="text-sm text-zinc-400 mb-4 mt-6">
              choose your drop
            </h2>
            {DROP_TYPES.map((drop, i) => {
              return (
                <div key={"drop_" + i} className="my-2">
                  <button
                    type="button"
                    className={`rounded-2xl w-full border-2 ${
                      drop.type === dropType
                        ? "border-tock-green bg-zinc-800"
                        : "duration-200 ease-in-out border-zinc-600  hover:bg-zinc-700 hover:border-zinc-400"
                    }`}
                    onClick={() => setDropType(drop.type)}
                  >
                    <div className="p-4">
                      <h1 className="text-tock-blue text-start mb-2">
                        {drop.title}
                      </h1>
                      <p className="text-sm text-start text-zinc-400">
                        {drop.description}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mb-10">
            <label className="block text-tock-blue text-sm font-bold mb-2">
              project name{" "}
              <span className="text-sm font-normal text-zinc-400">
                (required)
              </span>
            </label>
            <input
              className="text-sm appearance-none bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
              id="project-name"
              type="text"
              placeholder="Cool NFT"
              onChange={(e) => onChangeName(e)}
              required
            />
            <label className="mt-6 block text-tock-blue text-sm font-bold mb-2">
              chain
            </label>
            <select
              className="text-sm mb-8 bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
              id="digestType"
              name="digestType"
              onChange={onChangeChain}
              required
            >
              {/* <option value="1">Ethereum</option>*/}
              <option value="10">Optimism</option>
              <option value="420">Optimism goerli</option>
              <option value="137">Polygon</option>
              <option value="80001">Polygon mumbai</option>
              {/* <option value="8453">Base</option> */}
              {/* <option value="7777777">Zora</option> */}
              <option value="84531">Base goerli</option>
              {/* <option value="42161">Arbitrum One</option> */}
            </select>
            <Button
              variant="primary"
              type="button"
              disabled={name.length == 0 || creating}
              onClick={() => {
                handleCreateNewProject();
              }}
            >
              {creating && <Loading isLoading={creating} size={10} />}
              {!creating && <p>+ Create</p>}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
