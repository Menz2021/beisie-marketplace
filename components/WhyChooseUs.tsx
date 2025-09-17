import { 
  ShieldCheckIcon, 
  TruckIcon, 
  CreditCardIcon, 
  ChatBubbleLeftRightIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Secure Shopping',
    description: 'Your data and payments are protected with bank-level security'
  },
  {
    icon: TruckIcon,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping to your doorstep'
  },
  {
    icon: CreditCardIcon,
    title: 'Easy Payments',
    description: 'Multiple payment options with secure checkout'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: '24/7 Support',
    description: 'Round-the-clock customer support when you need it'
  },
  {
    icon: StarIcon,
    title: 'Quality Guarantee',
    description: 'All products are verified for quality and authenticity'
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Marketplace',
    description: 'Access to products from vendors worldwide'
  }
]

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Beisie?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience possible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                1K+
              </div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Trusted Vendors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                99.9%
              </div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
