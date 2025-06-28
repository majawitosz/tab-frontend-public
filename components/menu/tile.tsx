'use client';
import { JSX, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/components/cart/cart';
import { Dish } from '@/types/order';
import { ErrorResponse } from '../../types/loginRegister';
import { useUser } from '@/context/UserContext';

interface TileProps {
	dish: Dish;
	onDishHidden?: () => void; // New prop for refetching
}

export function Tile({ dish, onDishHidden }: TileProps): JSX.Element {
	const { is_staff } = useUser();
	const [isOpen, setIsOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const { addToCart } = useCart();

	const handleAddToOrder: () => void = () => {
		addToCart({
			...dish,
			quantity: 1,
		});
		console.log(`Added ${dish.name} to cart`);
	};

	const handleDeleteDish: () => Promise<void> = async () => {
		if (!dish.id) {
			alert('Dish ID is missing');
			return;
		}
		if (!confirm(`Are you sure you want to delete "${dish.name}"?`)) {
			return;
		}

		setIsDeleting(true);
		try {
			const response: Response = await fetch(
				`/api/menu/${dish.id}/hide`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				const errorData: ErrorResponse = await response.json();
				throw new Error(errorData.detail || 'Failed to delete dish');
			}

			console.log(`Deleted ${dish.name}`);
			if (onDishHidden) {
				onDishHidden(); // Trigger refetch
			}
		} catch (error) {
			console.error('Error deleting dish:', error);
			alert(
				error instanceof Error
					? `Error: ${error.message}`
					: 'Failed to delete dish'
			);
		} finally {
			setIsDeleting(false);
		}
	};

	const toggleDropdown: () => void = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<div className='space-y-4 rounded-2xl bg-white p-4 shadow-lg transition hover:shadow-xl'>
			<div
				onClick={toggleDropdown}
				className='flex cursor-pointer items-center gap-4'
			>
				<div className='relative flex h-12 w-12 flex-shrink-0 items-center overflow-hidden rounded-full bg-gray-100'>
					{dish.image_url ? (
						<Image
							src={`https://tab.garbatamalpa.com${dish.image_url}`}
							alt={dish.name}
							width={60}
							height={60}
							className='object-fill'
						/>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 512 512'
							className='h-full w-full text-gray-400'
						>
							<path d='M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32L8.6 224C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256l457.1 0c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28l-231.5 0c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z' />
						</svg>
					)}
				</div>
				<div className='flex-1'>
					<h3 className='text-lg font-semibold text-gray-800'>
						{dish.name}{' '}
						<span className='text-sm text-gray-500'>
							(${dish.price.toFixed(2)})
						</span>
					</h3>
					<p className='text-xs text-gray-500'>{dish.category}</p>
				</div>

				<div className='flex gap-2'>
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleAddToOrder();
						}}
						className='flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600'
						aria-label={`Add ${dish.name} to order`}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='currentColor'
							className='h-5 w-5'
						>
							<path d='M12 5c.552 0 1 .448 1 1v5h5c.552 0 1 .448 1 1s-.448 1-1 1h-5v5c0 .552-.448 1-1 1s-1-.448-1-1v-5H6c-.552 0-1-.448-1-1s.448-1 1-1h5V6c0-.552.448-1 1-1z' />
						</svg>
					</button>
					{is_staff && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteDish();
							}}
							disabled={isDeleting}
							className='flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300'
							aria-label={`Delete ${dish.name}`}
						>
							{isDeleting ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='currentColor'
									className='h-4 w-4 animate-spin'
								>
									<path
										d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
										opacity='0.3'
									/>
									<path d='M4 12c0-4.41 3.59-8 8-8V2C6.48 2 2 6.48 2 12s4.48 10 10 10v-2c-4.41 0-8-3.59-8-8z' />
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 448 512'
									fill='currentColor'
									className='h-4 w-4'
								>
									<path d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z' />
								</svg>
							)}
						</button>
					)}
				</div>
			</div>

			{isOpen && (
				<div className='space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4'>
					{dish.description && (
						<p className='text-sm text-gray-600'>
							{dish.description}
						</p>
					)}

					{dish.allergens && dish.allergens.length > 0 && (
						<div className='rounded-md border border-gray-300 bg-gray-200 p-3'>
							<div className='mb-2 flex items-center gap-2'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 512 512'
									className='h-5 w-5'
								>
									<path d='M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z' />
								</svg>
								<span className='text-sm font-semibold text-black'>
									Allergens:
								</span>
							</div>
							<ul className='list-disc pl-5 text-sm text-black'>
								{dish.allergens.map((a, i) => (
									<li key={i}>{a.name}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
