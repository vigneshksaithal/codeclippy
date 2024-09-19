<script lang="ts">
import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
import Highlight from '@highlight-ai/app-runtime'
import CircleHelp from 'lucide-svelte/icons/circle-help'
import MessageSquare from 'lucide-svelte/icons/message-square'
import RefreshCw from 'lucide-svelte/icons/refresh-cw'
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="fixed bottom-8 left-8"
		><CircleHelp size="32" /></DropdownMenu.Trigger
	>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item
				class="flex justify-between"
				href="/"
				on:click={async () => {
					Highlight.appStorage.delete('codeSnippets')
					location.reload()
				}}
			>
				<span>Reset</span>
				<RefreshCw size="16" />
			</DropdownMenu.Item>
			<DropdownMenu.Item
				class="flex justify-between"
				href="https://tally.so/r/3N0jdb"
				target="_blank"
			>
				<span>Feedback</span>
				<MessageSquare size="16" />
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
