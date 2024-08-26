<script lang="ts">
import * as Card from '$lib/components/ui/card'
import { CopyIcon, ShareIcon } from 'lucide-svelte'

// biome-ignore lint/style/useConst: <explanation>
export let isHighlight = false
</script>

<div
	class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100"
>
	<Card.Root class="max-w-2xl w-full m-4">
		<Card.Header class="text-center">
			<Card.Title class="text-4xl font-extrabold text-blue-600 mb-4"
				>CodeClippy</Card.Title
			>
			<Card.Description class="text-xl text-gray-600"
				>Capture and share code snippets effortlessly with Highlight.ing</Card.Description
			>
		</Card.Header>
		<Card.Content class="pt-6">
			<div class="grid md:grid-cols-2 gap-12 items-center">
				<video autoplay loop muted class="w-full rounded-lg shadow-xl">
					<source src="/demo.mp4" type="video/mp4" />
				</video>
				<div>
					<h4 class="text-2xl font-semibold mb-6 text-gray-800">
						How it works
					</h4>
					<ul class="space-y-6">
						<li class="flex items-center">
							<CopyIcon class="mr-4 text-blue-500" /><span
								>Copy any code snippet</span
							>
						</li>
						<li class="flex items-center">
							<ShareIcon class="mr-4 text-blue-500" /><span
								>Invoke CodeClippy with Highlight</span
							>
						</li>
						<li class="flex items-center">
							<CopyIcon class="mr-4 text-blue-500" /><span
								>Access and share your snippets anytime</span
							>
						</li>
					</ul>
				</div>
			</div>
			{#if !isHighlight}
				<p class="text-sm text-muted-foreground mt-12 text-center">
					This app is designed to run inside the Highlight environment.
					<a href="https://highlight.ing" class="text-blue-500 hover:underline"
						>Learn more about Highlight</a
					>
				</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
