'use client';

import React, { createContext, useContext, useState } from 'react';
import { Dish } from '@/types/order'; // Import the new Dish type

interface CartContextType {
	cart: Dish[];
	addToCart: (dish: Dish) => void;
	removeFromCart: (dishId: number) => void;
	clearCart: () => void;
}

const CartContext: React.Context<CartContextType | undefined> = createContext<
	CartContextType | undefined
>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [cart, setCart] = useState<Dish[]>([]);

	const addToCart: (dish: Dish) => void = (dish) => {
		setCart((prevCart) => {
			const existingItem: Dish | undefined = prevCart.find(
				(item) => item.id === dish.id
			);
			if (existingItem) {
				return prevCart.map((item) =>
					item.id === dish.id
						? { ...item, quantity: (item.quantity || 0) + 1 }
						: item
				);
			}
			return [...prevCart, { ...dish, quantity: 1 }];
		});
	};

	const removeFromCart: (dishId: number) => void = (dishId) => {
		setCart((prevCart) => prevCart.filter((item) => item.id !== dishId));
	};

	const clearCart: () => void = () => {
		setCart([]);
	};

	return (
		<CartContext.Provider
			value={{ cart, addToCart, removeFromCart, clearCart }}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart: () => CartContextType = () => {
	const context: CartContextType | undefined = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
};
