import AdminMint from "./admin-mint";
export default function MintpadAdminMintSection({
  prepareMint,
  incrementBlobState,
}) {
  return (
    <AdminMint
      prepareMint={prepareMint}
      incrementBlobState={incrementBlobState}
    />
  );
}
