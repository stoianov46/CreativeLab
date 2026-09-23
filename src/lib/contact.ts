/** Contact-form field limits — enforced in the form (maxLength) and in /api/contact. */
export const CONTACT_LIMITS = { name: 100, email: 200, phone: 60, service: 200, message: 5000 } as const;
