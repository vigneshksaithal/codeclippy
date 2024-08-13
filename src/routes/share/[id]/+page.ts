export const prerender = false

import { pb } from '$lib/pocketbase'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
    const { id } = params

    const { title, code } = await pb.collection('codes').getOne(id, {
        fields: 'title, code',
    })
    return {
        title,
        code
    }
}) satisfies PageLoad