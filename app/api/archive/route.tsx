import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth';
import { OrdersDataResponse } from '@/types/order';
const API_URL: string = 'https://Tab.garbatamalpa.com/api';
//const API_URL: string = 'http://localhost:8000/api';

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const { orderId } = await request.json();

		// Get the access token from cookies (HttpOnly cookie)
		const accessToken: string | undefined = await getAccessToken();

		if (!accessToken) {
			return NextResponse.json(
				{ detail: 'Unauthorized: No access token found' },
				{ status: 401 }
			);
		}

		// Call the correct Django endpoint (using the "dania" namespace)
		const backendResponse: Response = await fetch(
			`${API_URL}/dania/orders/${orderId}/status`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				// Wysyłamy pusty body, ponieważ status będzie zmieniany po stronie backendu (w PyCharmie)
				body: JSON.stringify({}),
			}
		);

		if (!backendResponse.ok) {
			const errorData: { detail?: string } = await backendResponse.json();
			return NextResponse.json(
				{ detail: errorData.detail || 'Failed to update order status' },
				{ status: backendResponse.status }
			);
		}

		// Return the updated order received from the backend
		const updatedOrder: OrdersDataResponse = await backendResponse.json();
		return NextResponse.json(updatedOrder, { status: 200 });
	} catch (err: unknown) {
		return NextResponse.json(
			{
				detail:
					err instanceof Error
						? err.message
						: 'Failed to archive order',
			},
			{ status: 400 }
		);
	}
}
