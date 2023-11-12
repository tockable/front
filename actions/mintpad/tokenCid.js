import storeFileToIpfs from "../ipfs/uploadFileToIpfs.js";
import { bufferFromBlob } from "@/utils/image-utils";



export default async function getTokenMetadataCid(_blob, _tokenData) {
    const buffer = await bufferFromBlob(_blob)
    const imageRes = storeFileToIpfs(buffer, 'image/png', `${_tokenData.name} #` )
}

function createTokenMetadata(_tokenData, _imageCid) {
  const _tokenObj = {
    name: _tokenData.name,
    description: _tokenData.description,
    image: `ipfs://${_imageCid}`,
  };

  const attributes = [];
  for (let attribute in _tokenData.attributes) {
    const newAttribute = {
      trait_type: attribute,
      value: _tokenData.attributes[attribute],
    };
    attributes.push(newAttribute);
  }

  _tokenObj.attributes = attributes;
  const tokenMetadata = JSON.stringify(_tokenObj);
  return tokenMetadata;
}
