'use client'

import { TruckIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

const features = [
  {
    id: 1,
    title: 'Fast Delivery',
    description: 'Same day delivery in Kampala and next day for most parts of Uganda',
    icon: TruckIcon,
    color: 'bg-purple-600'
  },
  {
    id: 2,
    title: 'Secure Payment',
    description: 'Multiple payment options including Mobile Money and credit cards',
    icon: ShieldCheckIcon,
    color: 'bg-green-600'
  },
  {
    id: 3,
    title: '24/7 Support',
    description: 'Our customer service team is available all day, every day',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-blue-600'
  }
]

export function ServiceFeatures() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className={`${feature.color} rounded-lg p-8 text-white text-center`}>
              <div className="mb-6">
                <feature.icon className="h-12 w-12 mx-auto text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-4">
                {feature.title}
              </h3>
              
              <p className="text-white opacity-90 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
