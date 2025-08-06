module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}', './blogposts/*.md'],
	theme: {
		extend: {
			colors: {
				'accent-color': '#4ff0ba',
				'accent-color-lighter': '#bef263',
				background: '#181a1a',
				'window-gray': '#2c3441'
			}
		}
	},
	plugins: []
};
