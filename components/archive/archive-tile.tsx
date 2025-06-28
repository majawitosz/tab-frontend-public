'use client';
import { JSX, useEffect, useState } from 'react';
import { OrdersDataResponse, Dish } from '@/types/order';

export function ArchiveTile(): JSX.Element {
	const [orders, setOrders] = useState<OrdersDataResponse[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchOrders: () => Promise<void> = async () => {
			try {
				const response: Response = await fetch('/api/orders', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					const errorData: { detail?: string } =
						await response.json();
					throw new Error(
						errorData.detail || 'Failed to fetch orders'
					);
				}

				const fetchedOrders: OrdersDataResponse[] =
					await response.json();
				let archived: OrdersDataResponse[] = fetchedOrders.filter(
					(order) => order.status === 'Completed'
				);
				archived = archived.sort(
					(a, b) =>
						new Date(b.created_at).getTime() -
						new Date(a.created_at).getTime()
				);
				setOrders(archived);
				setError(null);
			} catch (err) {
				const errorMessage: string =
					err instanceof Error
						? err.message
						: 'An unexpected error occurred';
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	if (loading) {
		return (
			<div className='p-4 text-center text-gray-500'>
				<p>Loading archived orders...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='p-4 text-center text-red-500'>
				<p>Error: {error}</p>
				<p>Please try again later.</p>
			</div>
		);
	}

	return (
		<div className='p-4'>
			<div className='space-y-4'>
				{orders.length === 0 && (
					<p className='text-center text-gray-400'>
						No archived orders.
					</p>
				)}
				{orders.map((order: OrdersDataResponse) => (
					<div
						key={order.id}
						className='rounded-lg bg-white p-4 shadow-md'
					>
						<h3 className='text-lg font-semibold'>{`TABLE: ${order.table_number}, ORDER ID: ${order.id}`}</h3>
						<ul className='text-sm text-gray-600'>
							{order.items && order.items.length > 0 ? (
								order.items.map((dish: Dish, index: number) => (
									<li
										key={index}
									>{`Dish: ${dish.name}, Quantity: ${dish.quantity || 0}`}</li>
								))
							) : (
								<li>No dishes available</li>
							)}
						</ul>
						<p className='text-sm text-gray-600'>{`Notes: ${order?.notes}`}</p>
						<p className='text-sm text-red-600'>{`Status: ${order.status}`}</p>
						<p className='text-sm text-gray-600'>
							{`Date: ${new Date(order.created_at).toLocaleString(
								'en-GB',
								{
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
								}
							)}`}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default ArchiveTile;
