import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface SelectProps {
	value: string | undefined;
	onChange: (value: string | '') => void;
}

export default function SelectReport({
	value,
	onChange,
}: SelectProps): React.ReactNode {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Filter By' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value='overall_income'>
						Overall income
					</SelectItem>
					<SelectItem value='dish_popularity'>
						Dish Popularity
					</SelectItem>
					<SelectItem value='dish_income'>Dish income</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
