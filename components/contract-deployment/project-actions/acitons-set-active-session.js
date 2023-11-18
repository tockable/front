import { useState, useEffect, useContext } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { updateActiveSession } from "@/actions/launchpad/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import Loading from "@/components/loading/loading";
import Button from "../../design/button/button";

export default function ActionSetActiveSession({ abi }) {
  const { project, setProject } = useContext(LaunchpadContext);
  const [key, setKey] = useState(1);
  const [sessionToActive, setSessionToActive] = useState();
  const [isWriting, setWriting] = useState(false);
  const [sessionName, setSessionName] = useState();
  const [updated, setUpdated] = useState(false);
  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "setActiveSession",
    args: [Number(sessionToActive)],
  });
  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (project.activeSession.length !== 0)
      setSessionToActive(project.activeSession.toString());
    else setSessionToActive("0");
  }, []);

  function onChangeActiveSession(e) {
    setSessionToActive(e.target.value);
  }

  // useEffect(() => {if(!isError) return },[isError])
  useEffect(() => {
    if (!uwt.isSuccess) return;
    setWriting(true);
    updateActiveSession(project.creator, project.uuid, sessionToActive).then(
      (res) => {
        if (res.success === true) {
          setKey(key + 1);
          setUpdated(true);
          setProject(res.payload);
        }
      }
    );
    setWriting(false);
  }, [uwt.isSuccess]);
  useEffect(() => {
    if (!sessionToActive) return;
    const _sessionName = getActiveSessionName(sessionToActive);
    setSessionName(_sessionName);
  }, [sessionToActive]);

  function getActiveSessionName(_sessionToActive) {
    const _session = project.sessions.find(
      (session) => session.id == _sessionToActive
    );
    if (_session) {
      return _session?.name;
    }
  }

  return (
    <section id="set-active-session">
      <div key={key}>
        <h1 className="font-bold text-sm text-tock-blue mb-4 ">
          Select a session you want to set:
        </h1>
        {project.sessions.length > 0 &&
          project.sessions.map((session, i) => {
            return (
              <div
                className="flex items-center my-2"
                key={"session-to-acitve-" + i}
              >
                <input
                  id={"sessions_" + i}
                  type="radio"
                  name="sessions"
                  value={session.id}
                  className="w-4 h-4 accent-tock-green text-blue-100"
                  onChange={onChangeActiveSession}
                  checked={sessionToActive == session.id}
                />

                <label className="grid font-bold grid-cols-3 ml-2 text-xs border border-zinc-400 rounded-2xl p-2 w-full">
                  <p className="text-tock-orange">
                    {session.name}
                    {Number(session.id) === Number(project.activeSession) &&
                      project.activeSession.toString().length > 0 && (
                        <span className="text-zinc-400"> (active)</span>
                      )}
                  </p>
                </label>
              </div>
            );
          })}
      </div>
      <Button
        disabled={isLoading || uwt.isLoading || isWriting}
        className="mt-4"
        variant={"secondary"}
        onClick={() => write?.()}
      >
        {(isLoading || uwt.isLoading || isWriting) && (
          <Loading
            isLoading={isLoading || uwt.isLoading || isWriting}
            size={10}
          />
        )}
        {!isLoading && !uwt.isLoading && !isWriting && (
          <p> set active session to {sessionName}</p>
        )}
      </Button>
      {(isLoading || uwt.isLoading || isWriting) && (
        <p className="text-tock-orange mt-2 text-xs">
          do not close this window, or change tab...
        </p>
      )}
      {isError && <p className="text-tock-red mt-2 text-xs">{error.name}</p>}
      {uwt.isError && (
        <p className="text-tock-red mt-2 text-xs">transaction failed</p>
      )}
      {updated && (
        <p className="text-tock-green mt-2 text-xs">
          active session updated successfully
        </p>
      )}
    </section>
  );
}
