// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Snippet as SvelteSnippet } from "svelte";


declare global {
	// pre-import the type Snippet for JSDoc
	type Snippet<T extends unknown[] = []> = SvelteSnippet<T>;
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
