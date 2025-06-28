import { NextRequest, NextResponse } from 'next/server';
import { createDishApiForm } from '@/lib/api';
import { getAccessToken } from '@/lib/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		// Parse the request as FormData instead of JSON
		const dishFormData: FormData = await request.formData();

		const name: string = dishFormData.get('name') as string;
		const description: string = dishFormData.get('description') as string;
		const price: string = dishFormData.get('price') as string;
		const category: string = dishFormData.get('category') as string;
		const is_available: boolean =
			dishFormData.get('is_available') === 'true';
		const is_visible: boolean = dishFormData.get('is_visible') === 'true';

		// Extract allergen_ids as an array
		const allergen_ids: string = dishFormData.get('allergen_ids') as string;
		// Handle the image (if provided)
		const image: File | null = dishFormData.get('image') as File | null;

		// Prepare the FormData to send to the Django backend
		const backendFormData: FormData = new FormData();
		backendFormData.append('name', name);
		backendFormData.append('description', description);
		backendFormData.append('price', price);
		backendFormData.append('category', category);
		backendFormData.append('is_available', String(is_available));
		backendFormData.append('is_visible', String(is_visible));

		backendFormData.append('allergen_ids', allergen_ids);

		// Append image if it exists
		if (image) {
			backendFormData.append('image', image);
		}

		// Get the access token
		const accessToken: string | undefined = await getAccessToken();
		if (!accessToken) {
			return NextResponse.json(
				{ detail: 'Unauthorized' },
				{ status: 401 }
			);
		}
		console.log('Access Token:', backendFormData);
		// Send the FormData to the Django backend
		await createDishApiForm(backendFormData, accessToken);

		return NextResponse.json(
			{ message: 'Dish created successfully' },
			{ status: 200 }
		);
	} catch (err: unknown) {
		return NextResponse.json(
			{
				detail:
					err instanceof Error
						? err.message
						: 'Failed to create dish',
			},
			{ status: 400 }
		);
	}
}
