'use client';
import {
	useState,
	useRef,
	JSX,
	ChangeEvent,
	RefObject,
	useEffect,
} from 'react';
import Image from 'next/image';
import imageIcon from '@/public/icons/image-icon.svg';
import { ErrorResponse } from '../../types/loginRegister';
import { useUser } from '@/context/UserContext';
import { fetchAllergens } from '@/lib/api';
import { AllergenResponse } from '@/types/order';

export default function MenuForm(): JSX.Element {
	const { is_staff } = useUser();
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		category: 'Main Course',
		price: '',
		description: '',
		allergens: [] as number[], // Changed to number[]
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [allergens, setAllergens] = useState<AllergenResponse[]>([]);

	useEffect(() => {
		const loadAllergens: () => Promise<void> = async () => {
			try {
				const fetchedAllergens: AllergenResponse[] =
					await fetchAllergens();
				setAllergens(fetchedAllergens);
			} catch (error) {
				console.error('Failed to fetch allergens:', error);
			}
		};
		if (showForm) {
			loadAllergens();
		}
	}, [showForm]);

	const fileInputRef: RefObject<HTMLInputElement | null> =
		useRef<HTMLInputElement>(null);

	const handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void = (
		e: ChangeEvent<HTMLInputElement>
	): void => {
		const file: File | undefined = e.target.files?.[0];
		if (file) {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleChange: (
		e: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => void = (
		e: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	): void => {
		const { name, value } = e.target;
		if (name === 'allergens') {
			const { checked } = e.target as HTMLInputElement;
			const allergenId: number = Number(value); // Convert value to number
			setFormData((prev) => {
				if (checked) {
					// Add allergen ID to the array if checked
					return {
						...prev,
						allergens: [...prev.allergens, allergenId],
					};
				}
				// Remove allergen ID if unchecked
				return {
					...prev,
					allergens: prev.allergens.filter((id) => id !== allergenId),
				};
			});
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit: () => Promise<void> = async (): Promise<void> => {
		try {
			const dishData: FormData = new FormData();
			dishData.append('name', formData.name);
			dishData.append('description', formData.description);
			dishData.append('price', formData.price);
			dishData.append('category', formData.category);
			dishData.append('is_available', 'true');
			dishData.append('is_visible', 'true');

			dishData.append('allergen_ids', formData.allergens.toString());

			if (selectedFile) {
				dishData.append('image', selectedFile);
			}
			const res: Response = await fetch('/api/menu', {
				method: 'POST',
				body: dishData,
			});
			if (!res.ok) {
				const data: ErrorResponse = await res.json();
				throw new Error(data.detail || 'Failed to create dish');
			}

			alert('Dish created successfully');
			setShowForm(false);
			window.location.reload();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Unexpected error');
		}
	};

	return (
		<>
			{is_staff && (
				<div className='mx-auto max-w-md p-6'>
					<div className='flex items-center justify-between'>
						<h1 className='text-2xl font-bold text-gray-800'>
							Menu
						</h1>
						<button
							onClick={() => setShowForm((prev) => !prev)}
							className='rounded-lg bg-blue-500 px-4 py-2 font-medium text-white shadow transition hover:bg-blue-400'
						>
							{showForm ? 'Close Form' : 'Add Dish'}
						</button>
					</div>

					{showForm && (
						<form className='blur-xs mt-6 rounded-3xl border border-gray-200 bg-white p-8 shadow'>
							<h2 className='text-1da1f2 p-4 pl-0 text-2xl font-semibold text-gray-600'>
								Add Dish to <br />
								Menu
							</h2>

							<div className='pd-8 space-y-4'>
								<div>
									<label className='mb-1 block text-sm font-medium text-gray-600'>
										Dish Name
									</label>
									<input
										type='text'
										name='name'
										value={formData.name}
										onChange={handleChange}
										className='w-full rounded-xl border p-2'
										placeholder='Name of the dish'
									/>
								</div>
								<div>
									<label className='mb-1 block text-sm font-medium text-gray-600'>
										Dish Category
									</label>
									<select
										name='category'
										value={formData.category}
										onChange={handleChange}
										className='w-full rounded-xl border p-2 text-gray-500'
									>
										<option value='Main Course'>
											Main Course
										</option>
										<option value='Sushi'>Sushi</option>
										<option value='Snacks'>Snacks</option>
										<option value='Dessert'>Dessert</option>
									</select>
								</div>
								<div>
									<label className='mb-1 block text-sm font-medium text-gray-600'>
										Dish Price
									</label>
									<input
										type='number'
										step='0.01'
										name='price'
										value={formData.price}
										onChange={handleChange}
										className='w-full rounded-xl border p-2'
										placeholder='0.00'
									/>
								</div>
								<div>
									<label className='mb-1 block text-sm font-medium text-gray-600'>
										Description
									</label>
									<input
										type='text'
										name='description'
										value={formData.description}
										onChange={handleChange}
										className='w-full rounded-xl border p-2'
										placeholder='Description of the dish'
									/>
								</div>
								<div>
									<label className='mb-1 block text-sm font-medium text-gray-600'>
										Allergens
									</label>
									<div className='max-h-32 space-y-2 overflow-y-auto rounded-xl border p-2'>
										{allergens.map((allergen) => (
											<div
												key={allergen.id}
												className='flex items-center'
											>
												<input
													type='checkbox'
													name='allergens'
													value={allergen.id}
													checked={formData.allergens.includes(
														Number(allergen.id)
													)}
													onChange={handleChange}
													className='mr-2'
												/>
												<label className='text-gray-500'>
													{allergen.name}
												</label>
											</div>
										))}
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex w-1/3 flex-col'>
										<div className='mb-1 text-sm font-medium text-gray-600'>
											Choose Image
										</div>
										<div
											className='flex justify-center rounded-2xl border'
											onClick={() =>
												fileInputRef.current?.click()
											}
										>
											<input
												ref={fileInputRef}
												type='file'
												accept='image/*'
												onChange={handleFileChange}
												className='hidden'
											/>
											<div className='relative flex h-24 w-32 cursor-pointer justify-center'>
												{previewUrl ? (
													<Image
														src={previewUrl}
														alt='Preview'
														fill
														className='rounded-md object-cover'
													/>
												) : (
													<Image
														className='my-8'
														src={imageIcon}
														alt='missing icon'
													/>
												)}
											</div>
										</div>
									</div>

									<div className='flex self-center'>
										<button
											type='button'
											onClick={handleSubmit}
											className='rounded-md bg-blue-500 px-8 py-2 font-medium text-white shadow-md transition hover:bg-blue-400'
										>
											Add Dish
										</button>
									</div>
								</div>
							</div>
						</form>
					)}
				</div>
			)}
		</>
	);
}
