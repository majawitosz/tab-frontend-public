/** @format */
'use client';
import {
	HomeIcon,
	RectangleStackIcon,
	ClipboardIcon,
	ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentType, SVGProps } from 'react';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
interface NavLink {
	name: string;
	href: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>; // Typ dla komponentu ikony
}

const links: NavLink[] = [
	{ name: 'Home', href: '/dashboard', icon: HomeIcon },
	{
		name: 'Menu',
		href: '/dashboard/menu',
		icon: ClipboardIcon,
	},
	{
		name: 'Orders',
		href: '/dashboard/orders',
		icon: ClipboardDocumentCheckIcon,
	},
	{ name: 'Archive', href: '/dashboard/archive', icon: RectangleStackIcon },
];

export default function NavLinks(): React.ReactNode {
	const pathname: string = usePathname();
	return (
		<>
			{links.map((link: NavLink) => {
				const LinkIcon: ComponentType<SVGProps<SVGSVGElement>> =
					link.icon;
				return (
					<Link
						key={link.name}
						href={link.href}
						className={clsx(
							'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
							{
								'bg-sky-100 text-blue-600':
									pathname === link.href,
							}
						)}
					>
						<LinkIcon className='w-6' />
						<p className='hidden md:block'>{link.name}</p>
					</Link>
				);
			})}
		</>
	);
}
