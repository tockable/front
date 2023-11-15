import Link from "next/link";
import TockableLogo from "@/svgs/logo";
export default function Navbar() {
  // export default function Navbar({ resultRefs }) {
  // function scrollToWaitlist(e) {
  //   e.preventDefault();
  //   const yOffset = -80;
  //   const y =
  //     resultRefs.current[0].getBoundingClientRect().top +
  //     window.scrollY +
  //     yOffset;
  //   window.scrollTo({ top: y, behavior: "smooth" });
  // }
  return (
    <div>
      <div className="z-10 flex h-[3rem] w-[3rem] justify-items-start fixed top-16 sm:left-[2rem] md:top-2 xs:left-[1.5rem] xxs:top-24 xxs:left-[1rem] rounded-xl">
        <svg className="rounded-xl">
          <TockableLogo />
        </svg>
      </div>
      <span className="ml-[5.5rem] top-9 fixed text-white font-bold z-10 hidden lg:block">
        Tockable
      </span>
      <div className="flex flex-row justify-center">
        <nav className="flex items-center w-11/12 md:w-3/4 lg:w-1/2 z-10 rounded-xl xxs:h-20 xs:h-12  bg-tock-semiblack fixed top-2 border border-tock-black">
          <Link
            className="p-8 mx-1 text-center transition ease-in-out hover:bg-tock-black duration-300 text-gray-300 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white flex-auto"
            href="/"
          >
            home
          </Link>

          <Link
            className="p-8 mx-1 text-center transition ease-in-out hover:bg-tock-black duration-300 text-gray-300 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white flex-auto"
            href="#"
          >
            doc <span className="text-gray-500"> soon!</span>
          </Link>

          <Link href="/dashboard">
            <button
              className="mx-1 text-center transition ease-in-out xxs:h-16 hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white flex-auto xs:h-10"
              // onClick={scrollToWaitlist}
            >
              launch project
            </button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
