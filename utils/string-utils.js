/**
 *
 * @param {*} str
 * @param {*} isFirstCapital
 * @returns
 */
export function camelize(str, isFirstCapital = false) {
  let newStr = str
    .trim()
    .replace(/[^a-z0-9 .]/gi, "")
    .replace(/^\d+/g, "")
    .replace(/^ +/g, "")
    .replace(".", " ")
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  if (isFirstCapital) {
    let firstLetter = newStr.charAt(0);
    newStr = firstLetter.toUpperCase() + newStr.substring(1);
  }
  return newStr;
}

/**
 *
 * @param {*} _str
 * @returns
 */
export function extractSlug(_str) {
  let str = _str.split("/");
  return `${str[str.length - 1]}`;
}

/**
 *
 * @param {*} description
 * @returns
 */
export function descriptionShortener(description) {
  let words = [];
  let currentLength = 0;
  let shortened = false;
  for (const word of description.split(" ")) {
    // +1 for the space
    if (currentLength + word.length + 1 > MAX_LENGTH) {
      shortened = true;
      break;
    }
    words.push(word);
    currentLength += word.length + 1;
  }
  if (words[words.length - 1].length < 4) {
    words = words.slice(0, -1);
  }
  if (words[words.length - 1].endsWith(".")) {
    return words.join(" ");
  }
  if (!shortened) {
    return words.join(" ");
  }
  return `${words.join(" ")} ...`;
}
