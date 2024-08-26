<script lang="ts">
import MetaTags from '$lib/MetaTags.svelte'
import { Button } from '$lib/components/ui/button'
import * as Card from '$lib/components/ui/card'
import CheckIcon from 'lucide-svelte/icons/check'
import CopyIcon from 'lucide-svelte/icons/copy'
import { onMount } from 'svelte'
import { HighlightAuto } from 'svelte-highlight'
import atomOneDark from 'svelte-highlight/styles/atom-one-dark'
import { fade } from 'svelte/transition'
import type { PageData } from './$types'

export let data: PageData
const { title, code, url } = data

let copyButtonText = 'Copy'
let isCopied = false
let isPageLoaded = false

onMount(() => {
	isPageLoaded = true
})

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(code)
		isCopied = true
		copyButtonText = 'Copied!'
		setTimeout(() => {
			isCopied = false
			copyButtonText = 'Copy'
		}, 2000)
	} catch (err) {
		console.error('Failed to copy: ', err)
		copyButtonText = 'Failed'
	}
}
</script>

<MetaTags {title} {url} />

<svelte:head>
	{@html atomOneDark}
</svelte:head>

{#if isPageLoaded}
	<section
		class="mx-auto max-w-3xl py-12 px-4"
		in:fade={{ duration: 300, delay: 150 }}
	>
		<Card.Root
			class="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl"
		>
			<Card.Header
				class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6"
			>
				<Card.Title class="text-2xl font-bold">{title}</Card.Title>
			</Card.Header>
			<Card.Content class="p-6 bg-gray-50 dark:bg-gray-800">
				<div class="relative rounded-lg overflow-hidden">
					<div class="max-h-[70vh] overflow-y-auto p-4 bg-gray-900">
						<HighlightAuto class="text-sm" {code} />
					</div>
					<div class="absolute top-2 right-2">
						<Button variant="secondary" size="sm" on:click={copyToClipboard}>
							{#if isCopied}
								<CheckIcon class="mr-2 size-4" />
							{:else}
								<CopyIcon class="mr-2 size-4" />
							{/if}
							{copyButtonText}
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<p class="text-center text-sm text-muted-foreground mt-6">
			This code was saved on <a
				href="https://highlight.ing/apps/codeclippy"
				class="text-blue-500 hover:text-blue-600 transition-colors duration-300 underline"
				>CodeClippy</a
			>
			using
			<a
				href="https://highlight.ing"
				class="text-purple-500 hover:text-purple-600 transition-colors duration-300 underline"
				>Highlight</a
			>.
		</p>
	</section>
{/if}
