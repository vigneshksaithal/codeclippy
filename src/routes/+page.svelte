<script lang="ts">
	import Highlight, { type HighlightContext } from '@highlight-ai/app-runtime'
	import { onMount } from 'svelte'

	let codeSnippets: codeSnippet[] = []
	let codeSnippet: codeSnippet = {
		created_at: '',
		updated_at: '',
		title: '',
		description: '',
		code: '',
		language: '',
		tags: [],
	}
	let selectedCodeSnippet: codeSnippet & { i: number } = {
		created_at: '',
		updated_at: '',
		title: '',
		description: '',
		code: '',
		language: 'javascript',
		tags: [],
		i: 0,
	}

	let isModalOpen = false

	onMount(async () => {
		/**
		 * Wait till the Highlight app is hydrated
		 */
		await Highlight.appStorage.whenHydrated()

		/**
		 * Get code snippets on initial load
		 */
		codeSnippets = await getCodeSnippets()

		Highlight.app.addListener(
			'onContext',
			async (context: HighlightContext) => {
				console.log('Invoked', context)

				codeSnippet.title = context.suggestion || ''
				codeSnippet.created_at = new Date().toISOString()
				codeSnippet.updated_at = new Date().toISOString()

				/**
				 * Get code from Clipboard
				 */
				codeSnippet.code = context.environment.clipboardText || ''

				saveCode(codeSnippet)
			},
		)
	})

	const saveCode = async ({
		created_at: createdAt,
		updated_at: updatedAt,
		title,
		description,
		code,
		language,
		tags,
	}: codeSnippet) => {
		codeSnippets.push({
			created_at: createdAt,
			updated_at: updatedAt,
			title: title,
			description,
			code: code,
			language: language,
			tags: tags,
		})
		codeSnippets = codeSnippets

		Highlight.appStorage.set('codeSnippets', codeSnippets)
	}

	const getCodeSnippets = async () => {
		const kcodeSnippets = (await Highlight.appStorage.get('codeSnippets')) || []

		return kcodeSnippets
	}

	const copyToClipboard = async () => {
		const element = document.getElementById('code') as HTMLElement
		try {
			await navigator.clipboard.writeText(element.innerText)
			alert('Code copied successfully!')
		} catch (error) {
			console.error('Failed to copy text', error)
			alert('Failed to copy code :(')
		}
	}

	const deleteSnippet = (i: number) => {
		codeSnippets.splice(i, 1)
		codeSnippets = codeSnippets

		Highlight.appStorage.set('codeSnippets', codeSnippets)
	}
</script>

<div class="grid">
	{#each codeSnippets as { created_at, updated_at, title, description, code }, i (i)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<article
			on:click={() => {
				isModalOpen = true
				console.log('clicked', codeSnippet)
				selectedCodeSnippet = {
					created_at: created_at,
					description: description,
					code: code,
					language: 'javascript',
					updated_at: updated_at,
					title: title,
					tags: [],
					i: i,
				}
			}}
		>
			<h6>{title}</h6>
		</article>
	{/each}
</div>

<dialog open={isModalOpen}>
	<article>
		<h2>{selectedCodeSnippet.title}</h2>
		<pre><code id="code" contenteditable="true">{selectedCodeSnippet.code}</code
			></pre>
		<footer>
			<button
				class="secondary outline"
				on:click={() => {
					deleteSnippet(selectedCodeSnippet.i)
					isModalOpen = false
				}}>Delete</button
			>
			<button class="secondary outline" on:click={copyToClipboard}>Copy</button>
			<button class="secondary" on:click={() => (isModalOpen = false)}>
				Back
			</button>
		</footer>
	</article>
</dialog>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}
</style>
