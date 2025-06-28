/** @format */
'use client';
import { geistSans } from '@/app/fonts';
import {
	AtSymbolIcon,
	KeyIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../../components/ui/primaryButton';
import React, { useState } from 'react';

import { User } from '@/types/loginRegister';
import { useUser } from '@/context/UserContext';

export default function LoginForm(): React.ReactNode {
	const [formData, setFormData] = useState<User>({
		username: '',
		password: '',
	});
	const [message, setMessage] = useState<string>('');
	const [error, setError] = useState<string>('');
	const { setUsername } = useUser();

	const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit: (e: React.FormEvent) => Promise<void> = async (
		e: React.FormEvent
	) => {
		e.preventDefault();
		setMessage('');
		setError('');

		try {
			const response: Response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data: { username: string; detail?: string } =
				await response.json();

			if (!response.ok) {
				throw new Error(data.detail || 'Invalid credentials');
			}

			setMessage(`Logged in as ${data.username}!`);
			setFormData({ password: '', username: '' });
			setUsername(data.username);
			window.location.href = '/dashboard';
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: 'An error occurred during registration'
			);
		}
	};
	return (
		<form className='space-y-3' onSubmit={handleSubmit}>
			<div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
				<h1 className={`${geistSans.className} mb-3 text-2xl`}>
					Please log in to continue.
				</h1>
				<div className='w-full'>
					<div>
						<label
							className='mb-3 mt-5 block text-xs font-medium text-gray-900'
							htmlFor='username'
						>
							Username
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='username'
								type='username'
								name='username'
								placeholder='Enter your username'
								required
								onChange={handleChange}
							/>
							<AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
						</div>
					</div>
					<div className='mt-4'>
						<label
							className='mb-3 mt-5 block text-xs font-medium text-gray-900'
							htmlFor='password'
						>
							Password
						</label>
						<div className='relative'>
							<input
								className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
								id='password'
								type='password'
								name='password'
								placeholder='Enter password'
								required
								//minLength={6}
								onChange={handleChange}
							/>
							<KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
						</div>
					</div>
				</div>
				<Button type='submit' className='mb-4 mt-4 w-full'>
					Log in{' '}
					<ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
				</Button>
				<div className='flex h-8 items-end space-x-1'>
					{message && (
						<>
							<ExclamationCircleIcon className='h-5 w-5 text-green-500' />
							<p className='text-sm text-green-500'>{message}</p>
						</>
					)}
					{error && (
						<>
							<ExclamationCircleIcon className='h-10 w-7 text-red-500' />
							<p className='text-sm text-red-500'>{error}</p>
						</>
					)}
				</div>
			</div>
		</form>
	);
}
