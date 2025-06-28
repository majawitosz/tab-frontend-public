import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';

const TOKEN_AGE: number = 60 * 60;

export async function getAccessToken(): Promise<string | undefined> {
	const cookieStore: ReadonlyRequestCookies = await cookies();
	const myAuthToken: RequestCookie | undefined =
		cookieStore.get('accessToken');
	return myAuthToken?.value;
}

export async function setAccessToken(authToken: string): Promise<void> {
	await (
		await cookies()
	).set({
		name: 'accessToken',
		value: authToken,
		httpOnly: true,
		maxAge: TOKEN_AGE,
		secure: process.env.NODE_ENV !== 'development',
		sameSite: 'strict',
		path: '/',
	});
}

export async function deleteAccessToken(): Promise<void> {
	await (await cookies()).delete('accessToken');
}
