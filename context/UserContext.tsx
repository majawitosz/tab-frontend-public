/** @format */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
	username: string | null;
	is_staff: boolean | null;
	setUsername: (username: string) => void;
}

const UserContext: React.Context<UserContextType | undefined> = createContext<
	UserContextType | undefined
>(undefined);

export function UserProvider({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	const [username, setUsernameState] = useState<string | null>(() => {
		// Initialize from localStorage if available
		if (typeof window !== 'undefined') {
			return localStorage.getItem('username') || null;
		}
		return null;
	});
	const [is_staff, setIsAdmin] = useState<boolean | null>(null);

	const setUsername: (username: string) => void = (
		username: string
	): void => {
		setUsernameState(username);
		if (typeof window !== 'undefined') {
			localStorage.setItem('username', username);
		}
	};

	useEffect(() => {
		const fetchUserRole: () => Promise<void> = async () => {
			if (username) {
				try {
					const response: Response = await fetch('/api/user', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					});

					const fetchedUserData: boolean | null =
						await response.json();

					console.log('Fetching user role for:', fetchedUserData);
					setIsAdmin(fetchedUserData);
				} catch (error) {
					console.error('Failed to fetch user role:', error);
					// setIsAdmin(false); // Fallback to false if fetch fails
				}
			} else {
				setIsAdmin(null); // Reset is_admin if no user is logged in
			}
		};

		fetchUserRole();
	}, [username]);

	// Clear username from localStorage on logout (optional, if needed)
	useEffect(() => {
		const handleLogout: () => void = (): void => {
			setUsernameState(null);
			setIsAdmin(null);
			localStorage.removeItem('username');
		};

		// You can listen for logout events or use a global state if needed
		window.addEventListener('logout', handleLogout);
		return (): void => window.removeEventListener('logout', handleLogout);
	}, []);

	return (
		<UserContext.Provider value={{ username, is_staff, setUsername }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser(): UserContextType {
	const context: UserContextType | undefined = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
}
