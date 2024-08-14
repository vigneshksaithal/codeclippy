export const prerender = false

import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
    const { id } = params
    const url = `${PUBLIC_POCKETBASE_URL}/api/collections/codes/records/${id}?fields=title,code`

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Failed to fetch code data')
    }
    const data = await response.json()
    const { title, code } = data

    return {
        title,
        code
    }
}) satisfies PageLoad