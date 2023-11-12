// import { useState, useContext } from "react";
// import { useContractWrite, usePrepareContractWrite } from "wagmi";
// import Button from "../../design/button/button";
// import LabeledInput from "../../design/labeled-input/labeled-input";
import { useContext } from "react";
import { LaunchpadContext } from "@/contexts/project-context";
import Link from "next/link";
// import { useDebounce } from "@uidotdev/usehooks";
// import { regex } from "@/constants/regex";
// import Loading from "@/components/loading/loading";

// export default function ActionAdminMint({ abi }) {
//   const { project } = useContext(LaunchpadContext);
//   const [adminMintquantity, setAdminMintQuantity] = useState();
//   const [adminAddress, setAdminAddress] = useState();
//   const [addressError, setAddressError] = useState("");
//   const debouncedAdminMintQuantity = useDebounce(adminMintquantity, 500);

//   const { config } = usePrepareContractWrite({
//     address: project.contractAddress,
//     abi: abi,
//     functionName: "ownerMint",
//     args: [adminAddress, debouncedAdminMintQuantity],
//   });

//   function onChangeAdminMintQuanitity(e) {
//     setAdminMintQuantity(e.target.value);
//   }

//   function onChangeAdminAddress(e) {
//     setAdminAddress(e.target.value);
//     if (!e.target.value.match(regex.evmAddress)) {
//       if (!addressError)
//         setAddressError(
//           "please enter a valid evm address, otherwise tx will be failed."
//         );
//     } else {
//       if (addressError) setAddressError("");
//     }
//   }

//   const { isLoading, isError, write, error } = useContractWrite(config);
//   return (
//     <section id="set-active-session">
//       <LabeledInput
//         type="number"
//         min={0}
//         max={500}
//         step={1}
//         placeholder={10}
//         value={adminMintquantity}
//         onChange={onChangeAdminMintQuanitity}
//       >
//         quantity <span className="text-xs text-zinc-400">(Max:500)</span>
//       </LabeledInput>
//       <LabeledInput
//         type="text"
//         placeholder={"0x..."}
//         value={adminAddress}
//         onChange={onChangeAdminAddress}
//       >
//         addreess to mint
//       </LabeledInput>
//       <Button variant={"secondary"} onClick={() => write?.()}>
//         {isLoading && <Loading isLoading={isLoading} size={10} />}
//         {!isLoading && <p>mint</p>}
//       </Button>
//       {addressError.length > 0 && (
//         <p className="text-tock-red text-sm mt-2">{addressError}</p>
//       )}
//       {isError && <p className="text-tock-red mt-2 text-sx">{error.name}</p>}
//     </section>
//   );
// }

export default function ActionAdminMint() {
  const { project } = useContext(LaunchpadContext);
  return (
    <section id="set-active-session">
      <p className="text-tock-orange text-xs font-normal my-4">
        currently we are not supporting batch mint for owner, but we are working
        hard to make this available in a convenient way.{" "}
      </p>
      <p className="text-zinc-400 text-xs font-normal my-4">
        until then, you can visit your{" "}
        <Link
          className="text-blue-400 hover:text-blue-200"
          href={`/c/${project.slug}`}
        >
          mintpad page
        </Link>{" "}
        with the wallet you create the project with, and use "
        <span className="text-tock-green">owner free mint</span>" button to mint
        without any platform fee, which is only available for contract OWNER.
      </p>
    </section>
  );
}
