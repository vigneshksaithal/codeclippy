<script lang="ts">
import * as Card from '$lib/components/ui/card'

export let isHighlight = false
</script>

<section
	class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-4xl font-bold text-primary mb-2"
				>CodeClippy_</Card.Title
			>
			<Card.Description class="text-base text-slate-300" >
				Easily capture and share code snippets with Highlight.ing.
				{#if !isHighlight}
				<p class="text-red-400 text-center">
					[WARNING] This app is designed to run inside the Highlight.ing app.
					</p>
				{/if}
			</Card.Description>
		</Card.Header>
		
		<Card.Content class="space-y-4">
			<video autoplay loop muted controls class="w-full">
				<source src="/demo.mp4" type="video/mp4" />
			</video>
			<div class="px- rounded">
				<h4 class="text-2xl font-semibold mb-4 text-primary">How to use?</h4>
				<ol class="list-decimal list-inside space-y-4">
					<li>
						Copy any code snippet you want to save. Like on a website,
						documentation page, etc.
					</li>
					<li>
						Then trigger the Highlight app, select the CodeClippy icon, and set
						a title for your snippet.
					</li>
					<li>
						It will save automatically, allowing you to share via the share
						button.
					</li>
				</ol>
			</div>
		</Card.Content>
	</Card.Root>
</section>
