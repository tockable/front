import CoverPlaceholder from "@/svgs/cover_placeholder";
import { IPFS_GATEWAY } from "@/tock.config";

export default function MintpadHeader({ project }) {
  return (
    <header className={`mb-4 ${project.cover && "border-b border-zinc-400`"}`}>
      {!project.cover && <CoverPlaceholder />}
      {project.cover && (
        <img
          className=" h-[25vw] w-full object-cover"
          src={`${IPFS_GATEWAY}/${project.cover}`}
        />
      )}
    </header>
  );
}
