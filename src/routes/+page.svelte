<script lang="ts">
import { pb } from '$lib/pocketbase'
import Highlight, { type HighlightContext } from '@highlight-ai/app-runtime'
import Fuse from 'fuse.js'
import { onDestroy, onMount } from 'svelte'
import { HighlightAuto } from 'svelte-highlight'
import atomOneLight from 'svelte-highlight/styles/atom-one-light'
import { fade } from 'svelte/transition'
import Navbar from './Navbar.svelte'
import ReadMe from './ReadMe.svelte'

let codeSnippets: (codeSnippet & { isSharing?: boolean })[] = []
// biome-ignore lint/style/useConst: <explanation>
let query = ''
let isHighlight = false
let isReady = false
let destroyHighlightListener: () => void

onMount(async () => {
	isReady = true

	if (typeof Highlight !== 'undefined' && Highlight.isRunningInHighlight) {
		isHighlight = Highlight.isRunningInHighlight()

		if (isHighlight) {
			codeSnippets = await getCodeSnippets()

			console.log('Setting up Highlight listener')
			destroyHighlightListener = Highlight.app.addListener(
				'onContext',
				async (context: HighlightContext) => {
					console.log('onContext event received', context)
					if (!context.suggestion) return

					const newSnippet: codeSnippet = {
						id: generateId(),
						title: context.suggestion,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
						description: '',
						code: '',
					}

					const attachments = context.attachments
					if (attachments) {
						for (const attachment of attachments) {
							if (attachment.type === 'clipboard') {
								newSnippet.code = attachment.value
							}
						}
					}

					await saveCode(newSnippet)
				},
			)
			console.log('Highlight listener set up successfully')
		}
	} else {
		console.warn(
			'This app is not running inside Highlight. Some features may be limited.',
		)
	}
})

onDestroy(() => {
	if (isHighlight && destroyHighlightListener) {
		console.log('Destroying Highlight listener')
		destroyHighlightListener()
	}
})

const saveCode = (snippet: codeSnippet): void => {
	codeSnippets = [snippet, ...codeSnippets]
	if (isHighlight) {
		Highlight.appStorage.set('codeSnippets', codeSnippets)
	}
}

const getCodeSnippets = async (): Promise<codeSnippet[]> => {
	if (isHighlight) {
		return (await Highlight.appStorage.get('codeSnippets')) ?? []
	}
	return []
}

const copyToClipboard = async (
	text: string,
	message = 'Code copied successfully!',
): Promise<void> => {
	try {
		await navigator.clipboard.writeText(text)
		alert(message)
	} catch (error) {
		console.error('Failed to copy text', error)
		alert('Failed to copy code :(')
	}
}

const deleteSnippet = (id: number): void => {
	codeSnippets = codeSnippets.filter((snippet) => snippet.id !== id)
	if (isHighlight) {
		Highlight.appStorage.set('codeSnippets', codeSnippets)
	}
}

const searchCode = (query: string) => {
	const fuse = new Fuse(codeSnippets, { keys: ['title'] })
	return fuse.search(query)
}

const generateId = (): number => Math.floor(Math.random() * 1000000)

const shareCode = async (snippet: {
	id: number
	title: string
	code: string
}) => {
	codeSnippets = codeSnippets.map((s) =>
		s.id === snippet.id ? { ...s, isSharing: true } : s,
	)
	try {
		const record = await pb.collection('codes').create({
			title: snippet.title,
			code: snippet.code,
		})
		const shareUrl = `${window.location.origin}/share/${record.id}`
		await copyToClipboard(shareUrl, 'Share URL copied to clipboard')
	} catch (error) {
		console.error('Error sharing code:', error)
		alert('Failed to share code. Please try again.')
	}
	codeSnippets = codeSnippets.map((s) =>
		s.id === snippet.id ? { ...s, isSharing: false } : s,
	)
}
</script>

<!-- Import Atom One Light theme -->
<svelte:head>
	{@html atomOneLight}
</svelte:head>

<Navbar />
<!-- Reset & Feedback text -->
<p>
	<small
		>If you are facing bugs, <a
			href="/#"
			on:click={() => {
				codeSnippets = []
				if (isHighlight) {
					Highlight.appStorage.delete('codeSnippets')

					codeSnippets = []
					codeSnippets = codeSnippets
				}
			}}>reset here</a
		>. For giving feedback
		<a href="https://tally.so/r/3N0jdb" target="_blank">click here</a></small
	>
</p>
<input
	type="search"
	placeholder="Search"
	aria-label="Search"
	bind:value={query}
/>

{#if isHighlight && codeSnippets.length > 0 && isReady}
	<div
		class="code-snippets__container"
		transition:fade={{ delay: 250, duration: 500 }}
	>
		<div class="grid" style="grid-template-columns: repeat(1, 1fr);">
			<!-- Search Results -->
			{#if query !== ''}
				{#each searchCode(query) as result}
					<article class="card">
						<header>
							<p>{result.item.title}</p>
						</header>
						<HighlightAuto id="code" code={result.item.code} />
						<footer style="display: flex; gap: 0.8em; justify-content: right;">
							<button
								class="secondary outline"
								on:click={() => {
									deleteSnippet(result.item.id)
									query = ''
								}}>Delete</button
							>
							<button
								class="secondary outline"
								on:click={() =>
									shareCode({
										id: result.item.id,
										title: result.item.title,
										code: result.item.code,
									})}
								aria-busy={result.item.isSharing}
							>
								{#if result.item.isSharing}
									Sharing...
								{:else}
									Share
								{/if}
							</button>
							<button
								class="outline"
								on:click={() => {
									copyToClipboard(result.item.code)
								}}>Copy</button
							>
						</footer>
					</article>
				{/each}
			{:else}
				{#each codeSnippets as { id, title, code }, i}
					<article>
						<p>{title}</p>
						<HighlightAuto id="code" {code} />
						<footer style="display: flex; gap: 0.8em; justify-content: right;">
							<button
								class="secondary outline"
								on:click={() => {
									deleteSnippet(id)
								}}>Delete</button
							>
							<button
								class="secondary outline"
								on:click={() => shareCode({ id, title, code })}
								aria-busy={codeSnippets.find((s) => s.id === id)?.isSharing}
							>
								{#if codeSnippets.find((s) => s.id === id)?.isSharing}
									Sharing...
								{:else}
									Share
								{/if}
							</button>
							<button
								class="primary outline"
								on:click={() => {
									copyToClipboard(code)
								}}>Copy</button
							>
						</footer>
					</article>
				{/each}
			{/if}
		</div>
	</div>
{:else}
	<ReadMe {isHighlight} />
{/if}

<style>
:global(#code) {
	font-size: 0.8rem;
	max-height: 240px;
}
</style>
