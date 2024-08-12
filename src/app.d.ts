// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type codeSnippet = {
		id: number
		created_at: string
		updated_at: string
		title: string
		description: string
		code: string
	}
}

export type { }
