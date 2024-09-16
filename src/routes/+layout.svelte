<script>
import { Toaster } from '$lib/components/ui/sonner'
import { ModeWatcher, setMode } from 'mode-watcher'
import '../app.css'
import HelpDialog from './HelpDialog.svelte'

setMode('system')
</script>

<ModeWatcher />
<Toaster position="top-right" />
<HelpDialog />

<main>
	<slot />
</main>
