import { useState, useEffect } from 'react';
import { Listing } from '../lib/firebase';

interface CartItem extends Listing {
  quantity: number;
  rentalDays: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kirayawale_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kirayawale_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (listing: Listing, rentalDays: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === listing.id);
      
      if (existingItem) {
        // Update existing item
        return prev.map(item =>
          item.id === listing.id
            ? { ...item, quantity: item.quantity + 1, rentalDays }
            : item
        );
      } else {
        // Add new item
        return [...prev, { ...listing, quantity: 1, rentalDays }];
      }
    });
  };

  const removeFromCart = (listingId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== listingId));
  };

  const updateQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(listingId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === listingId ? { ...item, quantity } : item
      )
    );
  };

  const updateRentalDays = (listingId: string, rentalDays: number) => {
    if (rentalDays <= 0) return;

    setCartItems(prev =>
      prev.map(item =>
        item.id === listingId ? { ...item, rentalDays } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price_per_day * item.quantity * item.rentalDays);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateRentalDays,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
};