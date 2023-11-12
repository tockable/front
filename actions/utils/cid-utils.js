import { hexEncode } from "@/utils/crypto-utils";

export default function getCidTuple(_cid) {
  const _part1 = _cid.slice(0, 32);
  const _part2 = _cid.slice(32);

  let encodedPart1 = hexEncode(_part1);
  let encodedPart2 = hexEncode(_part2);

  let zeroPaddingLen = 64 - encodedPart2.length;

  for (let i = 0; i < zeroPaddingLen; i++) {
    encodedPart2 = encodedPart2 + "0";
  }

  const hexPart1 = "0x" + encodedPart1;
  const hexPart2 = "0x" + encodedPart2;
  return { part1: hexPart1, part2: hexPart2 };
}
