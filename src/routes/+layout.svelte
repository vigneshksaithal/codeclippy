<script>
import { Toaster } from "$lib/components/ui/sonner"
import { ModeWatcher, setMode } from "mode-watcher"
import "../app.css"

setMode("system")
</script>

<ModeWatcher />

<Toaster />

<main>
	<slot />
</main>
