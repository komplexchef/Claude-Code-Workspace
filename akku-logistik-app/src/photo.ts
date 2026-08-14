export async function pickPhoto(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}

export async function compressImage(
  file: File,
  maxSize = 1280,
  quality = 0.7,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D-Kontext nicht verfügbar');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return canvas.toDataURL('image/jpeg', quality);
}

export function getBase64SizeKB(base64: string): number {
  const commaIdx = base64.indexOf(',');
  const raw = commaIdx >= 0 ? base64.slice(commaIdx + 1) : base64;
  return Math.round((raw.length * 3) / 4 / 1024);
}
