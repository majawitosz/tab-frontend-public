/** @format */
'use client';
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from '@/components/dashboard/nav-links';

import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { UserCircleIcon, CogIcon } from '@heroicons/react/24/outline';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useEffect, useState } from 'react';

export default function SideNav(): React.ReactNode {
	const { username, is_staff } = useUser();
	const router: AppRouterInstance = useRouter();
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	const handleSignOut: () => Promise<void> = async (): Promise<void> => {
		await fetch('/api/logout', {
			method: 'POST',
			credentials: 'include',
		}).catch((err) => console.error('Logout failed:', err));
		router.push('/login');
	};

	return (
		<div className='flex h-full flex-col px-3 py-4 md:px-2'>
			<Link
				className='mb-2 flex h-40 items-center justify-center rounded-md'
				style={{ backgroundColor: '#EDE3D8' }}
				href='/'
			>
				<div className='w-32 text-white md:w-40'>
					<Image
						src='/LogoRestauracji.png'
						alt='Logo Restauracji'
						width={160}
						height={80}
						className='object-contain'
						priority
					/>
				</div>
			</Link>
			<div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
				<NavLinks />
				<div className='hidden grow bg-gray-50 md:block'> </div>
				{is_staff && (
					<div className='hidden h-[48px] grow items-center justify-center gap-2 rounded-md bg-lime-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex md:flex-none md:justify-start md:p-2 md:px-3'>
						<CogIcon className='w-6' />
						<p className='hidden md:block'>Admin </p>
					</div>
				)}

				<div className='hidden h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex md:flex-none md:justify-start md:p-2 md:px-3'>
					<UserCircleIcon className='w-6' />
					<p className='hidden md:block'>
						{isMounted ? username : ''}
					</p>
				</div>

				<form>
					<button
						type='button'
						onClick={handleSignOut}
						className='flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
					>
						<PowerIcon className='w-6' />
						<div className='hidden md:block'>Sign Out</div>
					</button>
				</form>
			</div>
		</div>
	);
}
