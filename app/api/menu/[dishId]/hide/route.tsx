// app/api/menu/[dishId]/hide/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/auth';
import { hideDish } from '@/lib/api';
import { Dish } from '@/types/order';

interface Params {
	params: Promise<{
		dishId: string;
	}>;
}

export async function POST(
	request: NextRequest,
	{ params }: Params
): Promise<NextResponse> {
	try {
		const { dishId } = await params; // Await the params Promise
		const parsedDishId: number = parseInt(dishId);

		if (isNaN(parsedDishId)) {
			return NextResponse.json(
				{ detail: 'Invalid dish ID' },
				{ status: 400 }
			);
		}

		const accessToken: string | undefined = await getAccessToken();
		if (!accessToken) {
			return NextResponse.json(
				{ detail: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const updatedDish: Dish = await hideDish(parsedDishId, accessToken);

		return NextResponse.json(
			{
				message: 'Dish hidden successfully',
				dish: updatedDish,
			},
			{ status: 200 }
		);
	} catch (err: unknown) {
		console.error('Error hiding dish:', err);
		return NextResponse.json(
			{
				detail:
					err instanceof Error ? err.message : 'Failed to hide dish',
			},
			{ status: 400 }
		);
	}
}
