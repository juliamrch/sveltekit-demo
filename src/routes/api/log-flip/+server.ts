import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { flippedH, flippedV } = await request.json();
	console.log(`Flip triggered -> horizontal: ${flippedH}, vertical: ${flippedV}`);
	return json({ status: 'logged' });
};
