# Email Integration Setup Guide

This guide will help you set up email integration for your contact form using Resend.

## 1. Sign up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Create a free account
3. Verify your email address

## 2. Get Your API Key

1. After signing in, go to the API Keys section
2. Create a new API key
3. Copy the API key (it starts with `re_`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Email Configuration (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Your email address where you want to receive contact form submissions
CONTACT_EMAIL=your-email@example.com

# Optional: Custom domain for sending emails (if you have verified a domain with Resend)
# RESEND_FROM_DOMAIN=yourdomain.com
```

## 4. Verify Your Domain (Optional but Recommended)

For better deliverability and to avoid spam filters:

1. In your Resend dashboard, go to Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Follow the DNS verification steps
4. Update the `from` email in `/src/app/api/contact/route.ts` to use your verified domain

## 5. Test the Contact Form

1. Start your development server: `npm run dev`
2. Go to `/contact` page
3. Fill out and submit the form
4. Check your email for the notification

## Alternative Email Services

If you prefer other email services, here are some alternatives:

### SendGrid
```bash
npm install @sendgrid/mail
```

### Nodemailer with Gmail
```bash
npm install nodemailer
```

### AWS SES
```bash
npm install @aws-sdk/client-ses
```

## Troubleshooting

### Common Issues:

1. **Emails not sending**: Check your API key and make sure it's correct
2. **Spam folder**: Verify your domain with Resend for better deliverability
3. **Rate limits**: Resend free tier allows 100 emails/day
4. **CORS errors**: Make sure your API route is properly configured

### Testing Locally:

You can test the email functionality locally by:
1. Setting up environment variables
2. Using a service like ngrok to expose your local server
3. Or testing with a mock email service

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting to prevent spam
2. **Validation**: The form already includes basic validation
3. **CAPTCHA**: For production, consider adding reCAPTCHA
4. **Environment Variables**: Never commit API keys to version control

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform
2. Verify your domain with Resend
3. Update the `from` email address to use your verified domain
4. Consider adding rate limiting and additional security measures 