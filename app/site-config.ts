const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '';
export const productionSiteUrl = 'https://verticesino.com';

export const siteConfig = {
  siteUrl: productionSiteUrl,
  whatsappNumber,
  whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : '',
  contactEmail,
};
