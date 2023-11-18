import Link from "next/link";
import DiscordSvg from "@/svgs/social-svgs/DiscordSvg";
import TwitterSvg from "@/svgs/social-svgs/TwitterSvg";
import WebstieSVG from "@/svgs/social-svgs/WebsiteSvg";
export default async function MintpadSocialbar({ project }) {
  return (
    <div className="mt-4 flex flex-row gap-10 md:gap-10 lg:gap-16 justify-center border border-zinc-600 rounded-xl">
      {project?.twitter.length > 0 && (
        <Link href={`https://twitter.com/${project.twitter}`}>
          <TwitterSvg
            color="#52525b"
            className="w-6 hover:opacity-50 transition ease-in-out duration-200"
          />
        </Link>
      )}

      {project?.discord.length > 0 && (
        <Link href={`https://discord.gg/${project.discord}`}>
          <DiscordSvg
            color="#52525b"
            className="w-6 hover:opacity-50 transition ease-in-out duration-200"
          />
        </Link>
      )}

      {project?.website.length > 0 && (
        <Link href={`https://${project.website}`}>
          <WebstieSVG
            color="#52525b"
            className="w-6 hover:opacity-50 transition ease-in-out duration-200"
          />
        </Link>
      )}
    </div>
  );
}
