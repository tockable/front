import { hexDecode } from "@/utils/crypto-utils";

export default function decodeCid(_cidTuple) {
  const _part1 = _cidTuple.part1.slice(2);
  const _part2 = _cidTuple.part2.slice(2);
  let decodedPart1 = hexDecode(_part1);
  let decodedPart2 = hexDecode(_part2);
  const cid = decodedPart1 + decodedPart2;
  return cid;
}
