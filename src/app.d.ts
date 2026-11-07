// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			/** The page has its contents beside it from xl:, in a track of the root layout's grid. */
			contents?: boolean;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
