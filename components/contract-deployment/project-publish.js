import { useContext, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { publishProject } from "@/actions/launchpad/projects";
import { unPublishProject } from "@/actions/launchpad/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import Button from "../design/button/button";

export default function ProjectPublish() {
  const { project, setProject } = useContext(LaunchpadContext);
  const { address } = useAccount();

  const [successPublish, setSuccessPublish] = useState(false);
  const [successUnpublish, setSuccessUnpublish] = useState(false);
  const [error, setError] = useState(false);

  async function callPublishProject() {
    const res = await publishProject(project.uuid, address);
    if (res.success === true) {
      if (successUnpublish) setSuccessUnpublish(false);
      if (successPublish) setSuccessPublish(false);
      setSuccessPublish(true);
      setProject(res.payload);
      if (error) setError(false);
    } else {
      if (!error) setError(true);
    }
  }

  async function callUnpublishProject() {
    const res = await unPublishProject(project.uuid, address);
    if (successUnpublish) setSuccessUnpublish(false);
    if (successPublish) setSuccessPublish(false);
    if (res.success === true) {
      setSuccessUnpublish(true);
      setProject(res.payload);
      if (error) setError(false);
    } else {
      if (!error) setError(true);
    }
  }
  return (
    <div>
      <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
        publishment
      </h1>
      {project.slug == 0 && (
        <p className="text-tock-orange text-xs font-normal my-4">
          -for publishing the project, you should choose a slug in "
          <span className="text-tock-green">Details</span>" secion.
        </p>
      )}
      {project.sessions.length == 0 && (
        <p className="text-tock-orange text-xs font-normal my-4">
          -for publishing the project, you should at least add a session for
          minting.
        </p>
      )}

      {project.roles.length == 0 && (
        <p className="text-tock-orange text-xs font-normal my-4">
          -for publishing the project, you should at least add a role for
          minting.
        </p>
      )}
      {project.sessions.length > 0 &&
        project.roles.length > 0 &&
        project.slug.length > 0 && (
          <div>
            {!project.isPublished && (
              <div>
                <p className="text-tock-orange text-xs my-4">
                  status: unpublished
                </p>
                <p className="text-sm text-zinc-400 mb-10 mt-2">
                  publishing porject makes the mintpad of the project available
                  to the public.
                </p>
              </div>
            )}
            {project.isPublished && (
              <div>
                <p className="text-tock-green text-xs my-4">
                  status: published
                </p>
                <p className="text-sm text-zinc-400 mb-10 mt-2">
                  project mintpad is live and publicly accessible via{" "}
                  <Link
                    className="font-bold text-sm text-blue-400 hover:text-blue-300 hover:cursor-pointer"
                    href={`/c/${project.slug}`}
                  >
                    {`https://tockable.xyz/c/${project.slug}`}
                  </Link>
                </p>
                <p className="text-sm text-zinc-400 mb-10 mt-4">
                  <span className="text-tock-orange font-bold">IMPRTANT:</span>{" "}
                  don't forget to set the active session at the times you
                  specified from the{" "}
                  <span className="text-blue-400">
                    "actions" -&gt; "set active session"
                  </span>
                  , otherwise your mint will not be activated. Currently, the
                  platform does not do this automatically, but we are working on
                  it.
                </p>
              </div>
            )}
            {!project.isPublished && (
              <Button
                disabled={project.isPublished}
                variant="primary"
                onClick={() => {
                  callPublishProject();
                }}
              >
                publish project
              </Button>
            )}
            {project.isPublished && (
              <Button
                disabled={!project.isPublished}
                variant="secondary"
                onClick={() => {
                  callUnpublishProject();
                }}
              >
                unpublish project
              </Button>
            )}
            {successPublish && (
              <p className="mt-2 text-tock-green text-xs">
                Project published successfully"
              </p>
            )}
            {successUnpublish && (
              <p className="mt-2 text-tock-green text-xs">
                Project unpublished successfully
              </p>
            )}
            {error && (
              <p className="mt-2 text-tock-red text-xs">
                Something went wrong, please try again.
              </p>
            )}
          </div>
        )}
    </div>
  );
}
