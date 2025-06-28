import { getAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { AdminResponse } from '@/types/loginRegister';
import { getUserRole } from '@/lib/api';

export async function GET(): Promise<NextResponse> {
	try {
		// Get the access token from cookies
		const accessToken: string | undefined = await getAccessToken();

		if (!accessToken) {
			return NextResponse.json(
				{ detail: 'Unauthorized: No access token found' },
				{ status: 401 }
			);
		}

		const admin: AdminResponse = await getUserRole(accessToken);

		return NextResponse.json(admin, { status: 200 });
	} catch (err: unknown) {
		console.error('Error in /api/user:', err);
		return NextResponse.json(
			{
				detail:
					err instanceof Error
						? err.message
						: 'Failed to fetch user role',
			},
			{ status: 400 }
		);
	}
}
