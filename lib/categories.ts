export const categories = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Latest gadgets and tech devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    slug: 'electronics',
    productCount: 150
  },
  {
    id: '2',
    name: 'Mobiles and Accessories',
    description: 'Smartphones and accessories',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    slug: 'mobile-phones',
    productCount: 200,
    subcategories: [
      {
        id: '2.1',
        name: 'Power Banks',
        description: 'Portable chargers and power banks',
        image: 'https://images.unsplash.com/photo-1609592807900-90b239be3a8f?w=400&h=300&fit=crop',
        slug: 'power-banks',
        productCount: 45
      },
      {
        id: '2.2',
        name: 'Headphones & Earphones',
        description: 'Wireless and wired audio devices',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        slug: 'headphones-earphones',
        productCount: 60
      },
      {
        id: '2.3',
        name: 'Wearables',
        description: 'Smartwatches, fitness trackers, and smart bands',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        slug: 'wearables',
        productCount: 35
      },
      {
        id: '2.4',
        name: 'Tablets',
        description: 'Tablets and tablet accessories',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
        slug: 'tablets',
        productCount: 25
      }
    ]
  },
  {
    id: '3',
    name: 'Gaming',
    description: 'Gaming consoles, games, and accessories',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&crop=center',
    slug: 'gaming',
    productCount: 80,
    subcategories: [
      {
        id: '3.1',
        name: 'Gaming Laptops',
        description: 'High-performance gaming laptops and notebooks',
        image: 'https://images.unsplash.com/photo-1593640401902-37d2c84770f3?w=400&h=300&fit=crop',
        slug: 'gaming-laptops',
        productCount: 25
      },
      {
        id: '3.2',
        name: 'Gaming Accessories',
        description: 'Gaming keyboards, mice, headsets, and controllers',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        slug: 'gaming-accessories',
        productCount: 30
      },
      {
        id: '3.3',
        name: 'Gaming Monitors',
        description: 'High-refresh rate gaming monitors and displays',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
        slug: 'gaming-monitors',
        productCount: 15
      },
      {
        id: '3.4',
        name: 'Games',
        description: 'Video games for PC, console, and mobile',
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop',
        slug: 'games',
        productCount: 50
      },
      {
        id: '3.5',
        name: 'Consoles',
        description: 'Gaming consoles and handheld devices',
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
        slug: 'consoles',
        productCount: 20
      }
    ]
  },
  {
    id: '4',
    name: 'Laptops & Computers',
    description: 'Laptops, desktops, and computer accessories',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    slug: 'laptops-computers',
    productCount: 120
  },
  {
    id: '4.1',
    name: 'TVs & Accessories',
    description: 'Televisions, smart TVs, and TV accessories',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
    slug: 'tvs-accessories',
    productCount: 85
  },
  {
    id: '4.2',
    name: 'Cameras',
    description: 'Digital cameras, DSLRs, and photography equipment',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    slug: 'cameras',
    productCount: 65
  },
  {
    id: '5',
    name: 'Home & Kitchen',
    description: 'Everything for your home and kitchen',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    slug: 'home-kitchen',
    productCount: 180
  },
  {
    id: '6',
    name: 'Baby Care',
    description: 'Baby products and care essentials',
    image: 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=400&h=300&fit=crop',
    slug: 'baby-care',
    productCount: 90
  },
  {
    id: '7',
    name: 'Beauty & Health',
    description: 'Cosmetics, skincare, and health products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    slug: 'beauty-health',
    productCount: 110,
    subcategories: [
      {
        id: '7.1',
        name: 'Makeup',
        description: 'Foundation, lipstick, eyeshadow, and cosmetic products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        slug: 'makeup',
        productCount: 30
      },
      {
        id: '7.2',
        name: 'Fragrance',
        description: 'Perfumes, colognes, and body sprays',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
        slug: 'fragrance',
        productCount: 25
      },
      {
        id: '7.3',
        name: 'Skincare',
        description: 'Face creams, serums, cleansers, and skincare products',
        image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=300&fit=crop',
        slug: 'skincare',
        productCount: 35
      },
      {
        id: '7.4',
        name: 'Haircare',
        description: 'Shampoos, conditioners, hair treatments, and styling products',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
        slug: 'haircare',
        productCount: 20
      },
      {
        id: '7.5',
        name: 'Grooming',
        description: 'Men\'s grooming products, razors, and personal care',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
        slug: 'grooming',
        productCount: 15
      },
      {
        id: '7.6',
        name: 'Hair Styling Tools',
        description: 'Hair dryers, straighteners, curling irons, and styling tools',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
        slug: 'hair-styling-tools',
        productCount: 20
      }
    ]
  },
  {
    id: '8',
    name: 'Groceries',
    description: 'Food items and daily essentials',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    slug: 'groceries',
    productCount: 250
  },
  {
    id: '9',
    name: 'Furniture',
    description: 'Home and office furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    slug: 'furniture',
    productCount: 70
  },
  {
    id: '10',
    name: 'Eyewear',
    description: 'Sunglasses, prescription glasses, and frames',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop',
    slug: 'eyewear',
    productCount: 60
  },
  {
    id: '11',
    name: 'Watches',
    description: 'Wristwatches and timepieces',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    slug: 'watches',
    productCount: 85
  },
  {
    id: '12',
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
    slug: 'sports-fitness',
    productCount: 95
  },
  {
    id: '13',
    name: 'Automotive',
    description: 'Car accessories and automotive parts',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    slug: 'automotive',
    productCount: 75
  },
  {
    id: '14',
    name: 'Stationery',
    description: 'Office supplies and stationery items',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    slug: 'stationery',
    productCount: 65
  },
  {
    id: '15',
    name: 'Fashion',
    description: 'Clothing, shoes, and accessories',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    slug: 'fashion',
    productCount: 200,
    subcategories: [
      {
        id: '15.1',
        name: "Men's Fashion",
        description: 'Men\'s clothing, shoes, and accessories',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        slug: 'mens-fashion',
        productCount: 120
      },
      {
        id: '15.2',
        name: "Women's Fashion",
        description: 'Women\'s clothing, shoes, and accessories',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
        slug: 'womens-fashion',
        productCount: 150
      },
      {
        id: '15.3',
        name: "Kids Fashion",
        description: 'Children\'s clothing, shoes, and accessories',
        image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
        slug: 'kids-fashion',
        productCount: 80
      }
    ]
  },
  {
    id: '16',
    name: 'Books & Media',
    description: 'Books, movies, and educational materials',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    slug: 'books-media',
    productCount: 90
  }
]

export const brands = [
  'Apple', 'Samsung', 'Sony', 'LG', 'Nike', 'Adidas', 'Puma', 'Canon', 'Nikon',
  'Dell', 'HP', 'Lenovo', 'Asus', 'Xiaomi', 'Huawei', 'OnePlus', 'Google',
  'Microsoft', 'Amazon', 'Netflix', 'Spotify', 'Coca-Cola', 'Pepsi', 'Nestle'
]

export const districts = [
  'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Masaka', 'Mbarara', 'Gulu', 'Lira',
  'Arua', 'Mbale', 'Soroti', 'Kasese', 'Hoima', 'Fort Portal', 'Entebbe'
]
