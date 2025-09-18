import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    id: '1',
    name: 'TVs & Accessories',
    description: 'Smart TVs, LED, OLED & accessories',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=400&fit=crop&crop=center&bg=white',
    slug: 'tvs-accessories',
    productCount: 85
  },
  {
    id: '2',
    name: 'Gaming',
    description: 'Gaming consoles, games & accessories',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=400&fit=crop&crop=center',
    slug: 'gaming',
    productCount: 45
  },
  {
    id: '3',
    name: 'Cameras',
    description: 'Digital cameras & photography equipment',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=400&fit=crop&crop=center',
    slug: 'cameras',
    productCount: 65
  },
  {
    id: '4',
    name: 'Tablets',
    description: 'iPads, Android tablets & accessories',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=400&fit=crop&crop=center',
    slug: 'tablets',
    productCount: 55
  },
  {
    id: '5',
    name: 'Gaming Accessories',
    description: 'Controllers, headsets & gaming gear',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=400&fit=crop&crop=center',
    slug: 'gaming-accessories',
    productCount: 120
  },
  {
    id: '6',
    name: 'Games',
    description: 'Video games for all platforms',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=400&fit=crop&crop=center',
    slug: 'games',
    productCount: 200
  },
  {
    id: '7',
    name: 'Mobile Phones',
    description: 'Latest smartphones & accessories',
    image: 'https://images.unsplash.com/photo-1511707171634-5e560c06d30e?w=500&h=400&fit=crop&crop=center',
    slug: 'mobile-phones',
    productCount: 180
  }
]

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
                <div className="card-content">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.productCount} products
                    </span>
                    <span className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="btn-primary btn-lg"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}
