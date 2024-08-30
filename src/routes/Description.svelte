<script lang="ts">
import * as Card from "$lib/components/ui/card"
import { CopyIcon, ShareIcon } from "lucide-svelte"

// biome-ignore lint/style/useConst: <explanation>
export let isHighlight = false
</script>

<div class="flex items-center justify-center min-h-screen bg-black text-green-400 font-mono">
	<Card.Root class="max-w-3xl w-full m-4 bg-black border border-green-600 rounded-md shadow-lg shadow-green-500/20">
		<Card.Header class="text-center border-b border-green-600 p-4">
			<Card.Title class="text-4xl font-bold text-primary mb-2">CodeClippy_</Card.Title>
			<Card.Description class="text-lg text-primary">
				&gt; Capture and share code snippets effortlessly with Highlight.ing
			</Card.Description>
		</Card.Header>
		<Card.Content class="p-6">
			<div class="grid md:grid-cols-2 gap-8 items-center">
				<video autoplay loop muted class="w-full rounded border border-green-500">
					<source src="/demo.mp4" type="video/mp4" />
				</video>
				<div class="bg-black p-4 rounded border border-green-500">
					<h4 class="text-2xl font-semibold mb-4 text-primary">&gt; How it works:</h4>
					<ul class="space-y-4">
						<li class="flex items-center">
							<CopyIcon class="mr-3 text-green-500" />
							<span>$ copy_code_snippet</span>
						</li>
						<li class="flex items-center">
							<ShareIcon class="mr-3 text-green-500" />
							<span>$ invoke_codeclippy --with-highlight</span>
						</li>
						<li class="flex items-center">
							<CopyIcon class="mr-3 text-green-500" />
							<span>$ access_and_share_snippets</span>
						</li>
					</ul>
				</div>
			</div>
			{#if !isHighlight}
				<p class="text-red-600 mt-8 text-center">
					[WARNING] This app is designed to run inside the Highlight.ing app.
					<br>
					<a href="https://highlight.ing" class="text-primary hover:underline" target="_blank">
						Learn more about Highlight
					</a>
				</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
