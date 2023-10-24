import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { fetchProjectMintData } from "@/api/mintpad/mintpad";

export default function Mintpad({ params }) {
  const { address, isConnected } = useAccount();
  const [project, setProject] = useState();

  useEffect(() => {
    fetchProjectMintData(address, params.slug).then((res) => {
      if (res.success === true) {
        setProject(res.payload);
      }
    });
  }, []);

  return <div></div>;
}
