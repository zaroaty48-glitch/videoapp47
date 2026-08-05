import { ChromaKeySettings } from '../types';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Applies chroma key green screen background removal toImageData buffer in-place.
 */
export function applyChromaKey(
  imageData: ImageData,
  settings: ChromaKeySettings
): void {
  if (!settings.enabled) return;

  const target = hexToRgb(settings.color);
  const data = imageData.data;
  const distThreshold = settings.distance * 255;
  const smooth = settings.smoothness * 255;
  const spillFactor = settings.spill;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Euclidean RGB distance
    const dr = r - target.r;
    const dg = g - target.g;
    const db = b - target.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    if (dist < distThreshold) {
      data[i + 3] = 0; // Fully transparent
    } else if (dist < distThreshold + smooth && smooth > 0) {
      const alphaFactor = (dist - distThreshold) / smooth;
      data[i + 3] = Math.min(data[i + 3], Math.floor(data[i + 3] * alphaFactor));

      // Spill suppression for green tint
      if (spillFactor > 0 && target.g > target.r && target.g > target.b) {
        const maxRB = Math.max(r, b);
        if (g > maxRB) {
          data[i + 1] = Math.floor(g - (g - maxRB) * spillFactor);
        }
      }
    } else {
      // Spill suppression on non-key pixels near edge
      if (spillFactor > 0 && target.g > target.r && target.g > target.b) {
        const maxRB = Math.max(r, b);
        if (g > maxRB) {
          data[i + 1] = Math.floor(g - (g - maxRB) * spillFactor);
        }
      }
    }
  }
}
