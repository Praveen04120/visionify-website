export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set canvas size to match the bounding box of the rotated image.
  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));
  
  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);
  
  // Create final crop canvas
  const cropCanvas = document.createElement('canvas');
  const cropCtx = cropCanvas.getContext('2d');
  
  if (!cropCtx) {
    return null;
  }
  
  // Set to crop size
  cropCanvas.width = pixelCrop.width;
  cropCanvas.height = pixelCrop.height;

  // We want to extract a square that contains our circular mask, 
  // but let's actually draw a circle and clip to it, so the corners are transparent!
  cropCtx.fillStyle = 'transparent';
  cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);

  cropCtx.beginPath();
  cropCtx.arc(cropCanvas.width / 2, cropCanvas.height / 2, cropCanvas.width / 2, 0, Math.PI * 2);
  cropCtx.closePath();
  cropCtx.clip(); // Everything drawn after this will be clipped to the circle

  cropCtx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  return new Promise((resolve) => {
    cropCanvas.toBlob((file) => {
      resolve(file);
    }, 'image/png'); // Use PNG to preserve transparency for the circular edges
  });
}
