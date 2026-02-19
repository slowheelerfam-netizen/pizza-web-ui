'use client';

import { useState, useMemo } from 'react';
import { MENU_ITEMS } from '../types/models';
import CustomerPizzaBuilder from './CustomerPizzaBuilder';
import CheckoutModal from './CheckoutModal';


// This is the local pizza data with layout information.
// In a real app, this might be merged with the MENU_ITEMS data.
const pizzasWithLayout = [
  {
    id: 'm1',
    name: 'Margherita',
    basePrice: 10,
    defaultToppings: ['BASIL'],
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Basil'],
    imageUrl: '/images/pizzas/margherita.jpg',
    layout: {
      textContainer: 'absolute top-0 left-0 right-0 pt-4 pr-4 pb-4 pl-0 z-10',
      textClass: 'text-white text-xl font-bold text-left',
      imageContainer: 'absolute inset-0',
      image: 'w-full h-full object-fill transition-transform duration-300 ease-in-out group-hover:scale-110',
      imageStyle: { transform: 'scale(1.0) translateY(-5%) translateX(0%)' },
      gradient: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)',
    },
  },
  {
    id: 'm2',
    name: 'Pepperoni',
    basePrice: 12,
    defaultToppings: ['PEPPERONI'],
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
    imageUrl: '/images/pizzas/pepperoni.jpg',
    layout: {
      textContainer: 'absolute bottom-0 left-0 right-0 p-4 z-10',
      textClass: 'text-white text-xl font-bold text-right',
      imageContainer: 'absolute inset-0',
      image: 'w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110',
      imageStyle: { transform: 'scale(1.6) translateY(-25%) translateX(0%)' },
      gradient: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)',
    },
  },
    {
    id: 'm3',
    name: 'BBQ Chicken',
    basePrice: 15,
    defaultToppings: ['CHICKEN', 'RED_ONIONS', 'PINEAPPLE', 'BBQ_SAUCE', 'CILANTRO'],
    ingredients: ['BBQ Sauce', 'Mozzarella', 'Chicken', 'Red Onion', 'Pineapple', 'Cilantro'],
    imageUrl: '/images/pizzas/bbq-chicken.jpg',
    layout: {
      textContainer: 'absolute top-0 left-0 right-0 p-4 z-10',
      textClass: 'text-white text-xl font-bold text-right',
      imageContainer: 'absolute inset-0',
      image: 'w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110',
      imageStyle: { transform: 'scale(1.6) translateY(20%) translateX(-5%)' },
      gradient: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)',
    },
  },
  {
    id: 'm4',
    name: 'Veggie',
    basePrice: 14,
    defaultToppings: ['TOMATOES', 'GARLIC', 'MUSHROOMS', 'ONIONS', 'OLIVES', 'PARMESAN'],
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Tomatoes', 'Garlic', 'Mushrooms', 'Onions', 'Olives', 'Parmesan Cheese'],
    imageUrl: '/images/pizzas/veggie.jpg',
    layout: {
      textContainer: 'absolute top-0 left-0 right-0 p-4 z-10',
      textClass: 'text-white text-xl font-bold text-right',
      imageContainer: 'absolute inset-0',
      image: 'w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110',
      imageStyle: { transform: 'scale(1.8) translateY(-10%) translateX(-15%)' },
      gradient: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)',
    },
  },
  {
    id: 'm5',
    name: 'Hawaiian',
    basePrice: 14,
    defaultToppings: ['PEPPERS', 'OLIVES', 'CILANTRO', 'ONIONS'],
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Red/Yellow Peppers', 'Olives', 'Cilantro', 'Onions'],
    imageUrl: '/images/pizzas/hawaiian.jpg',
    layout: {
      textContainer: 'absolute bottom-0 left-0 right-0 p-4 z-10',
      textClass: 'text-white text-xl font-bold text-right',
      imageContainer: 'absolute inset-0',
      image: 'w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110',
      imageStyle: { transform: 'scale(2.2) translateY(-20%) translateX(-15%)' },
      gradient: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)',
    },
  },
  {
    id: 'm6',
    name: 'Supreme',
    basePrice: 16,
    defaultToppings: ['GROUND_BEEF', 'SAUSAGE', 'OLIVES', 'STEAK_SAUCE'],
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Ground Beef', 'Sausage', 'Olives', 'Creamy Steak Sauce'],
    imageUrl: '/images/pizzas/supreme.jpg',
    layout: {
      textContainer: 'absolute bottom-0 left-0 right-0 p-4 z-10',
      textClass: 'text-white text-xl font-bold text-left',
      imageContainer: 'absolute inset-0',
      image: 'w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110',
      imageStyle: { transform: 'scale(1.3) translateY(-10%)', objectPosition: 'center 70%' },
      gradient: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)',
    },
  },
];

function CartIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

export default function PizzaMenu({ createOrderAction }) {
  const [cart, setCart] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handlePizzaClick = (pizza) => {
    setSelectedPizza(pizza);
    setIsBuilderOpen(true);
  };

  const handleCloseBuilder = () => {
    setIsBuilderOpen(false);
    setSelectedPizza(null);
  };

  const handleAddToCart = (pizzaItem) => {
    setCart((prevCart) => [...prevCart, pizzaItem]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const handleOrderPlaced = () => {
    setCart([]); // Clear cart after successful order
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-white text-left mb-8 w-full max-w-6xl px-4">Popular Items</h2>
      <div className="flex flex-wrap justify-center gap-8 px-4">
        {pizzasWithLayout.map((pizza) => (
          <div
            key={pizza.id}
            onClick={() => handlePizzaClick(pizza)}
            className="group relative cursor-pointer rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.8)] w-80 h-64 overflow-hidden"
            style={{
              maskImage: 'radial-gradient(ellipse, black 60%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse, black 60%, transparent 100%)',
            }}
          >
            <div className={pizza.layout.imageContainer}>
              <img 
                src={pizza.imageUrl} 
                alt={pizza.name} 
                className={pizza.layout.image}
                style={pizza.layout.imageStyle}
              />
            </div>
            <div className={pizza.layout.textContainer} style={{ background: pizza.layout.gradient }}>
              <div className={pizza.layout.textClass}>
                <h3>{pizza.name}</h3>
                <p>${pizza.basePrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-4 rounded-full bg-indigo-600 px-6 py-4 text-white shadow-2xl shadow-indigo-500/50 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <CartIcon />
              <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                {cartItemCount}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight">Checkout</p>
              <p className="text-lg font-bold">${cartTotal.toFixed(2)}</p>
            </div>
          </button>
        </div>
      )}

      <CustomerPizzaBuilder
        isOpen={isBuilderOpen}
        onClose={handleCloseBuilder}
        pizza={selectedPizza}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        createOrderAction={createOrderAction}
        onOrderPlaced={handleOrderPlaced}
      />    </>
  );
}
