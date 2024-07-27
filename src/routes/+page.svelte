<script lang="ts">
	import Highlight, { type HighlightContext } from '@highlight-ai/app-runtime'
	import { onMount } from 'svelte'
	import { HighlightAuto } from 'svelte-highlight'
	import atomOneLight from 'svelte-highlight/styles/atom-one-light'

	let codeSnippets: codeSnippet[] = []
	let codeSnippet: codeSnippet
	let selectedCodeSnippet: codeSnippet & { i: number } = {
		created_at: '',
		updated_at: '',
		title: '',
		description: '',
		code: '',
		i: 0,
	}

	let isModalOpen = false

	onMount(async () => {
		/**
		 * Check if it is running in Highlight
		 */
		if (typeof window.Highlight === 'undefined') {
			console.error('Highlight environment is not available')
			return
		}

		/**
		 * Reset code snippets
		 */
		codeSnippets = []

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
				console.log('Invoked')
				codeSnippet.title = context.suggestion || ''
				codeSnippet.created_at = new Date().toISOString()
				codeSnippet.updated_at = new Date().toISOString()

				/**
				 * Get code from Clipboard
				 */
				if (context.environment.clipboardText) {
					codeSnippet.code = context.environment.clipboardText
				}

				await saveCode(codeSnippet)
			},
		)
	})

	const saveCode = async ({
		created_at,
		updated_at,
		title,
		description,
		code,
	}: codeSnippet) => {
		codeSnippets.push({
			created_at: created_at,
			updated_at: updated_at,
			title: title,
			description,
			code: code,
		})
		codeSnippets = codeSnippets

		Highlight.appStorage.set('codeSnippets', codeSnippets)
	}

	const getCodeSnippets = async () => {
		return (await Highlight.appStorage.get('codeSnippets')) || []
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

{#if codeSnippets.length === 0}
	<!-- README -->
	<article class="readme">
		<header>
			<h1>CodeClippy</h1>
			<p>
				CodeClippy is a Highlight.ing app that helps you capture code snippets
				like Pieces.app without the complexity.
			</p>
		</header>

		<!-- svelte-ignore a11y-media-has-caption -->
		<video autoplay>
			<source src="/CodeClippy-Tutorial.mp4" type="video/mp4" />
			Your browser does not support the video tag.
		</video>

		<h4>How to use?</h4>
		<ol>
			<li>Copy the code snippet(Command/Ctrl + C) you would like to save.</li>
			<li>
				Then, hover over the Highlight app and select CodeClippy app by pressing
				Tab.
			</li>
			<li>Type a description or choose from the AI generated suggestions.</li>
			<li>That's all! Your code is saved in CodeClippy.</li>
			<li>
				You can access it anytime by just visiting CodeClippy in the Highlight
				app.
			</li>
		</ol>
		<p>Simple, right?</p>
		<p>
			<strong>Note: All data is stored only on your computer.</strong>
		</p>

		<footer>
			<small
				>For any bugs or suggestions, please reach out at contact [at]
				aithal.dev</small
			>
		</footer>
	</article>
{:else}
	<h1>CodeClippy</h1>
	<div class="grid">
		{#each codeSnippets as { created_at, updated_at, title, description, code }, i (i)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<article
				class="card"
				on:click={() => {
					isModalOpen = true

					selectedCodeSnippet = {
						created_at: created_at,
						description: description,
						code: code,
						updated_at: updated_at,
						title: title,
						i: i,
					}
				}}
			>
				<h6>{title}</h6>
			</article>
		{/each}
	</div>
{/if}

<!-- Import Atom One Light theme -->
<svelte:head>
	{@html atomOneLight}
</svelte:head>

<dialog open={isModalOpen}>
	<article>
		<h3>{selectedCodeSnippet.title}</h3>
		<HighlightAuto id="code" code={selectedCodeSnippet.code} />
		<footer>
			<button
				class="secondary outline"
				on:click={() => {
					deleteSnippet(selectedCodeSnippet.i)
					isModalOpen = false
				}}>Delete</button
			>
			<button
				class="secondary outline"
				on:click={() => {
					copyToClipboard()
					isModalOpen = false
				}}>Copy</button
			>
			<button class="secondary" on:click={() => (isModalOpen = false)}>
				Back
			</button>
		</footer>
	</article>
</dialog>

<style>
	.readme {
		max-width: 567px;
		margin: 0 auto;
	}

	.grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.card {
		width: 100%;
	}

	:global(#code) {
		font-size: 0.8rem;
	}

	video {
		width: 100%;
		height: auto;
		border-radius: 4px;
		margin-bottom: 1em;
	}
</style>
