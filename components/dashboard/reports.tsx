'use client';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import SelectReport from '@/components/ui/select-report';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { getReport } from '@/lib/api';
import { ReportsResponse, ReportsData } from '@/types/order';

export default function Reports(): React.ReactNode {
	const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
		from: new Date(2025, 4, 1),
		to: addDays(new Date(2025, 4, 1), 3),
	});
	const [selectedReport, setSelectedReport] =
		useState<string>('overall_income');

	const [, setReportData] = useState<ReportsData>({
		start_date: new Date(2025, 3, 1),
		end_date: new Date(2025, 3, 1),
		filter_by: 'test',
	});
	const [reportResponse, setReportResponse] =
		useState<ReportsResponse | null>(null);

	const handleGenerate: () => Promise<void> = async () => {
		if (selectedDate?.from && selectedDate?.to && selectedReport) {
			const startDate: string = format(selectedDate.from, 'yyyy-MM-dd');
			const endDate: string = format(selectedDate.to, 'yyyy-MM-dd');
			const report: ReportsData = {
				start_date: new Date(startDate),
				end_date: new Date(endDate),
				filter_by: selectedReport,
			};
			setReportData(report);
			try {
				const response: ReportsResponse = await getReport(report);
				setReportResponse(response);
				console.log('Report fetched:', response);
			} catch (error) {
				console.error('Error fetching report:', error);
			}
		}
	};
	return (
		<div className='m-8 space-y-4 rounded-3xl border border-gray-200 p-8 shadow-sm'>
			<h1 className='pb-4 text-2xl font-bold'>Reports</h1>
			<div className='flex flex-col items-start space-y-8'>
				<div className='grid grid-cols-3'>
					<div className='grid grid-rows-2 items-center space-y-4'>
						<p className='text-gray-500'>Choose Date Range</p>
						<p className='text-gray-500'>Choose Filter</p>
					</div>
					<div className='grid grid-rows-2 items-center space-y-4'>
						<DatePicker
							value={selectedDate}
							onChange={setSelectedDate}
						/>
						<SelectReport
							value={selectedReport}
							onChange={setSelectedReport}
						/>
					</div>
				</div>
				<Button
					className='bg-blue-500 hover:bg-blue-700'
					onClick={handleGenerate}
				>
					Generate
				</Button>
				{reportResponse?.file_url && (
					<iframe
						src={reportResponse.file_url}
						title='Report PDF'
						width='100%'
						height='600px'
						style={{ border: 'none' }}
					/>
				)}
			</div>
		</div>
	);
}
