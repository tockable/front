import { useState, useReducer, useContext, useEffect } from "react";
import { parseEther } from "viem";
import { useNetwork, useSwitchNetwork } from "wagmi";
import DeployRolesModal from "./modals/modal-deploy-roles";
import { LaunchpadContext } from "@/contexts/project-context";
import Role from "./role-component";
import Loading from "../loading/loading";
import LabeledInput from "../design/labeled-input/labeled-input";
import Button from "../design/button/button";

export default function ProjectRolesForm() {
  // Pages states
  const [deploying, setDeploying] = useState(false);
  const [pleaseFillRequired, setPleaseFillRequired] = useState(false);
  const [abiError, setAbiError] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [rolesArg, setRoleArg] = useState([
    { id: 0, price: 0, maxAllowedMint: 0 },
  ]);
  const [roles, dispatch] = useReducer(roleReducer, []);
  // Contexts and hooks
  const { project, setProject, abi, callGetContractAbi } =
    useContext(LaunchpadContext);
  const { chain } = useNetwork();

  function handleCloseDeployModal() {
    setShowDeployModal(false);
  }

  const sn = useSwitchNetwork();

  useEffect(() => {
    if (!project) return;
    if (!abi) {
      callGetContractAbi().then((res) => {
        if (res.success === false) {
          setAbiError(true);
        }
      });
    }
  }, [project]);

  useEffect(() => {
    if (
      rolesArg.length == 1 &&
      rolesArg[0].id == 0 &&
      rolesArg[0].price == 0 &&
      rolesArg[0].maxAllowedMint == 0
    )
      return;
    setDeploying(false);
    setShowDeployModal(true);
  }, [rolesArg]);

  useEffect(() => {
    if (project.roles.length > 0) {
      dispatch({ type: "load", roles: project.roles });
    } else {
      dispatch({ type: "init" });
    }
  }, []);

  function handleEditRole(role) {
    dispatch({ type: "edit", role });
  }

  function handleDeleteRole(id) {
    dispatch({ type: "delete", id });
  }

  async function deploy() {
    let valid = true;
    roles.forEach((role) => {
      if (
        role.name.length == 0 ||
        role.quota.length == 0 ||
        role.price.length == 0
      ) {
        setPleaseFillRequired(true);
        valid = false;
        return;
      }
    });

    if (!valid) {
      return;
    }

    setDeploying(true);
    if (pleaseFillRequired) setPleaseFillRequired(false);

    const _roleArgs = [];
    for (let i = 0; i < roles.length; i++) {
      const _role = {
        id: Number(roles[i].id),
        price: parseEther(
          Number(roles[i].price * 1_000_000_000).toString(),
          "gwei"
        ),
        maxAllowedMint: Number(roles[i].quota),
      };
      _roleArgs.push(_role);
    }
    setRoleArg(_roleArgs);
    setDeploying(false);
  }

  return (
    <div>
      <div id="modal">
        <DeployRolesModal
          onClose={handleCloseDeployModal}
          isOpen={showDeployModal}
          writeArgs={rolesArg}
          setProject={setProject}
          project={project}
          abi={abi}
          roles={roles}
        />
      </div>
      <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
        add minting roles
      </h1>
      <p className="text-zinc-400 text-sm mb-4">
        You can set whitelists or any other roles you want
      </p>
      {roles.map((role, i) => {
        if (i == 0) {
          return (
            <div
              key={"role_" + i}
              className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800"
            >
              <label className="block text-tock-orange text-sm font-bold mb-2">
                <span className="text-zinc-400">0: </span> {role.name}
              </label>
              <LabeledInput
                value={role.quota}
                type="number"
                min="0"
                step="1"
                onChange={(e) =>
                  handleEditRole({ ...role, quota: e.target.value })
                }
                required={true}
              >
                max allowed mint by each address{" "}
                <span className="text-xs font-normal text-zinc-400">
                  (required)
                </span>
              </LabeledInput>
              <LabeledInput
                value={role.price}
                type="number"
                min="0"
                step="0.0001"
                placeholder="0.0005"
                onChange={(e) =>
                  handleEditRole({ ...role, price: e.target.value })
                }
                required={true}
              >
                price for <span className="text-tock-orange">public</span> mint{" "}
                <span className="text-xs font-normal text-zinc-400">
                  (required)
                </span>
              </LabeledInput>
            </div>
          );
        } else {
          return (
            <div key={"role_" + i}>
              <Role
                roles={project.roles}
                role={role}
                onChangeRole={handleEditRole}
                onDeleteRole={handleDeleteRole}
              />
            </div>
          );
        }
      })}
      <div className="border rounded-xl border-dashed border-zinc-500 flex justify-center p-4 mb-6">
        <Button
          variant="primary"
          type="button"
          onClick={() => dispatch({ type: "add" })}
        >
          + add role
        </Button>
      </div>
      <div className="text-tock-orange text-xs my-4">
        <p className="mb-2">
          IMPORTANT 1: You need to deploy changes on-chain to proceed.
        </p>
        <p className="mb-2">
          IMPORTANT 2: roles cannot be removed after deloyment, but can be
          added.
        </p>
      </div>
      {!abiError && (
        <div>
          {chain.id != project.chainId && (
            <Button
              className="xs:mt-2"
              variant="warning"
              type="button"
              onClick={() => sn.switchNetwork?.(Number(project.chainId))}
              disabled={sn.isLoading}
            >
              <div>
                {sn.isLoading &&
                  sn.pendingChainId === Number(project.chainId) && (
                    <Loading
                      isLoading={
                        sn.isLoading &&
                        sn.pendingChainId === Number(project.chainId)
                      }
                      size={10}
                    />
                  )}
                {!sn.isLoading && <div> switch network to {project.chain}</div>}
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
                {deploying && <Loading isLoading={deploying} size={10} />}
              </div>
              {!deploying && <div> Save & Deploy</div>}
            </Button>
          )}
          {pleaseFillRequired && (
            <p className="mt-2 text-xs text-tock-red">
              Please provide valid information for all required fields.
            </p>
          )}
          {sn.error && (
            <p className="text-tock-red text-xs mt-2">
              Switch network failed. please try again, or change manually using
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
        </div>
      )}
      {abiError && (
        <p className="text-tock-red text-sm">
          something wrong, please refresh the page and navigate to Actions
          again.
        </p>
      )}
    </div>
  );
}

function roleReducer(roles, action) {
  switch (action.type) {
    case "load": {
      return action.roles;
    }

    case "init": {
      return [
        {
          id: 0,
          name: "public",
          quota: 5,
          price: "",
          allowedAddresses: [],
        },
      ];
    }

    case "add": {
      const id = roles.length;
      return [
        ...roles,
        {
          id,
          name: "",
          quota: 0,
          price: "",
          allowedAddresses: [],
        },
      ];
    }

    case "delete": {
      const remain = roles.filter((role) => role.id !== action.id);
      remain.forEach((role, i) => {
        role.id = i + 1;
      });
      return remain;
    }
    case "edit": {
      return roles.map((role) => {
        if (role.id === action.role.id) {
          return action.role;
        } else {
          return role;
        }
      });
    }
  }
}
