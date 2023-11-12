import Mint from "./mint";
export default function MintpadMintSection({
  handleBlob,
  roles,
  mintAction,
  session,
  abi,
  blob,
  setKey,
}) {
  return (
    <div>
      {roles.map((role, i) => (
        <div
          key={"mint-sec-" + i}
          className="flex grow border border-zinc-400 bg-tock-black rounded-2xl p-4 my-4 mx-4"
        >
          <Mint
            handleBlob={handleBlob}
            role={role}
            mintAction={mintAction}
            session={session}
            abi={abi}
            blob={blob}
            setKey={setKey}
          />
        </div>
      ))}
    </div>
  );
}
