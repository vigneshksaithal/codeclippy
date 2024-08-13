import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, platform }) => {
    const { code } = await request.json()
    const id = crypto.randomUUID()

    await platform.env.CODESNIPPETS.put(id, JSON.stringify({ code }), { expirationTtl: 604800 }) // 7 days to delete

    return json({ id })
}

export const GET: RequestHandler = async ({ url, platform }) => {
    const id = url.searchParams.get('id')

    if (!id) {
        return new Response('Missing id', { status: 400 })
    }

    const data = await platform.env.CODESNIPPETS.get(id)

    if (!data) {
        return new Response('Not found', { status: 404 })
    }

    try {
        const parsedData = JSON.parse(data)
        if (typeof parsedData.code !== 'string') {
            throw new Error('Invalid data structure')
        }
        return json(parsedData)
    } catch (error) {
        console.error('Error parsing stored data:', error)
        return new Response('Invalid data', { status: 500 })
    }
}