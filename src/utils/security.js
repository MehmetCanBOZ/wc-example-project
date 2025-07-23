export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';

  return email
    .toLowerCase()
    .replace(/[<>"'&]/g, '')
    .trim();
}

export function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';

  return phone.replace(/[^0-9\s\-()+]/g, '').trim();
}
