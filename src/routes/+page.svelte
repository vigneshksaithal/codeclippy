<script lang="ts">
import MetaTags from '$lib/MetaTags.svelte'
import { Input } from '$lib/components/ui/input'
import { pb } from '$lib/pocketbase'
import Highlight, { type HighlightContext } from '@highlight-ai/app-runtime'
import Fuse from 'fuse.js'
import { onDestroy, onMount } from 'svelte'
import atomOneDark from 'svelte-highlight/styles/atom-one-dark'
import { toast } from 'svelte-sonner'
import { fade } from 'svelte/transition'
import CodeSnippetCard from './CodeSnippetCard.svelte'
import Description from './Description.svelte'

let codeSnippets: (CodeSnippet & {
	sharing?: boolean
	copied?: boolean
	linkCopied?: boolean
})[] = []
let query = ''
let isHighlight = false
let destroyHighlightListener: () => void

onMount(async () => {
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

					const newSnippet: CodeSnippet = {
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

					saveCode(newSnippet)
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
		destroyHighlightListener()
	}
})

const showToast = (
	message: string,
	type: 'success' | 'error' = 'success',
): void => {
	toast[type](message)
}

const copyToClipboard = async (id: number): Promise<void> => {
	const snippet = codeSnippets.find((s) => s.id === id)
	if (!snippet) return

	try {
		await navigator.clipboard.writeText(snippet.code)
		codeSnippets = codeSnippets.map((s) =>
			s.id === id ? { ...s, copied: true } : s,
		)
		setTimeout(() => {
			codeSnippets = codeSnippets.map((s) =>
				s.id === id ? { ...s, copied: false } : s,
			)
		}, 3000)
	} catch (error) {
		console.error('Failed to copy text', error)
		showToast('Failed to copy text', 'error')
	}
}

const deleteSnippet = (id: number): void => {
	codeSnippets = codeSnippets.filter((snippet) => snippet.id !== id)
	Highlight.appStorage.set('codeSnippets', codeSnippets)

	showToast('Code snippet deleted successfully!')
}

const saveCode = (snippet: CodeSnippet): void => {
	codeSnippets = [snippet, ...codeSnippets]
	Highlight.appStorage.set('codeSnippets', codeSnippets)
}

const getCodeSnippets = async (): Promise<CodeSnippet[]> => {
	return (await Highlight.appStorage.get('codeSnippets')) ?? []
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
}): Promise<void> => {
	codeSnippets = codeSnippets.map((s) =>
		s.id === snippet.id ? { ...s, sharing: true } : s,
	)
	try {
		const { id } = await pb.collection('codes').create({
			title: snippet.title,
			code: snippet.code,
		})
		const shareUrl = `${window.location.origin}/share/${id}`
		await navigator.clipboard.writeText(shareUrl)
		codeSnippets = codeSnippets.map((s) =>
			s.id === snippet.id ? { ...s, sharing: false, linkCopied: true } : s,
		)
		showToast('Share link generated and copied to clipboard!', 'success')
		setTimeout(() => {
			codeSnippets = codeSnippets.map((s) =>
				s.id === snippet.id ? { ...s, linkCopied: false } : s,
			)
		}, 3000)
	} catch (error) {
		console.error('Error sharing code:', error)
		showToast('Failed to share code. Please try again.', 'error')
		codeSnippets = codeSnippets.map((s) =>
			s.id === snippet.id ? { ...s, sharing: false } : s,
		)
	}
}
</script>

<MetaTags />

<!-- Import Atom One Light theme -->
<svelte:head>
	{@html atomOneDark}
</svelte:head>

<section class="max-w-3xl mx-auto p-8">
	{#if isHighlight && codeSnippets.length > 0}
		<!-- Title Text -->
		<div class="flex gap-12 justify-between items-center mb-8">
			<div class="flex gap-2 justify-start items-center">
				<h1 class="text-4xl font-extrabold text-primary">CodeClippy</h1>
			</div>
			<Input
				type="search"
				placeholder="Search"
				aria-label="Search"
				bind:value={query}
			/>
		</div>

		<div class="grid grid-cols-1 gap-6" transition:fade={{ duration: 250 }}>
			<!-- Search Results -->
			{#if query !== ''}
				{#each searchCode(query) as result}
					<CodeSnippetCard
						id={result.item.id}
						title={result.item.title}
						code={result.item.code}
						isCopied={result.item.copied || false}
						onCopy={copyToClipboard}
						onShare={shareCode}
						onDelete={(id) => {
							deleteSnippet(id)
							query = ''
						}}
					/>
				{/each}
			{:else}
				{#each codeSnippets as snippet}
					<CodeSnippetCard
						id={snippet.id}
						title={snippet.title}
						code={snippet.code}
						isCopied={snippet.copied ?? false}
						onCopy={copyToClipboard}
						onShare={shareCode}
						onDelete={deleteSnippet}
					/>
				{/each}
			{/if}
		</div>
	{:else}
		<Description {isHighlight} />
	{/if}
</section>
