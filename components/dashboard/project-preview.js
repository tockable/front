import Link from "next/link";
import { useState, useEffect } from "react";
import { IPFS_GATEWAY } from "@/tock.config";
import Button from "../design/button/button";
export default function ProjectPreview({ project }) {
  const [projectImage, setProjectImage] = useState("/tockable_placeholder");

  useEffect(() => {
    if (project.image) {
      setProjectImage(`${IPFS_GATEWAY}/${project.image}`);
    } else {
      setProjectImage('/tockable_placeholder.png')
    }
  }, []);

  return (
    <div className="flex flex-col items-center px-8 pt-6 pb-8 bg-tock-semiblack rounded-2xl">
      <img className="rounded-xl" src={projectImage} width="200"></img>

      <p className="mt-4 text-sm text-zinc-400 font-bold">{project.name}</p>
      <p className="my-4 text-xs text-zinc-400">{project.chain}</p>
      <Button
        variant="secondary"
        type="button"
        // disabled={submitting}
        // onClick={() => {
        //   register();
        // }}
      >
        <Link href={`/launchpad/${project.uuid}`}> Go to project</Link>
      </Button>
    </div>
  );
}
