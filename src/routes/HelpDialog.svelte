<script lang="ts">
import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
import Highlight from "@highlight-ai/app-runtime"
import CircleHelp from "lucide-svelte/icons/circle-help"
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="fixed bottom-8 left-8"
		><CircleHelp size="32" /></DropdownMenu.Trigger
	>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item href="/" on:click={async () => {
				Highlight.appStorage.delete('codeSnippets')
				location.reload()
			}}>Reset</DropdownMenu.Item>
			<DropdownMenu.Item href="https://tally.so/r/3N0jdb" target="_blank"
				>Feedback</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
