import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
	const { id } = params
	const { title, code } = await getCodeFromDB(id)

	return {
		title,
		code,
		url: `${PUBLIC_POCKETBASE_URL}/share/${id}`,
	}
}) satisfies PageServerLoad

const getCodeFromDB = async (id: string) => {
	const URL = `${PUBLIC_POCKETBASE_URL}/api/collections/codes/records/${id}?fields=title,code`

	const response = await fetch(URL)
	if (!response.ok) {
		throw new Error('Failed to fetch code data')
	}
	const { title, code } = await response.json()
	return { title, code }
}
