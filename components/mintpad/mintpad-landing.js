import WagmiProvider from "@/contexts/wagmi-provider";
import Mintpad from "./mintpad";
import MintpatProjectDetails from "./mintpad-project-details";
import MintpadHeader from "./mintpad-header";
import getHashAndSignature from "@/actions/signature/signature";
import storeFileToIpfs from "@/actions/ipfs/uploadFileToIpfs.js";
import getCidTuple from "@/actions/utils/cid-utils";
import Footer from "../design/footer";
import { getContractAbi } from "@/actions/contract/metadata";
import Socialbar from "../design/social-bar/socialbar";

async function callGetContractAbi(_creator, _uuid, _projectName) {
  "use server";
  const res = await getContractAbi(_creator, _uuid, _projectName);
  return res;
}

export default async function MintpadLanding({ project }) {


  async function prepareMint(_address, _roleId, _sessionId, _file) {
    "use server";

    const blob = _file.get("file");
    const buffer = await blob.arrayBuffer();
    const ipfsRes = await storeFileToIpfs(buffer, "image/png");

    if (!ipfsRes.success) {
      return {
        success: false,
        message: "cannot upload to ipfs at this moment, please try again.",
      };
    }

    const cid = getCidTuple(ipfsRes.cid);

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
      cid,
      hash: sigRes.payload.hash,
      signature: sigRes.payload.signature,
    };
  }

  return (
    <main>
      <MintpadHeader project={project} />
      {project && (
        <div id="banner" className="flex justify-center">
          <div className="basis-3/4">
            <MintpatProjectDetails project={project} />
            <WagmiProvider>
              <Mintpad
                project={project}
                mintAction={prepareMint}
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
