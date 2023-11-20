import { useState, useEffect } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { updateProjectSessions } from "@/actions/launchpad/projects";
import Loading from "@/components/loading/loading";
import Modal from "@/components/design/modals/modal";
import Button from "@/components/design/button/button";

export default function DeploySessionsModal({
  onClose,
  isOpen,
  setProject,
  project,
  abi,
  writeArgs,
  sessions,
}) {
  const { address } = useAccount();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "setSessions",
    args: [writeArgs],
    // gas: 2_000_000n,
  });
  const { data, write, isError, error, isLoading } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (!uwt.isSuccess) {
      setSuccess(false);
      return;
    }
    setUpdating(true);
    updateProjectSessions(address, {
      uuid: project.uuid,
      sessions,
    }).then((res) => {
      if (res.success === true) {
        setSuccess(true);
        setProject(res.payload);
      } else {
        setFailed(true);
      }
    });
    setUpdating(false);
  }, [uwt.isSuccess]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            deploy sessions
          </h1>

          <div className="mb-6">
            {!success && (
              <div>
                <p className="text-tock-orange text-xs font-normal">
                  please do not close this window until see the success
                  message...
                </p>
                <div className="flex justify-center my-4">
                  <Button
                    variant="primary"
                    type="button"
                    disabled={isLoading || uwt.isLoading || updating}
                    onClick={() => write?.()}
                  >
                    {(isLoading || uwt.isLoading) && (
                      <Loading
                        isLoading={isLoading || uwt.isLoading || updating}
                        size={10}
                      />
                    )}
                    {!isLoading && !uwt.isLoading && (
                      <p>sign to deploy sessions</p>
                    )}
                  </Button>
                </div>
              </div>
            )}
            {success && (
              <p className="text-tock-green text-sm mt-2">
                sessions successfully deployed.
              </p>
            )}

            {isError && (
              <p className="text-tock-red text-sm mt-2">{error.name}</p>
            )}
            {failed && (
              <p className="text-tock-red text-sm mt-2">
                something went wrong, please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
