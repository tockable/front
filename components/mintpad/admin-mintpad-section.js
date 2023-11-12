import AdminMint from "./admin-mint";
export default function MintpadAdminMintSection({ handleBlob, mintAction, abi, blob }) {
  return (
    <div>
      <div className="flex grow border border-zinc-400 bg-tock-black rounded-2xl p-4 my-4 mx-4">
        <AdminMint
          handleBlob={handleBlob}
          mintAction={mintAction}
          abi={abi}
          blob={blob}
        />
      </div>
    </div>
  );
}
