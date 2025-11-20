import { json } from '@sveltejs/kit';
import records from './data.json';

export const GET = () => json(records);
