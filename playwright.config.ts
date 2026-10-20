import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'pnpm run build && pnpm run preview', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}',
	// On CI, an HTML report as well: the workflow uploads playwright-report/, which the
	// default dot reporter never writes.
	reporter: process.env.CI ? [['dot'], ['html', { open: 'never' }]] : 'list',
	use: {
		// Browsers in Playwright's Docker image when scripts/with-browsers.ts started
		// them, installed ones otherwise. <loopback> sends the browser's localhost back
		// to this machine, where the preview server is.
		connectOptions: process.env.PLAYWRIGHT_WS_ENDPOINT
			? { wsEndpoint: process.env.PLAYWRIGHT_WS_ENDPOINT, exposeNetwork: '<loopback>' }
			: undefined
	}
});
