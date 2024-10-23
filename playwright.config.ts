import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		stdout: 'ignore',
		stderr: 'ignore' //TODO: remove when fixed - reason to have it now: stop supabase getUser warning to spam everything
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
