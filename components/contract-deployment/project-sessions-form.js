import { useState, useReducer, useContext, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import ClipLoader from "react-spinners/ClipLoader";
import { updateProjectSessions } from "@/api/projects/projects";
import { LaunchpadContext } from "../../contexts/project-context";
import Session from "./session-component";
import LabeledInput from "../design/labeled-input/labeled-input";
import Button from "../design/button/button";

export default function ProjectSessionsForm() {
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
  const [pleaseFillRequired, setPleaseFillRequied] = useState(false);
  // Form states
  const [sessions, dispatch] = useReducer(sessionReducer, []);

  useEffect(() => {
    console.log(project.sessions);
    if (project.sessions.length > 0) {
      dispatch({ type: "load", sessions: project.sessions });
    } else {
      console.log("init");
      dispatch({ type: "init" });
    }
  }, []);

  function handleEditSession(session) {
    dispatch({ type: "edit", session });
  }

  function handleDeleteSession(id) {
    dispatch({ type: "delete", id });
  }

  function sessionReducer(sessions, action) {
    switch (action.type) {
      case "load": {
        return [action.sessions];
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
            activate: false,
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
            activate: false,
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

  async function callUpdateProjectSessions() {
    setDeploying(true);
    if (success) setSuccess(false);
    if (failed) setFailed(false);
    const res = await updateProjectSessions(address, {
      uuid: project.uuid,
      sessions,
    });

    if (res.success === true) {
      setSuccess(true);
      setSuccessMessage("Sessions updated successfully.");
      setProject(res.payload);
    } else {
      setFailed(true);
      setErrorMessage("Something went wrong, please try again.");
    }
    setDeploying(false);
  }

  return (
    <div>
      {sessions.map((session, i) => {
        if (i == 0) {
          return (
            <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
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
                value={session.start}
                id={`session_start_${session.id}`}
                type="datetime-local"
                onChange={(e) =>
                  handleEditSession({ ...session, start: e.target.value })
                }
                required={true}
              >
                start session at
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
                end session at
              </LabeledInput>
            </div>
          );
        } else {
          return (
            <div key={"session_" + i}>
              <Session
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
          onClick={() => callUpdateProjectSessions()}
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
    </div>
  );
}
