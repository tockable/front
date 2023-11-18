// import { useState, useEffect, useContext } from "react";
// import { useContractReads } from "wagmi";
// import { MintContext } from "@/contexts/mint-context";

// export default function useTotalSupply(abi, project) {
//   const [supplyLeft, setSupplyLeft] = useState(0);
//   const [supplyLeftInSession, setSupplyLeftInSession] = useState(0);
//   const [isMintLive, setIsMintLive] = useState(true);

// const { data, isError, isLoading } = useContractReads({
//   contracts: [
//     {
//       address: project.contractAddress,
//       abi,
//       functionName: "isMintLive",
//     },
//     {
//       address: project.contractAddress,
//       abi,
//       functionName: "tokensLeft",
//     },
//     {
//       address: project.contractAddress,
//       abi,
//       functionName: "tokensLeftInSession",
//       args: [Number(project.activeSession)],
//     },
//   ],
//   enabled: abi.length > 0 && project.contractAddress,
//   watch: true,
//   structuralSharing: (prev, next) => (prev === next ? prev : next),
// });

// useEffect(() => {
//   if (isLoading) return;
//   setSupplyLeftInSession(parseInt(data[2].result));
//   setSupplyLeft(parseInt(data[1].result));
//   setIsMintLive(data[0].result);
//   console.log("rerende");
// }, [isLoading]);
// console.log(isLoading);
// return {
//   supplyLeft: parseInt(data[1].result),
//   supplyLeftInSession: parseInt(data[2].result),
//   isMintLive: data[0].result,
//   isError,
// };
//   return {
//     supplyLeft,
//     supplyLeftInSession,
//     isMintLive,
//     // isError,
//   };
// }
