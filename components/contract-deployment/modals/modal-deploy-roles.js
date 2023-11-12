import { useState, useEffect } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { updateProjectRoles } from "@/actions/launchpad/projects";
import Modal from "@/components/design/modals/modal";
import Button from "@/components/design/button/button";
import Loading from "@/components/loading/loading";

export default function DeployRolesModal({
  onClose,
  isOpen,
  setProject,
  project,
  abi,
  writeArgs,
  roles,
}) {
  const { address } = useAccount();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  // console.log(writeArgs);
  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "setRoles",
    args: [writeArgs],
  });
  const { data, write, isError, error, isLoading } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (!uwt.isSuccess) {
      setSuccess(false);
      return;
    }

    updateProjectRoles(address, {
      uuid: project.uuid,
      roles,
    }).then((res) => {
      if (res.success === true) {
        setSuccess(true);
        setProject(res.payload);
      } else {
        setFailed(true);
      }
      setSuccess(true);
    });
  }, [uwt.isSuccess]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            deploy roles
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
                    disabled={isLoading || uwt.isLoading}
                    onClick={() => write?.()}
                  >
                    {(isLoading || uwt.isLoading) && (
                      <Loading
                        isLoading={isLoading || uwt.isLoading}
                        size={10}
                      />
                    )}
                    {!isLoading && !uwt.isLoading && (
                      <p>sign to deploy roles</p>
                    )}
                  </Button>
                </div>
              </div>
            )}
            {success && (
              <p className="text-tock-green text-sm mt-2">
                roles successfully deployed.
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
