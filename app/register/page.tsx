/** @format */

import RegisterForm from '@/components/login/register-form';
import { Suspense } from 'react';

export default function RegisterPage(): React.ReactNode {
	return (
		<main className='flex items-center justify-center md:h-screen'>
			<div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>
				<Suspense>
					<RegisterForm />
				</Suspense>
			</div>
		</main>
	);
}
