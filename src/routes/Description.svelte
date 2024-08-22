<script lang="ts">
import * as Card from '$lib/components/ui/card'

// biome-ignore lint/style/useConst: <explanation>
export let isHighlight = false
</script>

<div class="flex items-center justify-center min-h-screen">
	<Card.Root class="max-w-xl">
		<Card.Header>
			<Card.Title class="text-2xl font-bold">CodeClippy</Card.Title>
			<Card.Description>
				A Highlight.ing app for capturing code snippets with simplicity
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="mb-4">
				CodeClippy helps you capture code snippets like Pieces.app without the
				complexity.
			</p>
			<h4 class="text-xl font-semibold mb-2">How to use?</h4>
			<p>Just copy the code and invoke the app with Highlight.</p>
			<p class="mb-4 font-semibold">
				Note: All data is stored only on your computer.
			</p>
			{#if !isHighlight}
				<p class="text-sm text-muted-foreground">
					This app is designed to run inside the Highlight environment.
				</p>
			{/if}
			<div class="mt-6">
				<video autoplay loop muted class="w-full rounded-lg shadow-lg">
					<source src="/demo.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>
		</Card.Content>
	</Card.Root>
</div>
