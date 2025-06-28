export type Allergen = {
	id: number;
	name: string;
	description: string;
};

export type Dish = {
	id?: number;
	name: string;
	description: string;
	price: number;
	category: string;
	is_available: boolean;
	is_visible: boolean;
	image_url?: File;
	allergens?: Allergen[];
	quantity?: number;
};

export interface OrdersData {
	tableId: number;
	estimatedTime: number;
	createdAt: Date;
	totalPrice: number;
	notes?: string;
	dishes: Dish[];
}
export interface OrdersDataResponse {
	id: number;
	table_number: number;
	estimated_time: number;
	status: string;
	created_at: Date;
	total_amount: number;
	notes: string;
	items: Dish[];
}

export interface ReportsData {
	start_date: Date;
	end_date: Date;
	filter_by: string;
}

export interface ReportsResponse {
	file_url: string;
}

export interface AllergenResponse {
	id: number;
	name: string;
	description: string;
}
