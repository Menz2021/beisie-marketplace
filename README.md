# Beisie - Ecommerce Marketplace

A modern, full-featured ecommerce marketplace built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **Product Catalog** - Browse and search through thousands of products
- 🏪 **Multi-Vendor Support** - Multiple vendors can sell on the platform
- 🛒 **Shopping Cart** - Add products to cart with persistent storage
- 🔍 **Advanced Search & Filters** - Find products by category, price, rating
- 💳 **Checkout Process** - Secure payment processing (Stripe integration ready)
- 👤 **User Authentication** - Login, register, and user management
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Built with Next.js 14 and optimized for speed

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **State Management**: Zustand
- **Database**: Prisma with SQLite (easily switchable to PostgreSQL/MySQL)
- **Authentication**: NextAuth.js (ready for implementation)
- **Payments**: Stripe (ready for integration)
- **Icons**: Heroicons, Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beisie-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
beisie-marketplace/
├── app/                    # Next.js 14 app directory
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart page
│   ├── products/          # Product listing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   ├── FeaturedCategories.tsx
│   ├── FeaturedProducts.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Newsletter.tsx
│   ├── ProductCard.tsx
│   ├── ProductFilters.tsx
│   └── WhyChooseUs.tsx
├── lib/                   # Utility functions
│   └── prisma.ts          # Prisma client
├── prisma/                # Database schema
│   └── schema.prisma
├── store/                 # State management
│   └── cartStore.ts       # Shopping cart store
└── public/                # Static assets
```

## Key Components

### Homepage
- Hero section with call-to-action
- Featured categories grid
- Featured products showcase
- Why choose us section
- Newsletter signup

### Product Catalog
- Advanced search and filtering
- Product grid with ratings and reviews
- Add to cart functionality
- Responsive design

### Shopping Cart
- Persistent cart storage
- Quantity management
- Price calculations
- Checkout process

### Authentication
- Login/Register forms
- Social login options (ready for implementation)
- Password reset functionality

## Database Schema

The application uses Prisma with the following main entities:

- **Users** - Customers, vendors, and admins
- **Products** - Product catalog with images, pricing, and inventory
- **Categories** - Product categorization
- **Orders** - Order management and tracking
- **Reviews** - Product reviews and ratings
- **Cart Items** - Shopping cart persistence

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update colors in `app/globals.css`
- Customize component styles in individual component files

### Database
- Switch from SQLite to PostgreSQL/MySQL by updating `prisma/schema.prisma`
- Add new fields to existing models
- Create new models for additional features

### Features
- Add new product categories
- Implement vendor dashboard
- Add order tracking
- Integrate payment processing
- Add email notifications

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Other Platforms
- **Netlify**: Use `npm run build` and deploy the `out` folder
- **Railway**: Connect your GitHub repository
- **DigitalOcean**: Use App Platform

## Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe (for payments)
STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@beisie.com or create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
