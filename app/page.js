"use client";

import { useRef, useState, useEffect } from "react";
import Register from "@/components/waitlist/waitlist-register";
import NavbarHome from "@/components/design/navbar/navbarHome";
import Footer from "@/components/design/footer";
import Socialbar from "@/components/design/social-bar/socialbar";
import {
  Exo_2,
  Bebas_Neue,
  Anton,
  Lilita_One,
  Ubuntu_Mono,
} from "next/font/google";

const exo = Exo_2({ subsets: ["latin"], weight: ["900"] });
const dela = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const anton = Anton({ subsets: ["latin"], weight: ["400"] });
const lilita = Lilita_One({ subsets: ["latin"], weight: ["400"] });
const ub = Ubuntu_Mono({ subsets: ["latin"], weight: ["400"] });
export default function page() {
  // Banner
  const firstWord = [
    <span className="text-tock-green">tock</span>,
    <div className={`text-tock-orange text-4xl ${ub.className}`}>
      &#123; _parameterized &#125;
    </div>,
    <span className={`text-white font-bold ${dela.className}`}>choose</span>,
    <span className={`text-blue-400 font-bold ${anton.className}`}>
      <i>D e s i g n</i>
    </span>,
    <span className={`text-yellow-200 font-bold ${lilita.className}`}>
      personal
      <span className="text-blue-600">i</span>
      <span className="text-green-600">z</span>
      <span className="text-red-600">e</span>
      <span className="text-yellow-300">d</span>
    </span>,
    <span className={`text-yellow-200 font-bold bg-red-600 ${dela.className}`}>
      RULE
    </span>,
    <span
      className={`text-tock-blue font-bold line-through decoration-tock-red ${exo.className}`}
    >
      mint
    </span>,
  ];

  const secondWord = [
    <span className={`text-tock-red font-bold ${dela.className}`}>your</span>,
    <span className={`text-orange-400 font-bold ${lilita.className}`}>
      on-chain
    </span>,
    <span className="text-tock-blue">
      u<span className="text-tock-green">n</span>ique
    </span>,
  ];
  const thirdWord = [
    <span className=" rounded-2xl bg-yellow-300 text-4xl p-3"> tokens</span>,
    <span className=" bg-tock-blue text-4xl p-3">collection</span>,

    <span
      className={`underline decoration-blue-900 text-white ${exo.className}`}
    >
      assets
    </span>,
    <span className="text-purple-400">nfts</span>,
  ];

  function Tock() {
    return <>{firstWord[tock]}</>;
  }
  function Your() {
    return <>{secondWord[your]}</>;
  }
  function Token() {
    return <>{thirdWord[token]}</>;
  }

  const [tock, setTock] = useState(0);
  const [your, setYour] = useState(0);
  const [token, setToken] = useState(0);

  function nextFirstWord() {
    if (tock + 1 < firstWord.length) setTock(tock + 1);
    else setTock(0);
  }

  function prevFirstWord() {
    if (tock - 1 >= 0) setTock(tock - 1);
    else setTock(firstWord.length - 1);
  }

  function nextSecondWord() {
    if (your + 1 < secondWord.length) setYour(your + 1);
    else setYour(0);
  }

  function prevSecondWord() {
    if (your - 1 >= 0) setYour(your - 1);
    else setYour(secondWord.length - 1);
  }

  function nextThirdWord() {
    if (token + 1 < thirdWord.length) setToken(token + 1);
    else setToken(0);
  }

  function prevThirdWord() {
    if (token - 1 >= 0) setToken(token - 1);
    else setToken(thirdWord.length - 1);
  }

  // Refs
  const resultRefs = useRef([]);
  resultRefs.current = [];
  function addToRef(el) {
    if (el && !resultRefs.current.includes(el)) {
      resultRefs.current.push(el);
    }
  }

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const ref = queryParameters.get("ref");
    if (ref) {
      scrollToWaitlist();
    }
  }, []);

  function scrollToWaitlist(e) {
    if (e) e.preventDefault();
    const yOffset = -80;
    const y =
      resultRefs.current[0].getBoundingClientRect().top +
      window.scrollY +
      yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <main className="h-screen bg-tock-dark">
      {/* className="flex w-screen min-h-screen flex-col items-center gap-6 mt-8" */}

      <NavbarHome resultRefs={resultRefs} />
      <div id="banner" className="h-screen mt-20">
        <div className="pt-[30vh] md:[45vh] md:px-20 flex flex-col md:flex-row">
          <div className="min-w-max md:w-full mb-10 md:mb-0">
            <p className="font-bold text-6xl text-center md:text-start h-[4rem]">
              {/* {firstWord[tock]} */}
              <Tock />
            </p>
            <p className="font-bold text-6xl text-center md:text-start h-[4rem]">
              <Your />
            </p>
            <p className="font-bold text-6xl text-center md:text-start h-[4rem]">
              <Token />
            </p>
          </div>

          <div className="flex flex-col grow justify-center">
            <div className="flex justify-center select-none">
              <button
                className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                onClick={prevFirstWord}
              >
                &lt;
              </button>

              <button
                className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                onClick={nextFirstWord}
              >
                &gt;
              </button>
            </div>
            <div className="flex justify-center select-none">
              <button
                className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                onClick={prevSecondWord}
              >
                &lt;
              </button>

              <button
                className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                onClick={nextSecondWord}
              >
                &gt;
              </button>
            </div>
            <div className="flex justify-center select-none">
              <button
                className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                onClick={prevThirdWord}
              >
                &lt;
              </button>

              <button
                className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                onClick={nextThirdWord}
              >
                &gt;
              </button>
            </div>

            <div className="flex grow justify-center mt-16">
              <button
                className="m-4 w-56 transition ease-in-out hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white"
                onClick={scrollToWaitlist}
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
      <h1 className="h-32 mt-10 text-zinc-300 text-2xl text-center">
        Unlocking onchain possibilities for Web3 & NFT enthusiasts.
      </h1>
      <div ref={addToRef}>
        <Register />
      </div>
      <Socialbar />
      <Footer />
    </main>
  );
}
