'use client';
import { JSX, useState } from 'react';
import { Button } from '../../components/ui/primaryButton';
import { OrdersDataResponse } from '@/types/order';

interface ArchiveOrderProps {
	order: OrdersDataResponse;
	onStatusUpdate: (updatedOrder: OrdersDataResponse) => void;
}

export function ArchiveOrder({
	order,
	onStatusUpdate,
}: ArchiveOrderProps): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);

	const handleArchive: () => Promise<void> = async (): Promise<void> => {
		setLoading(true);
		try {
			// Call the archive endpoint instead of a non-existent orders URL.
			const response: Response = await fetch('/api/archive', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include', // send cookies for authorization
				body: JSON.stringify({ orderId: order.id }),
			});

			if (!response.ok) {
				const errorData: { detail?: string } = await response.json();
				throw new Error(errorData.detail || 'Failed to archive order');
			}

			const updatedOrder: OrdersDataResponse = await response.json();
			onStatusUpdate(updatedOrder);
		} catch (error: unknown) {
			console.error('Failed to archive order:', error);
			alert(
				error instanceof Error
					? error.message
					: 'Failed to archive order'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			onClick={handleArchive}
			disabled={loading || order.status === 'Completed'}
		>
			{loading ? 'Completing...' : 'Complete'}
		</Button>
	);
}
