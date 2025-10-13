const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDeliveryZones() {
  console.log('🚚 Seeding delivery zones...')

  try {
    // Clear existing delivery zones
    console.log('🧹 Clearing existing delivery zones...')
    await prisma.deliveryZone.deleteMany()

    // Create delivery zones
    const deliveryZones = [
      {
        name: 'Kampala',
        districts: JSON.stringify(['Kampala']),
        shippingCost: 5000,
        isActive: true
      },
      {
        name: 'Central Region',
        districts: JSON.stringify([
          'Wakiso', 'Mukono', 'Luweero', 'Mityana', 'Mpigi', 'Buikwe', 'Kayunga', 
          'Buvuma', 'Nakaseke', 'Nakasongola', 'Kalangala', 'Kyankwanzi', 'Gomba'
        ]),
        shippingCost: 8000,
        isActive: true
      },
      {
        name: 'Eastern Region',
        districts: JSON.stringify([
          'Jinja', 'Iganga', 'Kamuli', 'Bugiri', 'Mayuge', 'Namayingo', 'Busia',
          'Tororo', 'Pallisa', 'Kumi', 'Soroti', 'Serere', 'Kaberamaido', 'Amuria',
          'Katakwi', 'Bukedea', 'Kibuku', 'Butebo', 'Budaka', 'Mbale', 'Manafwa',
          'Sironko', 'Kapchorwa', 'Kween', 'Bulambuli', 'Namisindwa', 'Bukwo'
        ]),
        shippingCost: 12000,
        isActive: true
      },
      {
        name: 'Northern Region',
        districts: JSON.stringify([
          'Gulu', 'Amuru', 'Nwoya', 'Omoro', 'Pader', 'Agago', 'Kitgum', 'Lamwo',
          'Lira', 'Alebtong', 'Amolatar', 'Dokolo', 'Kole', 'Oyam', 'Apac',
          'Arua', 'Koboko', 'Maracha', 'Terego', 'Yumbe', 'Moyo', 'Obongi',
          'Adjumani', 'Madi-Okollo', 'Pakwach', 'Nebbi', 'Zombo'
        ]),
        shippingCost: 15000,
        isActive: true
      },
      {
        name: 'Western Region',
        districts: JSON.stringify([
          'Masaka', 'Kalungu', 'Bukomansimbi', 'Lwengo', 'Sembabule', 'Rakai',
          'Kyotera', 'Mpigi', 'Butambala', 'Gomba', 'Mityana', 'Mubende',
          'Kassanda', 'Kiboga', 'Kyankwanzi', 'Hoima', 'Kikuube', 'Kakumiro',
          'Kibaale', 'Kiryandongo', 'Buliisa', 'Masindi', 'Pakwach', 'Nebbi',
          'Zombo', 'Arua', 'Koboko', 'Maracha', 'Terego', 'Yumbe', 'Moyo',
          'Obongi', 'Adjumani', 'Madi-Okollo'
        ]),
        shippingCost: 12000,
        isActive: true
      },
      {
        name: 'South Western Region',
        districts: JSON.stringify([
          'Mbarara', 'Ibanda', 'Isingiro', 'Kazo', 'Kiruhura', 'Ntungamo',
          'Rwampara', 'Bushenyi', 'Rubirizi', 'Sheema', 'Mitooma', 'Rukungiri',
          'Kanungu', 'Kisoro', 'Kabale', 'Rukiga', 'Buhweju', 'Mbarara City'
        ]),
        shippingCost: 15000,
        isActive: true
      }
    ]

    for (const zone of deliveryZones) {
      await prisma.deliveryZone.create({
        data: zone
      })
      console.log(`✅ Created delivery zone: ${zone.name} - ${zone.shippingCost} UGX`)
    }

    console.log('🎉 Delivery zones seeded successfully!')
    console.log('📋 Created zones:')
    console.log('🏙️  Kampala: 5,000 UGX')
    console.log('🏘️  Central Region: 8,000 UGX')
    console.log('🌅 Eastern Region: 12,000 UGX')
    console.log('🌲 Northern Region: 15,000 UGX')
    console.log('🌾 Western Region: 12,000 UGX')
    console.log('🏔️  South Western Region: 15,000 UGX')

  } catch (error) {
    console.error('❌ Error seeding delivery zones:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedDeliveryZones()
