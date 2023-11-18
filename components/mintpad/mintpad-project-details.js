import Link from "next/link";
import MintpadSocialbar from "../design/mintpad-socialbar/mintpad-socialbar";

export default function MintpadProjectDetails({ project }) {
  return (
    <div className="flex flex-col lg:flex-row items-center">
      <figure className="mb-4 lg:mb-0 flex flex-none">
        <img
          className="rounded-2xl"
          src={`https://ipfs.io/ipfs/${project.image}`}
          width={300}
          height={300}
        />
      </figure>
      <section className="px-8 text-center lg:text-start flex-col mb-12">
        <h1 className="text-tock-blue font-bold text-2xl mb-8">
          {project.name}
        </h1>
        <div className="bg-zinc-800 bg-opacity-70 p-4 border rounded-2xl border-zinc-400">
          <p className="text-sm text-zinc-400">{project.description}</p>
        </div>
        {(project.twitter.length > 0 ||
          project.discord.length > 0 ||
          project.website.length > 0) && <MintpadSocialbar project={project} />}
        <article className="text-xs mt-4">
          <p className="text-zinc-400 my-2">
            Total supply:{" "}
            <span className="text-tock-orange">{project.totalSupply}</span>
          </p>
          <p className="text-zinc-400 text-xs my-2">
            Contract:{" "}
            <span className="text-tock-orange">{project.contractAddress}</span>
          </p>
          <p className="text-zinc-400 text-xs my-2">
            Chain:{" "}
            <span className="text-tock-orange">{project.chainData.name}</span>
          </p>
          <p className="text-zinc-400 text-xs my-2">
            see contract on:{" "}
            <Link
              href={`https://${project.chainData.scan}/address/${project.contractAddress}`}
              className="text-blue-400 transition duration-300 ease-in-out hover:text-blue-300"
            >
              {project.chainData.scan}
            </Link>
          </p>
        </article>
      </section>
    </div>
  );
}
