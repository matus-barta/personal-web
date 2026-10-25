/*
 * Screenshots every page a build serves, for comparing two builds pixel by pixel
 * (pixel-diff.ts). Run it through scripts/with-browsers.ts, which starts the browsers:
 *
 *     node scripts/with-browsers.ts node .claude/skills/review-changes/scripts/screenshots.ts \
 *         <out-dir> <label> <port> [dark|light]
 *
 * The pages are the ones in build/ - this checkout's, the branch's - plus an unknown URL for the
 * 404 page. Each is shot in Chromium, Firefox and WebKit, 1280 and 390px wide, at the top and
 * scrolled down, as <engine>_<width>_<page>_<top|scrolled>_<label>.png. Motion is reduced and
 * Math.random pinned - the 404 page picks a message at random - so two builds of the same page
 * come out the same. A mode, when given, is stored where mode-watcher reads it.
 */

import { chromium, firefox, webkit } from '@playwright/test';
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [outDir, label, port, mode] = process.argv.slice(2);
if (!outDir || !label || !port) {
	console.error('Usage: screenshots.ts <out-dir> <label> <port> [dark|light]');
	process.exit(2);
}
mkdirSync(outDir, { recursive: true });

// every prerendered page's path, as the end-to-end specs list them; 404.html is the fallback shell
const paths = readdirSync('build', { recursive: true, encoding: 'utf8' })
	.filter((file) => file.endsWith('.html') && file !== '404.html')
	.map((file) => '/' + file.replace(/(index)?\.html$/, ''));
paths.push('/no-such-page');

const name = (path: string) => path.replace(/^\/$/, 'home').replace(/^\//, '').replaceAll('/', '-');

for (const [engineName, engine] of Object.entries({ chromium, firefox, webkit })) {
	const browser = await engine.connect(process.env.PLAYWRIGHT_WS_ENDPOINT!, {
		exposeNetwork: '<loopback>' // the browser's localhost is this machine's, where the server runs
	});
	for (const width of [1280, 390]) {
		const context = await browser.newContext({
			viewport: { width, height: 800 },
			reducedMotion: 'reduce'
		});
		await context.addInitScript((stored) => {
			Math.random = () => 0;
			if (stored) localStorage.setItem('mode-watcher-mode', stored);
		}, mode ?? '');
		const page = await context.newPage();
		for (const path of paths) {
			await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle' });
			await page.waitForTimeout(300);
			const file = (position: string) =>
				join(outDir, [engineName, width, name(path), position, label].join('_') + '.png');
			await page.screenshot({ path: file('top') });
			await page.evaluate(() => window.scrollTo(0, 700));
			await page.waitForTimeout(500);
			await page.screenshot({ path: file('scrolled') });
		}
		await context.close();
	}
	await browser.close();
}
console.log(`${paths.length} pages, ${paths.length * 12} screenshots in ${outDir}`);
