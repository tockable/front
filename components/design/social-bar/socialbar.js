import { useEffect, useState } from "react";
import Link from "next/link";
import DiscordSvg from "@/svgs/social-svgs/DiscordSvg";
import TwitterSvg from "@/svgs/social-svgs/TwitterSvg";
import MirrorSvg from "@/svgs/social-svgs/MirrorSbg";
import { getArgs } from "@/api/admin/admin";
export default function Socialbar() {
  const [twitter, setTwitter] = useState("#");
  const [discord, setDiscord] = useState("#");
  const [mirror, setMirror] = useState("#");
  useEffect(() => {
    getArgs().then((res) => {
      if (res.success) {
        setTwitter(res.config.twitter);
        setDiscord(res.config.discord);
        setMirror(res.config.mirror);
      }
    });
  }, []);
  return (
    <footer className="mt-12 flex flex-row gap-10 md:gap-20 lg:gap-32 justify-center">
      <Link href={twitter}>
        <TwitterSvg />
      </Link>
      <Link href={discord}>
        <DiscordSvg />
      </Link>
      <Link href={mirror}>
        <MirrorSvg />
      </Link>
    </footer>
  );
}
