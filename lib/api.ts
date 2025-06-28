/** @format */

import {
	User,
	LoginUser,
	RegisterResponse,
	LoginResponse,
	ErrorResponse,
	HeadersInit,
	AdminResponse,
} from '@/types/loginRegister';
import { AllergenResponse, Dish, OrdersDataResponse } from '@/types/order';
import { NextResponse } from 'next/server';

import { OrdersData, ReportsData, ReportsResponse } from '@/types/order';

const API_URL: string | undefined = process.env.API_URL;

//const API_URL: string = 'http://localhost:8000/api';

export async function registerUser(user: User): Promise<RegisterResponse> {
	const response: Response = await fetch(`${API_URL}/users/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	});

	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to register user');
	}

	return response.json();
}

export async function loginUser(user: LoginUser): Promise<LoginResponse> {
	const response: Response = await fetch(`${API_URL}/users/token/pair`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	});

	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Invalid credentials');
	}

	const data: LoginResponse = await response.json();
	// Set the token in cookies
	const res: NextResponse<LoginResponse> = NextResponse.json(data);
	res.cookies.set('accessToken', data.access, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 30, // 1 hour expiration 3600
		path: '/',
	});

	return data;
}

export async function getUserRole(
	accessToken?: string
): Promise<AdminResponse> {
	const response: Response = await fetch(`${API_URL}/users/me`, {
		cache: 'no-store',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
	});
	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to fetch user role');
	}
	//eslint-disable-next-line
	const data = await response.json();
	console.log('Response from getUserRole:', data);

	return data.is_staff;
}

export async function fetchDishesFromMenu(): Promise<Dish[]> {
	const response: Response = await fetch(`${API_URL}/dania/dania`, {
		cache: 'no-store',
	});

	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to fetch dishes');
	}

	return response.json();
}

export async function fetchDishesFromOrder(
	accessToken?: string
): Promise<OrdersDataResponse[]> {
	const headers: HeadersInit = {};
	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const response: Response = await fetch(`${API_URL}/dania/orders`, {
		cache: 'no-store',
		headers,
	});

	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to fetch dishes');
	}

	return response.json();
}

export async function fetchAllergens(): Promise<AllergenResponse[]> {
	const headers: HeadersInit = {};

	const response: Response = await fetch(`${API_URL}/dania/alergeny`, {
		cache: 'no-store',
		headers,
	});

	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to fetch allergens');
	}
	console.log('Response from fetchAllergens:', response);
	return response.json();
}

export async function submitOrder(
	order: OrdersData,
	accessToken?: string
): Promise<void> {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};

	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const response: Response = await fetch(`${API_URL}/dania/orders`, {
		method: 'POST',
		headers,
		body: JSON.stringify(order),
	});
	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to submit order');
	}
}

export async function createDishApi(
	dish: Dish,
	accessToken?: string
): Promise<void> {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
	const response: Response = await fetch(`${API_URL}/dania/dania`, {
		method: 'POST',
		headers,
		body: JSON.stringify(dish),
	});
	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to submit dish');
	}
}

export async function createDishApiForm(
	formData: FormData,
	accessToken: string
): Promise<void> {
	const res: Response = await fetch(`${API_URL}/dania/dania`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			// Nie ustawiamy Content-Type – przeglądarka ustawi boundary dla FormData automatycznie
		},
		body: formData,
	});

	if (!res.ok) {
		const errorData: ErrorResponse = await res.json();
		throw new Error(errorData.detail || 'Failed to create dish');
	}
}

export async function completeOrder(
	orderId: number,
	accessToken?: string
): Promise<void> {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};

	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const response: Response = await fetch(
		`${API_URL}/dania/orders/${orderId}/status`,
		{
			method: 'PATCH',
			headers,
			body: JSON.stringify({ status: 'Completed' }), // Send status in the body
		}
	);

	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to complete order');
	}
}

export async function hideDish(
	dishId: number,
	accessToken?: string
): Promise<Dish> {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};

	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const response: Response = await fetch(
		`${API_URL}/dania/dania/${dishId}/hide`,
		{
			method: 'POST',
			headers,
		}
	);

	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to hide dish');
	}
	console.log(response);
	return response.json();
}

export async function getReport(report: ReportsData): Promise<ReportsResponse> {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};

	const response: Response = await fetch(`${API_URL}/reports/generate`, {
		method: 'POST',
		headers,
		body: JSON.stringify(report),
	});
	if (!response.ok) {
		const errorData: ErrorResponse = await response.json();
		throw new Error(errorData.detail || 'Failed to submit repoprt');
	}

	return response.json();
}
