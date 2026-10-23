// Single place to edit store details, phone / WhatsApp number and social links.
export const siteConfig = {
  storeName: 'Glam & Grace',
  tagline: 'Fashion, beauty & aesthetic finds',
  // Phone number with country code, digits only (no + or spaces). Example for India: 919876543210
  phoneNumber: '91XXXXXXXXXX',
  phoneDisplay: '+91 XXXXX XXXXX',
  email: 'kumarisanjana.work@gmail.com',
  social: {
    instagram: 'https://www.instagram.com',
    facebook: 'https://www.facebook.com',
  },
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
};

export const FREE_SHIPPING_ABOVE = 999;
export const SHIPPING_FEE = 49;
