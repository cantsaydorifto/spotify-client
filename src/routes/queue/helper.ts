export function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const paddedMinutes = minutes === 0 ? '0' : minutes;
  const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;

  return `${hours > 0 ? `${hours}:` : ''}${paddedMinutes}:${paddedSeconds}`;
}

export async function getColor(imageSrc: string | null) {
  const colorRes = await fetch('/api/color?image=' + imageSrc);
  return colorRes ? (colorRes.json() as Promise<{ dominantColor: string }>) : Promise.resolve(null);
}
