import { useContext } from "react";
import { LaunchpadContext } from "@/contexts/project-context";
import Link from "next/link";

export default function ActionAdminMint() {
  const { project } = useContext(LaunchpadContext);
  return (
    <section id="set-active-session">
      <p className="text-tock-orange text-xs font-normal my-4">
        currently we are not supporting batch mint for owner, but we are working
        hard to make this available in a convenient way.{" "}
      </p>
      <p className="text-zinc-400 text-xs font-normal my-4">
        until then, you can visit your{" "}
        <Link
          className="text-blue-400 hover:text-blue-200"
          href={`/c/${project.slug}`}
        >
          mintpad page
        </Link>{" "}
        with the wallet you create the project with, and use "
        <span className="text-tock-green">owner free mint</span>" button to mint
        without any platform fee, which is only available for contract OWNER.
      </p>
    </section>
  );
}
