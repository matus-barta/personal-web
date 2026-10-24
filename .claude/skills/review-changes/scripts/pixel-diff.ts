/*
 * Compares two sets of screenshots from screenshots.ts pixel by pixel:
 *
 *     node .claude/skills/review-changes/scripts/pixel-diff.ts <dir> <before> <after>
 *
 * For each pair - <name>_<before>.png and <name>_<after>.png - it prints how many pixels
 * differ in the top 100px, where the floating nav sits, and below it, with the rows the
 * differences below it span, and writes DIFF_<name>.png for a pair with any: the before
 * picture dimmed, the differing pixels red. A pixel differs when its red, green and blue
 * move by more than 24 in all, which leaves out antialiasing noise.
 */

import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const [dir, before, after] = process.argv.slice(2);
if (!dir || !before || !after) {
	console.error('Usage: pixel-diff.ts <dir> <before> <after>');
	process.exit(2);
}

const NAV_BAND = 100;
const THRESHOLD = 24;

const read = (file: string) => sharp(join(dir, file)).raw().toBuffer({ resolveWithObject: true });

const rows: string[] = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith(`_${before}.png`))) {
	const pair = file.slice(0, -`_${before}.png`.length);
	const [a, b] = await Promise.all([read(file), read(`${pair}_${after}.png`)]);
	const { width, height, channels } = a.info;
	if (b.info.width !== width || b.info.height !== height) {
		rows.push(`${pair}\tsizes differ`);
		continue;
	}

	let nav = 0;
	let rest = 0;
	let top = Infinity;
	let bottom = -1;
	const out = Buffer.alloc(width * height * 3);
	for (let p = 0; p < width * height; p++) {
		const i = p * channels;
		const d =
			Math.abs(a.data[i] - b.data[i]) +
			Math.abs(a.data[i + 1] - b.data[i + 1]) +
			Math.abs(a.data[i + 2] - b.data[i + 2]);
		const y = Math.floor(p / width);
		if (d > THRESHOLD) {
			out[p * 3] = 255;
			if (y < NAV_BAND) nav++;
			else {
				rest++;
				top = Math.min(top, y);
				bottom = Math.max(bottom, y);
			}
		} else {
			out[p * 3] = out[p * 3 + 1] = out[p * 3 + 2] = a.data[i] / 3;
		}
	}
	if (nav || rest) {
		await sharp(out, { raw: { width, height, channels: 3 } })
			.png()
			.toFile(join(dir, `DIFF_${pair}.png`));
	}
	rows.push([pair, nav, rest, rest ? `${top}-${bottom}` : ''].join('\t'));
}

console.log(['pair', 'nav band', 'below', 'rows below'].join('\t'));
console.log(rows.sort().join('\n'));
