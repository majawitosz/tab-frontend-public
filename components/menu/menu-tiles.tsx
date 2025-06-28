'use client';

import { Tile } from '@/components/menu/tile';
import { JSX, useEffect, useState, useMemo, useCallback } from 'react';
import { Dish } from '@/types/order';
import { fetchDishesFromMenu } from '@/lib/api';

type SortType = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const sortOptions: { label: string; value: SortType }[] = [
	{ label: 'Price: Low to High', value: 'price-asc' },
	{ label: 'Price: High to Low', value: 'price-desc' },
	{ label: 'Name: A to Z', value: 'name-asc' },
	{ label: 'Name: Z to A', value: 'name-desc' },
];

export default function MenuTiles(): JSX.Element {
	const [dishes, setDishes] = useState<Dish[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [sort, setSort] = useState<SortType>('price-asc');
	const [maxPrice, setMaxPrice] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');

	// Memoized function to fetch dishes
	const loadDishes: () => Promise<void> = useCallback(async () => {
		try {
			setLoading(true);
			const fetchedDishes: Dish[] = await fetchDishesFromMenu();
			const cleanedDishes: Dish[] = fetchedDishes.map((dish) => ({
				...dish,
				name: dish.name.replace(/^\s+|\t/g, ''), // Remove leading whitespace and tabs
			}));
			console.log('Fetched Dishes:', cleanedDishes);

			setDishes(cleanedDishes);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'An unexpected error occurred'
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadDishes();
	}, [loadDishes]);

	// Handle dish hidden
	const handleDishHidden: () => Promise<void> = async () => {
		await loadDishes(); // Refetch dishes
	};

	const uniqueCategories: string[] = useMemo(() => {
		return Array.from(new Set(dishes.map((dish) => dish.category)));
	}, [dishes]);

	const toggleCategory: (category: string) => void = (category: string) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category]
		);
	};

	const filteredAndSortedDishes: Dish[] = useMemo(() => {
		let filtered: Dish[] = dishes;
		console.log(filtered);

		if (selectedCategories.length > 0) {
			filtered = filtered.filter((dish) =>
				selectedCategories.includes(dish.category)
			);
		}

		if (maxPrice !== null && maxPrice >= 0) {
			filtered = filtered.filter((dish) => dish.price <= maxPrice);
		}

		if (searchQuery.trim() !== '') {
			const lowerQuery: string = searchQuery.toLowerCase();
			filtered = filtered.filter((dish) =>
				dish.name.toLowerCase().includes(lowerQuery)
			);
		}

		switch (sort) {
			case 'price-asc':
				filtered.sort((a, b) => a.price - b.price);
				break;
			case 'price-desc':
				filtered.sort((a, b) => b.price - a.price);
				break;
			case 'name-asc':
				filtered.sort((a, b) =>
					a.name
						.toLocaleLowerCase()
						.localeCompare(b.name.toLocaleLowerCase())
				);
				break;
			case 'name-desc':
				filtered.sort((a, b) =>
					b.name
						.toLocaleLowerCase()
						.localeCompare(a.name.toLocaleLowerCase())
				);
				break;
		}

		return filtered;
	}, [dishes, selectedCategories, sort, maxPrice, searchQuery]);

	if (loading) {
		return (
			<div className='p-4 text-center text-gray-500'>
				<p>Loading menu...</p>
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

	if (dishes.length === 0) {
		return (
			<div className='p-4 text-center text-gray-500'>
				<p>No dishes available at the moment.</p>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='mx-auto max-w-xl space-y-6'>
				<div>
					<label className='mb-1 block font-medium'>
						Filter by Category:
					</label>
					<div className='flex flex-wrap gap-2'>
						{uniqueCategories.map((category) => (
							<button
								key={category}
								onClick={() => toggleCategory(category)}
								className={`blur-xs rounded-sm border border-gray-200 px-4 py-2 shadow ${
									selectedCategories.includes(category)
										? 'bg-blue-600 text-white'
										: 'bg-gray-100'
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>
				<div>
					<label className='mb-1 block font-medium'>
						Search by Name:
					</label>
					<input
						type='text'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder='Enter dish name'
						className='blur-xs w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow'
					/>
				</div>

				<div className='flex gap-4'>
					<div className='flex-1'>
						<label className='mb-1 block font-medium'>
							Sort by:
						</label>
						<select
							value={sort}
							onChange={(e) =>
								setSort(e.target.value as SortType)
							}
							className='blur-xs w-full rounded-2xl border border-gray-200 bg-white shadow'
						>
							{sortOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
					<div className='flex-1'>
						<label className='mb-1 block font-medium'>
							Maximum Price:
						</label>
						<input
							type='number'
							value={maxPrice ?? ''}
							onChange={(e) => {
								const value: string = e.target.value;
								setMaxPrice(
									value === '' ? null : Number(value)
								);
							}}
							placeholder='Enter max price'
							className='blur-xs w-full rounded-2xl border border-gray-200 bg-white shadow'
							min='0'
							step='0.01'
						/>
					</div>
				</div>
			</div>

			<div className='space-y-4'>
				{filteredAndSortedDishes.length === 0 ? (
					<div className='p-4 text-center text-gray-500'>
						<p>No dishes match the selected filters.</p>
					</div>
				) : (
					filteredAndSortedDishes.map((dish: Dish) => (
						<Tile
							key={dish.id}
							dish={dish}
							onDishHidden={handleDishHidden}
						/>
					))
				)}
			</div>
		</div>
	);
}
