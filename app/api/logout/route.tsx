import { NextResponse } from 'next/server';

import { deleteAccessToken } from '@/lib/auth';

export async function POST(): Promise<NextResponse> {
	const res: NextResponse = NextResponse.json(
		{ message: 'Logged out successfully' },
		{ status: 200 }
	);
	await deleteAccessToken();
	return res;
}
