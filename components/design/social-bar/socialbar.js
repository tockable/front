import Link from "next/link";
import DiscordSvg from "@/svgs/social-svgs/DiscordSvg";
import TwitterSvg from "@/svgs/social-svgs/TwitterSvg";
import MirrorSvg from "@/svgs/social-svgs/MirrorSvg";
import { SOCIAL } from "@/tock.config";
export default function Socialbar() {
  return (
    <footer className="mt-12 flex flex-row gap-10 md:gap-20 lg:gap-32 justify-center">
      <Link href={SOCIAL.twitter}>
        <TwitterSvg
          color="#3f3f46"
          className="w-6 hover:opacity-50 transition ease-in-out duration-200"
        />
      </Link>
      <Link href={SOCIAL.discord}>
        <DiscordSvg
          color="#3f3f46"
          className="w-6 hover:opacity-50 transition ease-in-out duration-200"
        />
      </Link>
      {/* <Link href={SOCIAL.mirror}>
        <MirrorSvg className="w-6" />
      </Link> */}
    </footer>
  );
}
