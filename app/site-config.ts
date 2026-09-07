const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '';
// Existing confirmed public address, also documented in .env.example.
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'verticesino@gmail.com';
export const productionSiteUrl = 'https://verticesino.com';

export const siteConfig = {
  siteUrl: productionSiteUrl,
  whatsappNumber,
  whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : '',
  contactEmail,
};
