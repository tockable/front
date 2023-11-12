import { useState, useReducer, useContext, useEffect } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { LaunchpadContext } from "../../contexts/project-context";
import DeploySessionsModal from "./modals/modal-deploy-sessions";
import Session from "./session-component";
import Loading from "../loading/loading";
import LabeledInput from "../design/labeled-input/labeled-input";
import Button from "../design/button/button";

export default function ProjectSessionsForm() {
  // Page states
  const [abiError, setAbiError] = useState(false);
  const [pleaseFillRequired, setPleaseFillRequired] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [sessionArgs, setSessionArgs] = useState([
    { id: 0, allowedRoles: [0], allocation: 0 },
  ]);
  const [sessions, dispatch] = useReducer(sessionReducer, []);
  // Contexts & Hooks
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
      sessionArgs.length == 1 &&
      sessionArgs[0].id == 0 &&
      sessionArgs[0].allowedRoles.length == 1 &&
      sessionArgs[0].allowedRoles[0] == 0 &&
      sessionArgs[0].allocation == 0
    )
      return;
    setDeploying(false);
    setShowDeployModal(true);
  }, [sessionArgs]);

  useEffect(() => {
    if (project.sessions.length > 0) {
      dispatch({ type: "load", sessions: project.sessions });
    } else {
      dispatch({ type: "init" });
    }
  }, []);

  function handleEditSession(session) {
    dispatch({ type: "edit", session });
  }

  function handleDeleteSession(id) {
    dispatch({ type: "delete", id });
  }

  async function deploy() {
    let valid = true;
    sessions.forEach((session) => {
      if (session.name.length == 0 || session.allocation.length == 0) {
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

    const _sessionArgs = [];
    for (let i = 0; i < sessions.length; i++) {
      const roleToIntArray = [];
      for (let j = 0; j < sessions[i].roles.length; j++) {
        const sessionRoles = sessions[i].roles;
        roleToIntArray.push(Number(sessionRoles[j]));
      }
      const _session = {
        id: Number(sessions[i].id),
        allowedRoles: roleToIntArray,
        allocation: Number(sessions[i].allocation),
      };

      _sessionArgs.push(_session);
    }
    setSessionArgs(_sessionArgs);
    setDeploying(false);
  }

  return (
    <div>
      <div id="modal">
        <DeploySessionsModal
          onClose={handleCloseDeployModal}
          isOpen={showDeployModal}
          writeArgs={sessionArgs}
          setProject={setProject}
          project={project}
          abi={abi}
          sessions={sessions}
        />
      </div>
      <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
        add minting sessions
      </h1>
      <p className="text-zinc-400 text-sm mb-4">
        With setting sessions, you can control when and how people can mint your
        collection.
      </p>
      {sessions.map((session, i) => {
        if (i == 0) {
          return (
            <div
              key={"session_" + i}
              className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800"
            >
              <label className="block text-tock-orange text-sm font-bold mb-2">
                <span className="text-zinc-400">0: </span> {session.name}
              </label>
              <LabeledInput
                value={session.allocation}
                id={`session_allocation_${session.id}`}
                type="number"
                min="0"
                step="1"
                onChange={(e) =>
                  handleEditSession({ ...session, allocation: e.target.value })
                }
                required={true}
              >
                token allocation for{" "}
                <span className="text-tock-orange">{session.name}</span>
              </LabeledInput>
              <LabeledInput
                subtitle={
                  <p>
                    <span className="text-tock-orange">DISCLAIMER: </span>in
                    Tockable v1, date and time fields are only for display and
                    setting the date and time does not make the contract change
                    sessions automatically. This should be done manually in the
                    actions section.
                  </p>
                }
                value={session.start}
                id={`session_start_${session.id}`}
                type="datetime-local"
                onChange={(e) =>
                  handleEditSession({ ...session, start: e.target.value })
                }
                required={true}
              >
                start session at{" "}
                <span className="text-zinc-400 text-xs">(UTC)</span>
              </LabeledInput>
              <LabeledInput
                value={session.end}
                id={`session_start_${session.id}`}
                type="datetime-local"
                onChange={(e) =>
                  handleEditSession({ ...session, end: e.target.value })
                }
                required={true}
              >
                end session at{" "}
                <span className="text-zinc-400 text-xs">(UTC)</span>
              </LabeledInput>
            </div>
          );
        } else {
          return (
            <div key={"session_" + i}>
              <Session
                sessions={project.sessions}
                session={session}
                roles={project.roles}
                onChangeSession={handleEditSession}
                onDeleteSession={handleDeleteSession}
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
          + add session
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
              Please provide valid information for all fields.
            </p>
          )}
          {sn.error && (
            <p className="text-tock-red text-xs mt-2">
              Switch network failed. please try again, or changing manually
              using one of the following:
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

function sessionReducer(sessions, action) {
  switch (action.type) {
    case "load": {
      return action.sessions;
    }

    case "init": {
      const now = new Date();
      const start = now.toISOString().slice(0, 16);
      now.setDate(now.getDate() + 1);
      const end = now.toISOString().slice(0, 16);
      return [
        {
          id: 0,
          name: "public",
          allocation: 10,
          roles: [0],
          start,
          end,
        },
      ];
    }

    case "add": {
      const id = sessions.length;
      const now = new Date();
      const start = now.toISOString().slice(0, 16);
      now.setDate(now.getDate() + 1);
      const end = now.toISOString().slice(0, 16);
      return [
        ...sessions,
        {
          id,
          name: "",
          allocation: 10,
          roles: [],
          start,
          end,
        },
      ];
    }
    case "delete": {
      const remain = sessions.filter((session) => session.id !== action.id);
      remain.forEach((session, i) => {
        session.id = i + 1;
      });
      return remain;
    }
    case "edit": {
      return sessions.map((session) => {
        if (session.id === action.session.id) {
          return action.session;
        } else {
          return session;
        }
      });
    }
  }
}
