import { json } from '@sveltejs/kit';
import Vibrant from 'node-vibrant';

export async function GET({ url, fetch }) {
  const imageUrl = url.searchParams.get('image');
  if (!imageUrl) return json({ color: null });
  const imageRes = await fetch(imageUrl);
  const image = imageRes.ok ? await imageRes.arrayBuffer() : null;
  if (!image) return json({ color: null });
  const stats = await Vibrant.from(Buffer.from(image))
    .getPalette()
    .then((palette) => {
      return palette;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
  if (!stats || !stats.Vibrant) return json({ color: null });
  const [r, g, b] = stats.Vibrant.rgb;
  return json({ dominantColor: `rgb(${r},${g},${b})` });
}
