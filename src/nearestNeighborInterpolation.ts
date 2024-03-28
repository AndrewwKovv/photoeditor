// nearestNeighborInterpolation.ts

/**
 * Функция для изменения размера изображения с использованием алгоритма ближайшего соседа.
 * @param imageData - Объект ImageData исходного изображения.
 * @param newWidth - Новая ширина изображения.
 * @param newHeight - Новая высота изображения.
 * @returns Объект ImageData нового измененного изображения.
 */
export function nearestNeighborInterpolation(
  imageData: ImageData,
  newWidth: number,
  newHeight: number
): ImageData {
  const srcWidth = imageData.width;
  const srcHeight = imageData.height;
  const srcData = imageData.data;

  const scaleX = srcWidth / newWidth;
  const scaleY = srcHeight / newHeight;

  const destData = new Uint8ClampedArray(newWidth * newHeight * 4);

  for (let y = 0; y < newHeight; ++y) {
    for (let x = 0; x < newWidth; ++x) {
      const srcX = Math.min(Math.round(x * scaleX), srcWidth - 1);
      const srcY = Math.min(Math.round(y * scaleY), srcHeight - 1);

      const srcIndex = (srcY * srcWidth + srcX) * 4;
      const destIndex = (y * newWidth + x) * 4;

      destData[destIndex] = srcData[srcIndex]; // R
      destData[destIndex + 1] = srcData[srcIndex + 1]; // G
      destData[destIndex + 2] = srcData[srcIndex + 2]; // B
      destData[destIndex + 3] = srcData[srcIndex + 3]; // A
    }
  }

  return new ImageData(destData, newWidth, newHeight);
}
