import Link from "next/link";
import TockableLogo from "@/svgs/logo";
export default function NavbarLaunchpad() {
  return (
    <div>
      <div className="hover:opacity-70 transition duration-200 ease-in-out z-10 flex h-[3rem] w-[3rem] justify-items-start fixed left-2 top-2 invisible xs:invisible md:visible rounded-xl">
        <svg className="rounded-xl">
          <Link href="/">
            <TockableLogo />
          </Link>
        </svg>
      </div>
    </div>
  );
}
