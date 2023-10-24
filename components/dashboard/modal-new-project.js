import { useState } from "react";
import { useRouter } from "next/navigation";
import { DROP_TYPES } from "@/constants/dropTypes";
import { createNewProject } from "@/api/projects/projects";
import { useNetwork } from "wagmi";
import Modal from "../design/modals/modal";

export default function NewProjectModal({ isOpen, onClose, verifiedAddress }) {
  const { chains } = useNetwork();
  const router = useRouter();
  const [name, setName] = useState("");
  const [chainId, setChainId] = useState("");
  const [dropType, setDropType] = useState(DROP_TYPES[1].type);

  function onChangeName(e) {
    setName(e.target.value);
  }

  function onChangeChain(e) {
    setChainId(e.target.value);
  }

  async function handleCreateNewProject(_verifiedAddress, _project) {
    if (_project.name.length == 0) return;

    const chain = chains.find((chain) => chain.id == _project.chainId);
    const project = {
      name: _project.name,
      chainId: _project.chainId,
      chain: chain.name,
      dropType: _project.dropType,
    };
    const res = await createNewProject(_verifiedAddress, project);
    if (res.success === true) {
      const launchpadSlug = res.uuid;
      router.push(`/launchpad/${launchpadSlug}`);
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
            Create project
          </h1>

          <div className="mb-10">
            <h2 className="text-sm text-zinc-400 mb-4 mt-6">
              Choose your drop
            </h2>
            {DROP_TYPES.map((drop) => {
              return (
                <div className="my-2">
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
              <option value="1">Ethereum</option>
              <option value="10">Optimism</option>
              <option value="420">Optimism goerli</option>
              <option value="137">Polygon</option>
              <option value="80001">Polygon mumbai</option>
              <option value="8453">Base</option>
              {/* <option value="7777777">Zora</option> */}
              <option value="84531">Base goerli</option>
              {/* <option value="42161">Arbitrum One</option> */}
            </select>
            <button
              className="transition ease-in-out mr-4 hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
              type="button"
              disabled={name.length == 0}
              onClick={() =>
                handleCreateNewProject(verifiedAddress, {
                  name,
                  chainId,
                  dropType,
                })
              }
            >
              + Create
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
