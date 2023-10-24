export function arrayBufferToBase64(buffer, image) {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  let base64 = btoa(binary);
  return `data:${image.type};base64,${base64}`;
}

export function blobToBase64(blob) {
  let reader = new FileReader();
  reader.readAsDataURL(blob);
  let res;
  reader.onload = () => {
    res = reader.result;
  };
  return res;
}

//canvas to  arraybuffer

// var imageData = context.getImageData(x, y, w, h);
// var buffer = imageData.data.buffer;  // ArrayBuffer

//or

// const imageIn = document.querySelector('#image-in');
// const imageOut = document.querySelector('#image-out');
// const canvas = document.querySelector('#canvas');
// const imageDataByteLen = document.querySelector('#imagedata-byte-length');
// const bufferByteLen = document.querySelector('#arraybuffer-byte-length');

// const mimeType = 'image/png';

// imageIn.addEventListener('load', () => {

// 	// Draw image to canvas.
// 	canvas.width = imageIn.width;
// 	canvas.height = imageIn.height;
// 	const ctx = canvas.getContext('2d');
//   ctx.drawImage(imageIn, 0, 0);

//   // Convert canvas to ImageData.
//   const imageData = ctx.getImageData(0, 0, imageIn.width, imageIn.height);
//   imageDataByteLen.textContent = imageData.data.byteLength + ' bytes.';

//   // Convert canvas to Blob, then Blob to ArrayBuffer.
//   canvas.toBlob((blob) => {
//     const reader = new FileReader();
//     reader.addEventListener('loadend', () => {
//       const arrayBuffer = reader.result;
//       bufferByteLen.textContent = arrayBuffer.byteLength + ' bytes.';

//       // Dispay Blob content in an Image.
//       const blob = new Blob([arrayBuffer], {type: mimeType});
//       imageOut.src = URL.createObjectURL(blob);
//     });
//     reader.readAsArrayBuffer(blob);
//   }, mimeType);

// });
