import { useState, useReducer, useContext, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import ClipLoader from "react-spinners/ClipLoader";
import { updateProjectRoles } from "@/api/projects/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import Role from "./role-component";
import LabeledInput from "../design/labeled-input/labeled-input";
import Button from "../design/button/button";

export default function ProjectRolesForm() {
  // Contexts
  const { project, setProject } = useContext(LaunchpadContext);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  // Pages states
  const [deploying, setDeploying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pleaseFillRequired, setPleaseFillRequired] = useState(false);
  // Form states
  const [roles, dispatch] = useReducer(roleReducer, []);

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

  async function callUpdateProjectRoles() {
    let valid = true;
    roles.forEach((role) => {
      if (
        role.name.length == 0 ||
        role.quota.length == 0 ||
        role.price.length == 0 ||
        publicPrice.length == 0
      ) {
        setPleaseFillRequired(true);
        valid = false;
        return;
      }
    });

    if (publicPrice.length == 0) {
      setFailed(true);
      setErrorMessage("Public price cannot be empty.");
      return;
    }

    if (!valid) return;
    setDeploying(true);
    if (success) setSuccess(false);
    if (failed) setFailed(false);
    if (pleaseFillRequired) setPleaseFillRequired(false);
    const res = await updateProjectRoles(address, {
      uuid: project.uuid,
      roles,
    });

    if (res.success === true) {
      setSuccess(true);
      setSuccessMessage("Roles updated successfully.");
      setProject(res.payload);
    } else {
      setFailed(true);
      setErrorMessage("Something went wrong, please try again.");
    }
    setDeploying(false);
  }

  return (
    <div>
      {roles.map((role, i) => {
        if (i == 0) {
          return (
            <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
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
      <div>
        <p className="text-tock-orange text-sm mb-2">
          IMPORTANT: You need to deploy changes on-chain to proceed.
        </p>
      </div>
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
          onClick={() => callUpdateProjectRoles()}
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
      {success && (
        <p className="mt-2 text-xs text-tock-green">{successMessage}</p>
      )}
      {failed && <p className="mt-2 text-xs text-tock-red">{errorMessage}</p>}
      {pleaseFillRequired && (
        <p className="mt-2 text-xs text-tock-red">
          Please provide valid information for all required fields.
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
    </div>
  );
}
