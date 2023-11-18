import { useContext } from "react";
import { MAX_MINT_PER_TX } from "@/tock.config";
import { MintContext } from "@/contexts/mint-context";

export default function MintBasket() {
  const { blobs, project, removeFromBasket, duplicatedIndexes } =
    useContext(MintContext);
  const maxMint = project.maxMint ? project.maxMint : MAX_MINT_PER_TX;
  const maxMintArray = (() => {
    const _maxMintArray = [];
    for (let i = 0; i < maxMint; i++) _maxMintArray.push(0);
    return _maxMintArray;
  })();
  return (
    <div>
      <div className="mx-4 mt-6">
        <h1 className="text-tock-blue mb-1">
          basket of tokens to mint{" "}
          <span className="text-zinc-400 text-sm">
            ({blobs.length}/{maxMint})
          </span>
        </h1>
        <p className="text-zinc-400 text-xs">
          it works just like Add to cart! shows NFTs that you choose to mint.
          you can add up to 5 token in a basket
        </p>
      </div>
      <div className="bg-tock-black rounded-2xl p-4 mx-4 my-2 mb-4 flex flex-wrap justify-center gap-2 items-center">
        {blobs?.map((blob, i) => (
          <div key={"cart_" + i}>
            <img
              className={`object-contain rounded-xl  ${
                parseInt(duplicatedIndexes[i]) === 1
                  ? "border-tock-red border-4 border-solid"
                  : "border-zinc-600 border-2 border-solid"
              }`}
              src={blob.url}
              alt={"nft-reserved-for-mint-" + i}
              width={100}
            />
            <div className="flex justify-center mt-1">
              <button
                onClick={() => removeFromBasket(blob.id)}
                className="transition ease-in-out duration-200 rounded-2xl px-2 text-zinc-400 hover:bg-tock-red hover:text-white hover:font-bold text-xs"
              >
                remove
              </button>
            </div>
            {duplicatedIndexes.length > 0 &&
              parseInt(duplicatedIndexes[i]) === 1 && (
                <p className="text-tock-red text-xs mt-1 text-center">
                  taken before
                </p>
              )}
          </div>
        ))}
        {maxMintArray.map((_, i) => {
          if (i > blobs?.length - 1) {
            return (
              <div
                key={"empty_blob_" + i}
                className="rounded-xl border-2 border-dashed border-zinc-600 text-zinc-600 font-bold text-2xl w-10 h-10 pt-[2px] text-center align-super"
              >
                +
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
