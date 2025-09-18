// Internationalization support for English and Luganda

export type Language = 'en' | 'lg'

export interface Translations {
  // Navigation
  home: string
  categories: string
  products: string
  cart: string
  login: string
  register: string
  profile: string
  logout: string
  
  // Common
  search: string
  searchPlaceholder: string
  addToCart: string
  buyNow: string
  price: string
  quantity: string
  total: string
  subtotal: string
  shipping: string
  tax: string
  discount: string
  
  // Product
  product: string
  productDetails: string
  description: string
  specifications: string
  reviews: string
  rating: string
  inStock: string
  outOfStock: string
  lowStock: string
  new: string
  sale: string
  
  // Cart & Checkout
  shoppingCart: string
  cartEmpty: string
  cartEmptyMessage: string
  startShopping: string
  proceedToCheckout: string
  continueShopping: string
  removeItem: string
  updateQuantity: string
  clearCart: string
  
  // Payment
  paymentMethod: string
  mtnMobileMoney: string
  airtelMoney: string
  visa: string
  mastercard: string
  paymentDetails: string
  confirmPayment: string
  
  // User Account
  myAccount: string
  myOrders: string
  myWishlist: string
  myAddresses: string
  orderHistory: string
  orderTracking: string
  
  // Seller Dashboard
  sellerDashboard: string
  addProduct: string
  manageProducts: string
  salesReport: string
  earnings: string
  inventory: string
  
  // Admin Dashboard
  adminDashboard: string
  userManagement: string
  productManagement: string
  orderManagement: string
  analytics: string
  disputes: string
  
  // Order Status
  pending: string
  processing: string
  shipped: string
  delivered: string
  cancelled: string
  
  // Messages
  success: string
  error: string
  loading: string
  noResults: string
  tryAgain: string
  
  // Categories
  electronics: string
  mobilePhones: string
  gaming: string
  laptops: string
  homeKitchen: string
  babyCare: string
  beautyHealth: string
  groceries: string
  furniture: string
  eyewear: string
  watches: string
  sportsFitness: string
  automotive: string
  stationery: string
  fashion: string
  booksMedia: string
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: 'Home',
    categories: 'Categories',
    products: 'Products',
    cart: 'Cart',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    logout: 'Logout',
    
    // Common
    search: 'Search',
    searchPlaceholder: 'Search products...',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    discount: 'Discount',
    
    // Product
    product: 'Product',
    productDetails: 'Product Details',
    description: 'Description',
    specifications: 'Specifications',
    reviews: 'Reviews',
    rating: 'Rating',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    new: 'New',
    sale: 'Sale',
    
    // Cart & Checkout
    shoppingCart: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    cartEmptyMessage: 'Looks like you haven\'t added any items to your cart yet.',
    startShopping: 'Start Shopping',
    proceedToCheckout: 'Proceed to Checkout',
    continueShopping: 'Continue Shopping',
    removeItem: 'Remove Item',
    updateQuantity: 'Update Quantity',
    clearCart: 'Clear Cart',
    
    // Payment
    paymentMethod: 'Payment Method',
    mtnMobileMoney: 'MTN Mobile Money',
    airtelMoney: 'Airtel Money',
    visa: 'Visa',
    mastercard: 'Mastercard',
    paymentDetails: 'Payment Details',
    confirmPayment: 'Confirm Payment',
    
    // User Account
    myAccount: 'My Account',
    myOrders: 'My Orders',
    myWishlist: 'My Wishlist',
    myAddresses: 'My Addresses',
    orderHistory: 'Order History',
    orderTracking: 'Order Tracking',
    
    // Seller Dashboard
    sellerDashboard: 'Seller Dashboard',
    addProduct: 'Add Product',
    manageProducts: 'Manage Products',
    salesReport: 'Sales Report',
    earnings: 'Earnings',
    inventory: 'Inventory',
    
    // Admin Dashboard
    adminDashboard: 'Admin Dashboard',
    userManagement: 'User Management',
    productManagement: 'Product Management',
    orderManagement: 'Order Management',
    analytics: 'Analytics',
    disputes: 'Disputes',
    
    // Order Status
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Messages
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    noResults: 'No results found',
    tryAgain: 'Try Again',
    
    // Categories
    electronics: 'Electronics',
    mobilePhones: 'Mobile Phones',
    gaming: 'Gaming',
    laptops: 'Laptops & Computers',
    homeKitchen: 'Home & Kitchen',
    babyCare: 'Baby Care',
    beautyHealth: 'Beauty & Health',
    groceries: 'Groceries',
    furniture: 'Furniture',
    eyewear: 'Eyewear',
    watches: 'Watches',
    sportsFitness: 'Sports & Fitness',
    automotive: 'Automotive',
    stationery: 'Stationery',
    fashion: 'Fashion',
    booksMedia: 'Books & Media'
  },
  
  lg: {
    // Navigation
    home: 'Awaka',
    categories: 'Ebika',
    products: 'Ebintu',
    cart: 'Ggali',
    login: 'Tandika',
    register: 'Wandika',
    profile: 'Obulamu bwo',
    logout: 'Fuluma',
    
    // Common
    search: 'Noonya',
    searchPlaceholder: 'Noonya ebintu...',
    addToCart: 'Ggako mu ggali',
    buyNow: 'Gula kati',
    price: 'Omuwendo',
    quantity: 'Obungi',
    total: 'Omugatte',
    subtotal: 'Omugatte omutono',
    shipping: 'Okutuma',
    tax: 'Omusolo',
    discount: 'Okukendeeza',
    
    // Product
    product: 'Ekintu',
    productDetails: 'Ebikwata ku kintu',
    description: 'Enkola',
    specifications: 'Ebikwata ku kintu',
    reviews: 'Ebyogerwako',
    rating: 'Omukisa',
    inStock: 'Mulimu',
    outOfStock: 'Temulimu',
    lowStock: 'Mulimu mutono',
    new: 'Kipya',
    sale: 'Okugula',
    
    // Cart & Checkout
    shoppingCart: 'Ggali ly\'okugula',
    cartEmpty: 'Ggali lyo limu',
    cartEmptyMessage: 'Kirabika toli gako kintu kyonna mu ggali lyo.',
    startShopping: 'Tandika okugula',
    proceedToCheckout: 'Genda mu kugula',
    continueShopping: 'Era okugula',
    removeItem: 'Ggyako ekintu',
    updateQuantity: 'Kyusa obungi',
    clearCart: 'Sangula ggali',
    
    // Payment
    paymentMethod: 'Enkola y\'okusasula',
    mtnMobileMoney: 'MTN Mobile Money',
    airtelMoney: 'Airtel Money',
    visa: 'Visa',
    mastercard: 'Mastercard',
    paymentDetails: 'Ebikwata ku musasulo',
    confirmPayment: 'Kakasa musasulo',
    
    // User Account
    myAccount: 'Akawunti kange',
    myOrders: 'Amagulu gange',
    myWishlist: 'Ebyo nnyiga',
    myAddresses: 'Ennaku zange',
    orderHistory: 'Ebyafaayo by\'amagulu',
    orderTracking: 'Okulonda amagulu',
    
    // Seller Dashboard
    sellerDashboard: 'Omukutu gw\'omuguzi',
    addProduct: 'Ggako ekintu',
    manageProducts: 'Kola ebintu',
    salesReport: 'Ripooti y\'okugula',
    earnings: 'Eby\'omugatte',
    inventory: 'Ebintu ebirimu',
    
    // Admin Dashboard
    adminDashboard: 'Omukutu gw\'omukulembeze',
    userManagement: 'Okukola abantu',
    productManagement: 'Okukola ebintu',
    orderManagement: 'Okukola amagulu',
    analytics: 'Okunonyereza',
    disputes: 'Eby\'okukwatagana',
    
    // Order Status
    pending: 'Kitegereze',
    processing: 'Kikola',
    shipped: 'Kituumiddwa',
    delivered: 'Kituumiddwa',
    cancelled: 'Kikangiddwa',
    
    // Messages
    success: 'Kikola',
    error: 'Kireme okukola',
    loading: 'Kikola...',
    noResults: 'Tewali byo byasangiddwa',
    tryAgain: 'Ddamu okugezaako',
    
    // Categories
    electronics: 'Ebintu by\'amagye',
    mobilePhones: 'Simu',
    gaming: 'Emizannyo',
    laptops: 'Kampyuta',
    homeKitchen: 'Awaka n\'ekyombo',
    babyCare: 'Okukola abaana',
    beautyHealth: 'Obulungi n\'obulamu',
    groceries: 'Eby\'okulya',
    furniture: 'Ebintu by\'awaka',
    eyewear: 'Amalaso',
    watches: 'Essawa',
    sportsFitness: 'Emizannyo n\'obulamu',
    automotive: 'Emotoka',
    stationery: 'Ebintu by\'okuwandiika',
    fashion: 'Empisa',
    booksMedia: 'Ebitabo n\'ebikwata ku bantu'
  }
}

// Language context and hooks
let currentLanguage: Language = 'en'

export function setLanguage(language: Language) {
  currentLanguage = language
  localStorage.setItem('beisie-language', language)
}

export function getLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('beisie-language') as Language
    if (saved && (saved === 'en' || saved === 'lg')) {
      currentLanguage = saved
    }
  }
  return currentLanguage
}

export function t(key: keyof Translations): string {
  return translations[currentLanguage][key] || translations.en[key] || key
}

// Initialize language from localStorage
if (typeof window !== 'undefined') {
  getLanguage()
}

// Language switcher component data
export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'lg', name: 'Luganda', flag: '🇺🇬' }
]
