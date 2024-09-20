<script lang="ts">
import { Button } from '$lib/components/ui/button'
import * as Card from '$lib/components/ui/card'
import CheckIcon from 'lucide-svelte/icons/check'
import CopyIcon from 'lucide-svelte/icons/copy'
import { HighlightAuto } from 'svelte-highlight'

export let title: string
export let code: string

let copyButtonText = 'Copy'
let isCopied = false

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

<Card.Root>
	<Card.Header>
		<Card.Title tag="h2" class="text-primary">{title}</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="relative">
			<Button
				variant="outline"
				class="bg-muted absolute top-4 right-4 z-10 plausible-event-name=Copy+Code"
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
