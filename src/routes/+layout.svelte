<script>
import { Toaster } from '$lib/components/ui/sonner'
import { setMode } from 'mode-watcher'
import '../app.css'

setMode('light')
</script>

<Toaster />

<main>
	<slot />
</main>
