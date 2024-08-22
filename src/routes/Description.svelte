<script lang="ts">
import * as Card from '$lib/components/ui/card'

// biome-ignore lint/style/useConst: <explanation>
export let isHighlight = false
</script>

<div class="flex items-center justify-center min-h-screen">
	<Card.Root class="max-w-xl">
		<Card.Header>
			<Card.Title class="text-2xl font-bold">CodeClippy</Card.Title>
			<Card.Description class="text-base">
				CodeClippy is a Highlight.ing app that helps you capture and share code
				snippets effortlessly.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<h4 class="text-lg font-semibold mb-2">How to use it?</h4>
			<p>1. Just copy the code and invoke the app with Highlight.</p>
			<p>2. See the demo video below for more...</p>
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
