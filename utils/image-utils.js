export async function imageUrlFromArrayFile(_file) {
  const arrayBuffer = await _file.arrayBuffer();
  const arrayBufferView = new Uint8Array(arrayBuffer);
  const blob = new Blob([arrayBufferView], { type: _file.type });
  const urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(blob);
}

export function imageUrlFromBlob(_file) {
  const urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(_file);
}

export async function bufferFromBlob(_blob) {
  const arrayBuffer = await _blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}
