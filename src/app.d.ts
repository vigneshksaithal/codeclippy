declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type CodeSnippet = {
		id: number
		created_at: string
		updated_at: string
		title: string
		description: string
		code: string
	}
}

export type { }
