export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Force output size to 1000x1000 for high quality
  const targetSize = 1000;
  canvas.width = targetSize;
  canvas.height = targetSize;

  // Ensure transparent background
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, targetSize, targetSize);

  // Create circular clip path
  ctx.beginPath();
  ctx.arc(targetSize / 2, targetSize / 2, targetSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw the image: extract the crop area and scale it up to targetSize
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetSize,
    targetSize
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, 'image/png', 1.0);
  });
}
