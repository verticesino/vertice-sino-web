const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') ?? '';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '';
const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '';
const mailSubject = encodeURIComponent('Consulta desde Vértice Sino');

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://verticesino.com',
  whatsappNumber,
  whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : '',
  contactEmail,
  formEndpoint,
  formAction: formEndpoint || (contactEmail ? `mailto:${contactEmail}?subject=${mailSubject}` : ''),
  formUsesMailClient: !formEndpoint && Boolean(contactEmail),
};
