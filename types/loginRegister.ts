export interface User {
	username: string;
	password: string;
	email?: string;
}

export interface LoginUser {
	username: string;
	password: string;
}

export interface RegisterResponse {
	username: string;
	email: string;
	is_authenticated: boolean;
}

export interface LoginResponse {
	username: string;
	refresh: string;
	access: string;
}
export interface ErrorResponse {
	detail: string;
}

export interface AdminResponse {
	username: string;
	email: string;
	is_authenticated: boolean;
	is_staff: boolean;
}

export type HeadersInit = [string, string][] | Record<string, string> | Headers;
