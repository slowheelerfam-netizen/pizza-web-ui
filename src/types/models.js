export const ORDER_STATUS = {
  NEW: 'NEW',
  CONFIRMED: 'QUEUED',
  IN_PREP: 'IN_PREP',
  PREP: 'PREP',
  OVEN: 'OVEN',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

export const PIZZA_SIZES = {
  SMALL: { id: 'sm', label: 'Small (10")', priceMultiplier: 0.8 },
  MEDIUM: { id: 'md', label: 'Medium (12")', priceMultiplier: 1.0 },
  LARGE: { id: 'lg', label: 'Large (14")', priceMultiplier: 1.2 },
  XL: { id: 'xl', label: 'X-Large (16")', priceMultiplier: 1.5 },
}

export const CRUST_TYPES = {
  THIN: { id: 'thin', label: 'Thin Crust', price: 0 },
  ORIGINAL: { id: 'original', label: 'Original Hand Tossed', price: 0 },
  DEEP: { id: 'deep', label: 'Deep Dish', price: 2 },
  GF: { id: 'gf', label: 'Gluten Free', price: 3 },
}

export const TOPPINGS = {
  BBQ_SAUCE: { id: 'BBQ_SAUCE', label: 'BBQ Sauce', price: 2 },
  CHICKEN: { id: 'CHICKEN', label: 'Chicken', price: 2 },
  GROUND_BEEF: { id: 'GROUND_BEEF', label: 'Ground Beef', price: 2 },
  HAM: { id: 'HAM', label: 'Ham', price: 2 },
  BACON: { id: 'BACON', label: 'Bacon', price: 2 },
  PEPPERONI: { id: 'PEPPERONI', label: 'Pepperoni', price: 2 },
  SAUSAGE: { id: 'SAUSAGE', label: 'Sausage', price: 2 },
  PINEAPPLE: { id: 'PINEAPPLE', label: 'Pineapple', price: 2 },
  MUSHROOMS: { id: 'MUSHROOMS', label: 'Mushrooms', price: 2 },
  ONIONS: { id: 'ONIONS', label: 'Onions', price: 2 },
  RED_ONIONS: { id: 'RED_ONIONS', label: 'Red Onions', price: 2 },
  PEPPERS: { id: 'PEPPERS', label: 'Red/Yellow Peppers', price: 2 },
  JALAPENOS: { id: 'JALAPENOS', label: 'Jalapeños', price: 2 },
  OLIVES: { id: 'OLIVES', label: 'Olives', price: 2 },
  TOMATOES: { id: 'TOMATOES', label: 'Tomatoes', price: 2 },
  BASIL: { id: 'BASIL', label: 'Fresh Basil', price: 2 },
  CILANTRO: { id: 'CILANTRO', label: 'Cilantro', price: 2 },
  GARLIC: { id: 'GARLIC', label: 'Garlic', price: 2 },
  PARMESAN: { id: 'PARMESAN', label: 'Parmesan Cheese', price: 2 },
  EXTRA_CHEESE: { id: 'EXTRA_CHEESE', label: 'Extra Cheese', price: 2 },
  STEAK_SAUCE: { id: 'STEAK_SAUCE', label: 'Creamy Steak Sauce', price: 2 },
}

export const MENU_ITEMS = [
  {
    id: 'm1',
    name: 'Margherita',
    basePrice: 10,
    description: 'Classic tomato sauce and mozzarella',
    defaultToppings: ['BASIL'],
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Fresh Basil'],
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'm2',
    name: 'Pepperoni',
    basePrice: 12,
    description: 'A classic favorite with generous pepperoni',
    defaultToppings: ['PEPPERONI'],
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'm3',
    name: 'BBQ Chicken',
    basePrice: 15,
    description: 'A tangy and sweet BBQ chicken pizza',
    defaultToppings: ['CHICKEN', 'RED_ONIONS', 'PINEAPPLE', 'BBQ_SAUCE', 'CILANTRO'],
    ingredients: [
      'BBQ Sauce',
      'Mozzarella',
      'Chicken',
      'Red Onion',
      'Pineapple',
      'Cilantro',
    ],
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'm4',
    name: 'Veggie',
    basePrice: 14,
    description: 'Loaded with fresh vegetables',
    defaultToppings: ['TOMATOES', 'GARLIC', 'MUSHROOMS', 'ONIONS', 'OLIVES', 'PARMESAN'],
    ingredients: [
      'Tomato Sauce',
      'Mozzarella',
      'Tomatoes',
      'Garlic',
      'Mushrooms',
      'Onions',
      'Olives',
      'Parmesan Cheese',
    ],
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'm5',
    name: 'Hawaiian',
    basePrice: 14,
    description: 'A sweet and savory pizza',
    defaultToppings: ['PEPPERS', 'OLIVES', 'CILANTRO', 'ONIONS'],
    ingredients: [
      'Tomato Sauce',
      'Mozzarella',
      'Red/Yellow Peppers',
      'Olives',
      'Cilantro',
      'Onions',
    ],
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'm6',
    name: 'Supreme',
    basePrice: 16,
    description: 'The ultimate pizza experience',
    defaultToppings: ['GROUND_BEEF', 'SAUSAGE', 'OLIVES', 'STEAK_SAUCE'],
    ingredients: [
      'Tomato Sauce',
      'Mozzarella',
      'Ground Beef',
      'Sausage',
      'Olives',
      'Creamy Steak Sauce',
    ],
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
  },
]
