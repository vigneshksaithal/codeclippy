<script lang="ts">
import { Button } from '$lib/components/ui/button'
import * as Card from '$lib/components/ui/card'
import MetaTags from '$lib/MetaTags.svelte'
import { CopyIcon } from 'lucide-svelte'
import { HighlightAuto } from 'svelte-highlight'
import atomOneLight from 'svelte-highlight/styles/atom-one-light'
import type { PageData } from './$types'

export let data: PageData
const { title, code, url } = data

let copyButtonText = 'Copy'

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(code)
		copyButtonText = 'Copied!'
		setTimeout(() => {
			copyButtonText = 'Copy'
		}, 2000)
	} catch (err) {
		console.error('Failed to copy: ', err)
		copyButtonText = 'Failed'
	}
}
</script>

<MetaTags {title} {url} />

<!-- Import Atom One Light theme -->
<svelte:head>
	{@html atomOneLight}
</svelte:head>

<section class="mx-auto max-w-2xl py-8">
	<Card.Root>
		<Card.Header>
			<Card.Title>{title}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="relative">
				<HighlightAuto class="text-sm" {code} />
				<Button
					variant="outline"
					size="sm"
					class="absolute top-2 right-2"
					on:click={copyToClipboard}
				>
					<CopyIcon class="mr-2 h-4 w-4" />
					{copyButtonText}
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<p class="text-center text-sm text-muted-foreground mt-4">
		This code was saved on <a
			href="https://highlight.ing/apps/codeclippy"
			class="underline">CodeClippy</a
		>
		on <a href="https://highlight.ing" class="underline">Highlight</a>.
	</p>
</section>
