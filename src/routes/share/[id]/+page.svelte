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

const copyToClipboard = async (code: string) => {
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
	<div class="max-w-3xl mx-auto p-4 md:p-8 w-full" in:fade={{ duration: 150 }}>
		<Card.Root>
			<Card.Header>
				<Card.Title tag="h2" class="text-primary">{title}</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="relative">
					<Button
						variant="outline"
						class="absolute top-4 right-6 z-10 plausible-event-name=Copy+Code"
						on:click={() => copyToClipboard(code)}
					>
						{#if isCopied}
							<CheckIcon size="16" class="mr-2" />
						{:else}
							<CopyIcon size="16" class="mr-2" />
						{/if}
						{copyButtonText}
					</Button>
					<div class="max-h-screen overflow-auto">
						<HighlightAuto class="text-sm text-wrap" {code} />
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Footer -->
		<p class="text-center tracking-wide text-muted-foreground mt-8">
			Saved on <a
				href="https://highlight.ing/apps/codeclippy"
				class="text-primary underline">CodeClippy</a
			>
			using
			<a href="https://highlight.ing" class="text-primary underline"
				>Highlight</a
			>
		</p>
	</div>
{/if}
