import Register from "@/components/waitlist/waitlist-register";
import TockBanner from "@/components/design/tock/tock";
import NavbarHome from "@/components/design/navbar/navbarHome";
import Footer from "@/components/design/footer";
import Socialbar from "@/components/design/social-bar/socialbar";

export default function page() {
  return (
    <main className="h-screen bg-tock-black">
      <NavbarHome />
      <div id="banner" className="h-screen mt-20">
        <TockBanner />
        <h1 className="h-32 text-zinc-300 mt-4 font-bold text-2xl text-center">
          unlocking onchain possibilities for Web3 & NFT enthusiasts.
        </h1>
      </div>
      {/* <h1 className="text-zinc-300 mt-4 font-bold text-2xl text-center">
        power of choice
      </h1> */}
      <div className="flex flex-col items-center gap-10 md:p-4 justify-center md:flex-row mt-10">
        <div className="border-2 border-tock-orange rounded-xl p-4 w-11/12 md:w-1/2 h-40">
          <h1 className="text-tock-green font-bold text-2xl mb-2">
            <span className="text-tock-red">no more</span> random JPGs
          </h1>
          <p className="text-zinc-200">
            forget random JPGs, it's your choice! create and mint the new
            generation of NFTs with Tockable.
          </p>
        </div>
        <div className="border-2 border-tock-orange rounded-xl p-4 w-11/12 md:w-1/2 h-40">
          <h1 className="text-tock-green font-bold text-2xl mb-2">
            returning <span className="text-tock-red">power</span> to minters
          </h1>
          <p className="text-zinc-200">
            Tockable lets minters compose and mint their favorite NFT using
            their favorite traits and mint it instantly.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-10 md:p-4 justify-center md:flex-row mt-10 mb-44">
      <div className="border-2 border-tock-orange rounded-xl p-4 w-11/12 md:w-1/2 h-40">
          <h1 className="text-tock-green font-bold text-2xl mb-2">
          <span className="text-tock-red">zero-code</span> for creators
          </h1>
          <p className="text-zinc-200">
            Tockable is a zero-code platform to let creators create and publish
            their own dynamic-mintable collection.
          </p>
        </div>
        <div className="border-2 border-tock-orange rounded-xl p-4 w-11/12 md:w-1/2 h-40">
          <h1 className="text-tock-green font-bold text-2xl mb-2">
            learn about tockable
          </h1>
          <p className="text-zinc-200">
            learn about what tockable can do with our docs! soon!
          </p>
          <p className="text-zinc-200">...</p>
        </div>
      </div>

      <div>
        <Register />
      </div>
      <Socialbar />
      <Footer />
    </main>
  );
}
