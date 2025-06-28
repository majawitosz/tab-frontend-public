/** @format */

import SideNav from '@/components/dashboard/sidenav';
import { CartProvider } from '@/components/cart/cart';
import { CartDisplay } from '@/components/cart/cart-display';

export default function Layout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactNode {
	return (
		<CartProvider>
			<div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
				<div className='w-full flex-none md:w-64'>
					<SideNav />
				</div>
				<div className='flex-grow p-6 md:overflow-y-auto md:p-12'>
					{children}
				</div>
				<div className='w-1/5 border-l border-gray-300 bg-gray-100 p-4'>
					<CartDisplay />
				</div>
			</div>
		</CartProvider>
	);
}
