<script lang="ts">
import MetaTags from "$lib/MetaTags.svelte"
import { Button } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import CheckIcon from "lucide-svelte/icons/check"
import CopyIcon from "lucide-svelte/icons/copy"
import { onMount } from "svelte"
import { HighlightAuto } from "svelte-highlight"
import greenScreen from "svelte-highlight/styles/green-screen"
import { fade } from "svelte/transition"
import type { PageData } from "./$types"

export let data: PageData
const { title, code, url } = data

let copyButtonText = "Copy"
let isCopied = false
let isPageLoaded = false

onMount(() => {
	isPageLoaded = true
})

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(code)
		isCopied = true
		copyButtonText = "Copied!"
		setTimeout(() => {
			isCopied = false
			copyButtonText = "Copy"
		}, 2000)
	} catch (err) {
		console.error("Failed to copy: ", err)
		copyButtonText = "Failed"
	}
}
</script>

<MetaTags {title} {url} />

<svelte:head>
	{@html greenScreen}
</svelte:head>

{#if isPageLoaded}
	<div
		class="max-w-2xl mx-auto p-4 md:p-8 w-full"
		in:fade={{ delay: 50, duration: 100 }}
	>
		<h3 class="text-3xl font-extrabold text-primary mb-4">CodeClippy</h3>

		<Card.Root>
			<Card.Header>
				<Card.Title class="text-primary tracking-normal">{title}</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="max-h-[70vh] overflow-y-auto">
					<HighlightAuto class="text-sm" {code} />
				</div>
			</Card.Content>
			<Card.Footer class="flex gap-2 justify-end">
				<Button
					variant="outline"
					class="plausible-event-name=Copy+Code"
					on:click={copyToClipboard}
				>
					{#if isCopied}
						<CheckIcon class="mr-2 w-4 h-4" />
					{:else}
						<CopyIcon class="mr-2 w-4 h-4" />
					{/if}
					{copyButtonText}
				</Button>
			</Card.Footer>
		</Card.Root>

		<p class="text-center text-sm text-muted-foreground mt-4">
			Saved on <a
				href="https://highlight.ing/apps/codeclippy"
				class="text-primary hover:underline">CodeClippy</a
			>
			using
			<a href="https://highlight.ing" class="text-primary hover:underline"
				>Highlight</a
			>.
		</p>
	</div>
{/if}
