<script lang="ts">
	import Highlight, { type HighlightContext } from '@highlight-ai/app-runtime'
	import { onMount } from 'svelte'
	import { HighlightAuto } from 'svelte-highlight'
	import atomOneLight from 'svelte-highlight/styles/atom-one-light'

	let codeSnippets: codeSnippet[] = []
	const codeSnippet: codeSnippet = {
		created_at: '',
		updated_at: '',
		title: '',
		description: '',
		code: '',
	}

	onMount(async () => {
		/**
		 * Check if it is running in Highlight
		 */
		if (typeof window.Highlight === 'undefined') {
			console.error('Highlight environment is not available')
			return
		}

		codeSnippets = await getCodeSnippets()
	})

	const saveCode = async (snippet: codeSnippet) => {
		const newSnippet = {
			...snippet,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}

		codeSnippets.unshift(newSnippet)
		codeSnippets = codeSnippets

		Highlight.appStorage.set('codeSnippets', codeSnippets)
	}

	const getCodeSnippets = async () => {
		return (await Highlight.appStorage.get('codeSnippets')) || []
	}

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
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

	Highlight.app.addListener('onContext', async (context: HighlightContext) => {
		console.log('Invoked', context.suggestion)
		codeSnippet.title = context.suggestion || ''
		codeSnippet.created_at = new Date().toISOString()
		codeSnippet.updated_at = new Date().toISOString()

		/**
		 * Get code from Clipboard
		 */
		const attachments = context.attachments
		if (attachments) {
			attachments.forEach((attachment) => {
				if (attachment.type === 'clipboard') {
					codeSnippet.code = attachment.value
				}
			})
		}

		await saveCode(codeSnippet)
	})
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
	<div class="code-snippets__container">
		<h1>CodeClippy</h1>
		<div class="grid">
			{#each codeSnippets as { title, code }, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<article class="card">
					<header>
						<p style="margin-bottom: 0;">
							<strong>{title}</strong>
						</p>
					</header>
					<HighlightAuto class="code" {code} />
					<footer style="display: flex; gap: 0.8em; justify-content: right;">
						<button
							class="secondary outline"
							on:click={() => {
								deleteSnippet(i)
							}}>Delete</button
						>
						<button
							on:click={() => {
								copyToClipboard(code)
							}}>Copy</button
						>
					</footer>
				</article>
			{/each}
		</div>
	</div>
{/if}

<!-- Import Atom One Light theme -->
<svelte:head>
	{@html atomOneLight}
</svelte:head>

<style>
	.readme {
		max-width: 567px;
		margin: 0 auto;
	}

	.code-snippets__container {
		max-width: 640px;
		margin: 0 auto;
	}

	.grid {
		grid-template-columns: repeat(1, 1fr);
		max-width: 640px;
		margin: 0 auto;
	}

	.card {
		width: 100%;
		margin: 0 auto;
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
