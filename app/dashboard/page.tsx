import { DisplayArchivedOrders } from '@/components/archive/display-archived-orders';
import Reports from '../../components/dashboard/reports';

export default function Page(): React.ReactNode {
	return (
		<div className='space-y-4'>
			<DisplayArchivedOrders />
			<Reports />
		</div>
	);
}
