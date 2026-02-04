export const PRODUCT_CATEGORIES = [
  'Fruits & Vegetables',
  'Dairy & Bakery',
  'Staples',
  'Beverages',
  'Snacks & Branded Foods',
  'Beauty & Hygiene',
  'Cleaning & Household',
  'Meat & Seafood',
  'Baby Care',
  'Kitchen & Dining',
  'Pet Care',
  'Pharma & Wellness'
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const TAX_CLASSES = [
  'Standard Rate',
  'Reduced Rate',
  'Tax Exempt'
] as const;

export type TaxClass = (typeof TAX_CLASSES)[number];

export const PRODUCT_SUBCATEGORIES = {
  'Fruits & Vegetables': [
    'Fresh Fruits',
    'Fresh Vegetables',
    'Cut Fruits & Juices',
    'Exotic Fruits & Veggies',
    'Herbs & Seasonings',
    'Organic Fruits & Vegetables',
    'Local Seasonal Fruits',
    'Leafy Greens',
    'Root Vegetables',
    'Onions, Tomatoes & Potatoes'
  ],
  'Dairy & Bakery': [
    'Milk & Dairy Drinks',
    'Curd & Yogurt',
    'Paneer & Cheese',
    'Butter & Ghee',
    'Bread & Buns',
    'Biscuits & Cookies',
    'Cakes & Pastries',
    'Ready to Eat',
    'Dairy Alternatives',
    'Fresh Breads & Buns'
  ],
  'Staples': [
    'Rice & Rice Products',
    'Atta & Flours',
    'Dals & Pulses',
    'Edible Oils',
    'Ghee & Vanaspati',
    'Salt, Sugar & Jaggery',
    'Dry Fruits & Nuts',
    'Masalas & Spices',
    'Pickles & Chutneys',
    'Grains & Millets',
    'Pasta, Noodles & Sauces',
    'Soups & Broths',
    'Instant Mixes',
    'Breakfast Cereals'
  ],
  'Beverages': [
    'Tea & Coffee',
    'Soft Drinks',
    'Fruit Juices',
    'Energy Drinks',
    'Water & Flavoured Water',
    'Syrups & Concentrates',
    'Health Drinks',
    'Carbonated Drinks',
    'Cold Pressed Juices',
    'Milk Based Beverages'
  ],
  'Snacks & Branded Foods': [
    'Chips & Namkeen',
    'Biscuits & Cookies',
    'Chocolates & Candies',
    'Ready to Cook',
    'Frozen Snacks',
    'Instant Foods',
    'Healthy Snacks',
    'Sauces & Spreads',
    'Pickles & Condiments',
    'Namkeen & Farsan',
    'Sweets & Mithai',
    'Traditional Snacks'
  ],
  'Beauty & Hygiene': [
    'Skin Care',
    'Hair Care',
    'Oral Care',
    'Body & Bath',
    'Feminine Care',
    'Deodorants & Perfumes',
    'Make-up',
    'Men\'s Grooming',
    'Baby Care',
    'Ayurvedic & Natural',
    'Cosmetics',
    'Sanitizers & Handwash'
  ],
  'Cleaning & Household': [
    'Detergents & Fabric Care',
    'Dishwashing',
    'Cleaners & Disinfectants',
    'Pooja Needs',
    'Repellents',
    'Tissues & Napkins',
    'Garbage Bags',
    'Stationery',
    'Batteries',
    'Cleaning Tools',
    'Air Fresheners',
    'Kitchen Accessories'
  ],
  'Meat & Seafood': [
    'Chicken',
    'Mutton',
    'Fish',
    'Prawns & Seafood',
    'Eggs',
    'Processed Meats',
    'Organ Meats',
    'Marinated Items',
    'Ready to Cook Meat',
    'Frozen Non-Veg'
  ],
  'Baby Care': [
    'Diapers & Wipes',
    'Baby Food',
    'Formula Milk',
    'Baby Care',
    'Toys & Accessories',
    'Feeding Essentials',
    'Baby Skin Care',
    'Clothing & Accessories',
    'Health & Safety',
    'Toiletries'
  ],
  'Kitchen & Dining': [
    'Cookware',
    'Dinnerware',
    'Utensils',
    'Storage & Containers',
    'Kitchen Appliances',
    'Bakeware',
    'Food Storage',
    'Cleaning Supplies',
    'Table Linen',
    'Serving Utensils'
  ],
  'Pet Care': [
    'Dog Food',
    'Cat Food',
    'Pet Toys',
    'Pet Grooming',
    'Pet Accessories',
    'Pet Health',
    'Bird Food',
    'Fish Food',
    'Small Animal Food',
    'Pet Training'
  ],
  'Pharma & Wellness': [
    'Prescription Medicines',
    'OTC Medicines',
    'Vitamins & Supplements',
    'Ayurvedic Medicine',
    'First Aid',
    'Medical Devices',
    'Health Monitors',
    'Wellness Products',
    'Nutritional Drinks',
    'Personal Care Medicines'
  ]
} as const;

export type ProductSubCategory = {
  [K in ProductCategory]: readonly string[];
}[ProductCategory];

// Export individual subcategory types
export type FruitVegetableSubCategory = typeof PRODUCT_SUBCATEGORIES['Fruits & Vegetables'][number];
export type DairyBakerySubCategory = typeof PRODUCT_SUBCATEGORIES['Dairy & Bakery'][number];
export type StaplesSubCategory = typeof PRODUCT_SUBCATEGORIES['Staples'][number];
export type BeverageSubCategory = typeof PRODUCT_SUBCATEGORIES['Beverages'][number];
export type SnackSubCategory = typeof PRODUCT_SUBCATEGORIES['Snacks & Branded Foods'][number];
export type BeautySubCategory = typeof PRODUCT_SUBCATEGORIES['Beauty & Hygiene'][number];
export type CleaningSubCategory = typeof PRODUCT_SUBCATEGORIES['Cleaning & Household'][number];
export type MeatSubCategory = typeof PRODUCT_SUBCATEGORIES['Meat & Seafood'][number];
export type BabySubCategory = typeof PRODUCT_SUBCATEGORIES['Baby Care'][number];
export type KitchenSubCategory = typeof PRODUCT_SUBCATEGORIES['Kitchen & Dining'][number];
export type PetSubCategory = typeof PRODUCT_SUBCATEGORIES['Pet Care'][number];
export type PharmaSubCategory = typeof PRODUCT_SUBCATEGORIES['Pharma & Wellness'][number];