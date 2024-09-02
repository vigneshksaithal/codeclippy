<script lang="ts">
import MetaTags from "$lib/MetaTags.svelte"
import { Button } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import { Input } from "$lib/components/ui/input"
import { pb } from "$lib/pocketbase"
import Highlight, { type HighlightContext } from "@highlight-ai/app-runtime"
import Fuse from "fuse.js"
import CopyIcon from "lucide-svelte/icons/copy"
import ShareIcon from "lucide-svelte/icons/share"
import Trash2Icon from "lucide-svelte/icons/trash-2"
import { onDestroy, onMount } from "svelte"
import { HighlightAuto } from "svelte-highlight"
import greenScreen from "svelte-highlight/styles/green-screen"
import { toast } from "svelte-sonner"
import { fade } from "svelte/transition"
import Description from "./Description.svelte"
import ThemeSwitchButton from "./ThemeSwitchButton.svelte"

let codeSnippets: (CodeSnippet & { isSharing?: boolean })[] = []
// biome-ignore lint/style/useConst: <explanation>
let query = ""
let isHighlight = false
let isReady = false
let destroyHighlightListener: () => void

const showToast = (
	message: string,
	type: "success" | "error" = "success",
): void => {
	toast[type](message)
}

const copyToClipboard = async (
	text: string,
	message: string,
): Promise<void> => {
	try {
		await navigator.clipboard.writeText(text)
		showToast(message)
	} catch (error) {
		console.error("Failed to copy text", error)
		showToast("Failed to copy text", "error")
	}
}

const deleteSnippet = (id: number): void => {
	codeSnippets = codeSnippets.filter((snippet) => snippet.id !== id)
	if (isHighlight) {
		Highlight.appStorage.set("codeSnippets", codeSnippets)
	}
	showToast("Code snippet deleted successfully!")
}

onMount(async () => {
	isReady = true

	if (typeof Highlight !== "undefined" && Highlight.isRunningInHighlight) {
		isHighlight = Highlight.isRunningInHighlight()

		if (isHighlight) {
			codeSnippets = await getCodeSnippets()

			console.log("Setting up Highlight listener")
			destroyHighlightListener = Highlight.app.addListener(
				"onContext",
				async (context: HighlightContext) => {
					console.log("onContext event received", context)
					if (!context.suggestion) return

					const newSnippet: CodeSnippet = {
						id: generateId(),
						title: context.suggestion,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
						description: "",
						code: "",
					}

					const attachments = context.attachments
					if (attachments) {
						for (const attachment of attachments) {
							if (attachment.type === "clipboard") {
								newSnippet.code = attachment.value
							}
						}
					}

					saveCode(newSnippet)
				},
			)
			console.log("Highlight listener set up successfully")
		}
	} else {
		console.warn(
			"This app is not running inside Highlight. Some features may be limited.",
		)
	}
})

onDestroy(() => {
	if (isHighlight && destroyHighlightListener) {
		console.log("Destroying Highlight listener")
		destroyHighlightListener()
	}
})

const saveCode = (snippet: CodeSnippet): void => {
	codeSnippets = [snippet, ...codeSnippets]
	if (isHighlight) {
		Highlight.appStorage.set("codeSnippets", codeSnippets)
	}

	plausible("Save Code")
}

const getCodeSnippets = async (): Promise<CodeSnippet[]> => {
	if (isHighlight) {
		return (await Highlight.appStorage.get("codeSnippets")) ?? []
	}
	return []
}

const searchCode = (query: string) => {
	const fuse = new Fuse(codeSnippets, { keys: ["title"] })
	return fuse.search(query)
}

const generateId = (): number => Math.floor(Math.random() * 1000000)

const shareCode = async (snippet: {
	id: number
	title: string
	code: string
}): Promise<void> => {
	codeSnippets = codeSnippets.map((s) =>
		s.id === snippet.id ? { ...s, isSharing: true } : s,
	)
	try {
		const record = await pb.collection("codes").create({
			title: snippet.title,
			code: snippet.code,
		})
		const shareUrl = `${window.location.origin}/share/${record.id}`
		await copyToClipboard(shareUrl, "Code link copied to clipboard")
	} catch (error) {
		console.error("Error sharing code:", error)
		showToast("Failed to share code. Please try again.", "error")
	}
	codeSnippets = codeSnippets.map((s) =>
		s.id === snippet.id ? { ...s, isSharing: false } : s,
	)
}
</script>

<MetaTags />

<!-- Import Atom One Light theme -->
<svelte:head>
	{@html greenScreen}
</svelte:head>

<section>
	{#if isHighlight && codeSnippets.length > 0 && isReady}
		<!-- Title Text -->
		<div
			class="max-w-2xl mx-auto flex gap-12 justify-between items-center mt-8 mb-4"
		>
		<div class="flex gap-2 justify-start items-center">
			<ThemeSwitchButton />
			<h3 class="text-3xl font-extrabold text-primary">CodeClippy</h3>
		</div>
			<Input
				type="search"
				placeholder="Search"
				aria-label="Search"
				bind:value={query}
			/>
		</div>
		<div
			class="max-w-2xl mx-auto mb-8"
			transition:fade={{ delay: 100, duration: 250 }}
		>
			<div class="grid grid-cols-1 gap-6">
				<!-- Search Results -->
				{#if query !== ''}
					{#each searchCode(query) as result}
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-primary tracking-normal"
									>{result.item.title}</Card.Title
								>
							</Card.Header>
							<Card.Content>
								<div class="max-h-72 overflow-auto">
									<HighlightAuto class="text-sm" code={result.item.code} />
								</div>
							</Card.Content>
							<Card.Footer class="flex gap-2 justify-end">
								<Button
									variant="outline"
									class="plausible-event-name=Delete+Code"
									on:click={() => {
										deleteSnippet(result.item.id)
										query = ''
									}}
								>
									<Trash2Icon size="16" class="mr-2" />
									Delete
								</Button>
								<Button
									variant="outline"
									class="plausible-event-name=Share+Code"
									on:click={() =>
										shareCode({
											id: result.item.id,
											title: result.item.title,
											code: result.item.code,
										})}
									aria-busy={result.item.isSharing}
								>
									{#if result.item.isSharing}
										Generating link...
									{:else}
										<ShareIcon size="16" class="mr-2" />
										Share
									{/if}
								</Button>
								<Button
									variant="outline"
									class="plausible-event-name=Copy+Code"
									on:click={() =>
										copyToClipboard(
											result.item.code,
											'Code copied successfully',
										)}
								>
									<CopyIcon size="16" class="mr-2" />
									Copy
								</Button>
							</Card.Footer>
						</Card.Root>
					{/each}
				{:else}
					{#each codeSnippets as { id, title, code }}
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-primary tracking-normal"
									>{title}</Card.Title
								>
							</Card.Header>
							<Card.Content>
								<div class="max-h-72 overflow-auto">
									<HighlightAuto class="text-sm" {code} />
								</div>
							</Card.Content>
							<Card.Footer class="flex gap-2 justify-end">
								<Button
									variant="outline"
									class="plausible-event-name=Delete+Code"
									on:click={() => {
										deleteSnippet(id)
									}}
								>
									<Trash2Icon size="16" class="mr-2" />
									Delete
								</Button>
								<Button
									variant="outline"
									class="plausible-event-name=Share+Code"
									on:click={() => shareCode({ id, title, code })}
									aria-busy={codeSnippets.find((s) => s.id === id)?.isSharing}
								>
									{#if codeSnippets.find((s) => s.id === id)?.isSharing}
										Generating link...
									{:else}
										<ShareIcon size="16" class="mr-2" />
										Share
									{/if}
								</Button>
								<Button
									variant="outline"
									class="plausible-event-name=Copy+Code"
									on:click={() =>
										copyToClipboard(code, 'Code copied successfully')}
								>
									<CopyIcon size="16" class="mr-2" />
									Copy</Button
								>
							</Card.Footer>
						</Card.Root>
					{/each}
				{/if}
			</div>
		</div>
	{:else}
		<Description {isHighlight} />
	{/if}
</section>
