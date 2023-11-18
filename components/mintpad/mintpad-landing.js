import WagmiProvider from "@/contexts/wagmi-provider";
import Mintpad from "./mintpad-container";
import MintpadHeader from "./mintpad-project-header";
import MintpadProjectDetails from "./mintpad-project-details";
import getHashAndSignature from "@/actions/signature/signature";
import { getContractAbi } from "@/actions/contract/metadata";
import storeMultipleFilesToIpfs from "@/actions/ipfs/uploadMultipleFileToIpfs";
import getCidTuple from "@/actions/utils/cid-utils";
import Footer from "../design/footer";
import NavbarLaunchpad from "../design/navbar/navvar-launchpad";
import Socialbar from "../design/social-bar/socialbar";

async function callGetContractAbi(_dropType) {
  "use server";
  const res = await getContractAbi(_dropType);
  return res;
}

export default async function MintpadLanding({ project }) {
  async function prepareMint(_address, _roleId, _sessionId, _files) {
    "use server";

    const ipfsRes = await storeMultipleFilesToIpfs(_files);

    if (!ipfsRes.success) {
      return {
        success: false,
        message: "cannot upload to ipfs at this moment, please try again.",
      };
    }

    const cids = [];

    ipfsRes.cids.forEach((cid) => {
      const _cid = getCidTuple(cid);
      cids.push(_cid);
    });

    const sigRes = await getHashAndSignature(
      project?.creator,
      _address,
      _roleId,
      _sessionId,
      project?.signer
    );

    if (!sigRes.success) {
      return {
        success: false,
        message: "cannot create signature.",
      };
    }

    return {
      success: true,
      cids,
      signature: sigRes.payload.signature,
    };
  }
  return (
    <main>
      <MintpadHeader project={project} />
      {project && (
        <div id="banner" className="flex justify-center">
          <NavbarLaunchpad />
          <div className="basis-3/4">
            <MintpadProjectDetails project={project} />
            <WagmiProvider>
              <Mintpad
                project={project}
                prepareMint={prepareMint}
                abiAction={callGetContractAbi}
              />
            </WagmiProvider>
            <Socialbar />
            <Footer />
          </div>
        </div>
      )}
    </main>
  );
}
