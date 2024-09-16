<script lang="ts">
import * as Card from '$lib/components/ui/card'

export let isHighlight = false
</script>

<section
	class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4"
>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-4xl font-bold text-primary mb-2"
				>CodeClippy_</Card.Title
			>
			<Card.Description class="text-base text-slate-300">
				Capture and share code snippets effortlessly with Highlight.ing
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="space-y-4">
				<video autoplay loop muted class="w-full">
					<source src="/demo.mp4" type="video/mp4" />
				</video>
				<div class="p-4 rounded">
					<h4 class="text-2xl font-semibold mb-4 text-primary">How to use?</h4>
					<ol class="list-decimal list-inside space-y-4">
						<li>Copy any code snippet you want to save.</li>
						<li>
							Then invoke the Highlight app and select CodeClippy icon and enter
							or choose the title for the code snippet.
						</li>
						<li>
							Then it will be automatically saved and you can share it with
							others by clicking on the share button.
						</li>
					</ol>
				</div>
			</div>
			{#if !isHighlight}
				<p class="text-red-600 mt-8 text-center">
					[WARNING] This app is designed to run inside the Highlight.ing app.
					<br />
					<a
						href="https://highlight.ing"
						class="text-primary hover:underline"
						target="_blank"
					>
						Learn more about Highlight
					</a>
				</p>
			{/if}
		</Card.Content>
	</Card.Root>
</section>
