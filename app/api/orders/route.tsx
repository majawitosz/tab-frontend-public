import { NextRequest, NextResponse } from 'next/server';
import { fetchDishesFromOrder, submitOrder } from '@/lib/api';
import { OrdersData, OrdersDataResponse } from '@/types/order';
import { getAccessToken } from '@/lib/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const order: OrdersData = await request.json();

		// Get the access token from cookies
		const accessToken: string | undefined = await getAccessToken();

		if (!accessToken) {
			return NextResponse.json(
				{ detail: 'Unauthorized: No access token found' },
				{ status: 401 }
			);
		}

		// Submit the order with the token
		await submitOrder(order, accessToken);

		return NextResponse.json(
			{ message: 'Order submitted successfully' },
			{ status: 200 }
		);
	} catch (err: unknown) {
		return NextResponse.json(
			{
				detail:
					err instanceof Error
						? err.message
						: 'Failed to submit order',
			},
			{ status: 400 }
		);
	}
}

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

		// Fetch orders with the token
		const orders: OrdersDataResponse[] =
			await fetchDishesFromOrder(accessToken);

		return NextResponse.json(orders, { status: 200 });
	} catch (err: unknown) {
		console.error('Error in /api/fetch-orders:', err);
		return NextResponse.json(
			{
				detail:
					err instanceof Error
						? err.message
						: 'Failed to fetch orders',
			},
			{ status: 400 }
		);
	}
}
