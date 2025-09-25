import nodemailer from 'nodemailer'

// Email configuration with fallback to Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Email templates
export const emailTemplates = {
  // Welcome email template
  welcome: (name: string, confirmationLink: string) => ({
    subject: 'Welcome to Beisie Marketplace!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Beisie!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151;">Hello ${name}!</h2>
          
          <p style="color: #6b7280; line-height: 1.6;">
            Thank you for joining Beisie Marketplace! We're excited to have you as part of our community.
          </p>
          
          <p style="color: #6b7280; line-height: 1.6;">
            To complete your registration and start shopping, please confirm your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" 
               style="background: #dc2626; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Confirm Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; font-size: 14px;">
            If the button doesn't work, you can also copy and paste this link into your browser:
          </p>
          <p style="color: #6b7280; font-size: 12px; word-break: break-all;">
            ${confirmationLink}
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; line-height: 1.6;">
            Once confirmed, you'll be able to:
          </p>
          <ul style="color: #6b7280; line-height: 1.6;">
            <li>Browse and purchase products</li>
            <li>Track your orders</li>
            <li>Manage your profile</li>
            <li>Access exclusive deals</li>
          </ul>
          
          <p style="color: #6b7280; line-height: 1.6;">
            If you didn't create an account with Beisie, please ignore this email.
          </p>
          
          <p style="color: #6b7280; line-height: 1.6;">
            Best regards,<br>
            The Beisie Team
          </p>
        </div>
        
        <div style="background: #374151; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            © 2024 Beisie Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  // Seller welcome email
  sellerWelcome: (name: string, businessName: string, confirmationLink: string) => ({
    subject: 'Welcome to Beisie Seller Program!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Beisie Seller Program!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151;">Hello ${name}!</h2>
          
          <p style="color: #6b7280; line-height: 1.6;">
            Welcome to the Beisie Seller Program! We're excited to have <strong>${businessName}</strong> join our marketplace.
          </p>
          
          <p style="color: #6b7280; line-height: 1.6;">
            To complete your seller registration and start listing products, please confirm your email address:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" 
               style="background: #dc2626; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Confirm Email & Activate Seller Account
            </a>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6;">
            Once confirmed, you'll be able to:
          </p>
          <ul style="color: #6b7280; line-height: 1.6;">
            <li>List your products</li>
            <li>Manage inventory</li>
            <li>Track sales and analytics</li>
            <li>Receive payments</li>
            <li>Access seller support</li>
          </ul>
          
          <p style="color: #6b7280; line-height: 1.6;">
            Best regards,<br>
            The Beisie Seller Team
          </p>
        </div>
      </div>
    `
  })
}

// Email sending functions
export const emailService = {
  // Send welcome email with confirmation link
  async sendWelcomeEmail(email: string, name: string, confirmationToken: string, userType: 'customer' | 'seller' = 'customer', businessName?: string) {
    const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-site.vercel.app'}/auth/confirm?token=${confirmationToken}`
    
    const template = userType === 'seller' 
      ? emailTemplates.sellerWelcome(name, businessName || '', confirmationLink)
      : emailTemplates.welcome(name, confirmationLink)
    
    try {
      // Check if SMTP is configured
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('SMTP not configured, skipping email send')
        return { success: false, error: 'SMTP not configured' }
      }
      
      await transporter.sendMail({
        from: `"Beisie Marketplace" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: template.subject,
        html: template.html
      })
      
      return { success: true }
    } catch (error) {
      console.error('Email sending error:', error)
      return { success: false, error }
    }
  },

  // Send order confirmation email
  async sendOrderConfirmation(email: string, orderData: any) {
    const template = {
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151;">Thank you for your order!</h2>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Your order <strong>${orderData.orderNumber}</strong> has been confirmed and is being processed.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Order Details</h3>
              <p style="color: #6b7280;"><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p style="color: #6b7280;"><strong>Total Amount:</strong> ${orderData.total}</p>
              <p style="color: #6b7280;"><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6;">
              You can track your order status in your account dashboard.
            </p>
            
            <p style="color: #6b7280; line-height: 1.6;">
              Best regards,<br>
              The Beisie Team
            </p>
          </div>
        </div>
      `
    }
    
    try {
      await transporter.sendMail({
        from: `"Beisie Marketplace" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: template.subject,
        html: template.html
      })
      
      return { success: true }
    } catch (error) {
      console.error('Email sending error:', error)
      return { success: false, error }
    }
  }
}

