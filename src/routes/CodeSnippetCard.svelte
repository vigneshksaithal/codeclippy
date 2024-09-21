<script lang="ts">
import { Button } from '$lib/components/ui/button'
import * as Card from '$lib/components/ui/card'
import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
import ChevronDownIcon from 'lucide-svelte/icons/chevron-down'
import CopyIcon from 'lucide-svelte/icons/copy'
import ShareIcon from 'lucide-svelte/icons/share'
import Trash2Icon from 'lucide-svelte/icons/trash-2'
import { HighlightAuto } from 'svelte-highlight'

export let id: number
export let title: string
export let code: string
export let isCopied: boolean
export let onCopy: (id: number) => void
export let onShare: (snippet: {
	id: number
	title: string
	code: string
}) => void
export let onDelete: (id: number) => void
</script>

<Card.Root>
	<Card.Header>
		<div class="flex justify-between items-center">
			<Card.Title class="text-primary text-xl">{title}</Card.Title>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" size="icon" builders={[builder]}>
						<ChevronDownIcon size="24" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item
						class="flex justify-between"
						on:click={() => onShare({ id, title, code })}
					>
						<span>Share</span>
						<ShareIcon size="18" />
					</DropdownMenu.Item>
					<DropdownMenu.Item
						class="flex justify-between"
						on:click={() => onDelete(id)}
					>
						<span>Delete</span>
						<Trash2Icon size="16" />
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</Card.Header>
	<Card.Content>
		<div class="relative">
			<Button
				variant="outline"
				size="sm"
				class="bg-muted absolute top-4 right-4 z-10 plausible-event-name=Copy+Code flex gap-3"
				on:click={() => onCopy(id)}
			>
				{#if isCopied}
					Copied
				{:else}
					Copy
				{/if}
				<CopyIcon size="14" />
			</Button>
			<div class="max-h-80 overflow-auto">
				<HighlightAuto class="text-sm text-wrap" {code} />
			</div>
		</div>
	</Card.Content>
</Card.Root>
