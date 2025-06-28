'use client';
import { useEffect, useState } from 'react';

interface OrderItem {
	name: string;
	quantity?: number;
}
interface Order {
	status: string;
	created_at: string;
	items?: OrderItem[];
}

export function DisplayArchivedOrders(): React.ReactNode {
	const [count, setCount] = useState<number | null>(null);
	const [todayCount, setTodayCount] = useState<number | null>(null);
	const [mostPopular, setMostPopular] = useState<string | null>(null);
	const [mostPopularCount, setMostPopularCount] = useState<number | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchOrders: () => Promise<void> = async (): Promise<void> => {
			try {
				const response: Response = await fetch('/api/orders', {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				});
				const data: unknown = await response.json();
				const orders: Order[] = Array.isArray(data)
					? data
					: (data as { orders: Order[] }).orders;

				const activeCount: number = orders.filter(
					(order: Order) => order.status === 'Active'
				).length;
				setCount(activeCount);

				const today: Date = new Date();
				const todayOrders: Order[] = orders.filter((order: Order) => {
					const created: Date = new Date(order.created_at);
					return (
						created.getFullYear() === today.getFullYear() &&
						created.getMonth() === today.getMonth() &&
						created.getDate() === today.getDate()
					);
				});
				setTodayCount(todayOrders.length);

				const dishCount: Record<string, number> = {};
				todayOrders.forEach((order: Order) => {
					order.items?.forEach((item: OrderItem) => {
						if (!item?.name) return;
						const qty: number = item.quantity ?? 1;
						dishCount[item.name] =
							(dishCount[item.name] || 0) + qty;
					});
				});
				const sorted: [string, number][] = Object.entries(
					dishCount
				).sort(
					(a: [string, number], b: [string, number]) => b[1] - a[1]
				);
				const mostPopularDish: string | null = sorted[0]?.[0] ?? null;
				const mostPopularDishCount: number | null =
					sorted[0]?.[1] ?? null;
				setMostPopular(mostPopularDish);
				setMostPopularCount(mostPopularDishCount);
			} catch {
				setCount(null);
				setTodayCount(null);
				setMostPopular(null);
				setMostPopularCount(null);
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	return (
		<div className='space-y-4 p-8'>
			<div className='rounded-lg bg-gray-100 p-6 text-center text-lg font-semibold shadow'>
				{loading
					? 'Loading...'
					: count !== null
						? `Active orders: ${count}`
						: 'No active orders'}
			</div>
			<div className='rounded-lg bg-gray-100 p-6 text-center text-lg font-semibold shadow'>
				{loading
					? 'Loading...'
					: todayCount !== null
						? `Orders placed today: ${todayCount}`
						: 'No orders placed today'}
			</div>
			<div className='rounded-lg bg-gray-100 p-6 text-center text-lg font-semibold shadow'>
				{loading ? (
					'Loading...'
				) : mostPopular !== null && mostPopularCount !== null ? (
					<>
						{`Most popular dish today: ${mostPopular}`}
						<br />
						{`Number of orders: ${mostPopularCount}`}
					</>
				) : (
					'No orders today'
				)}
			</div>
		</div>
	);
}
