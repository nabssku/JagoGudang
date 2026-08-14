import type { UserRole } from '../types';

export const hasRole = (userRoles?: { slug: string }[], allowedRoles?: UserRole[]): boolean => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRoles || userRoles.length === 0) return false;
  return userRoles.some(r => allowedRoles.includes(r.slug as UserRole));
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};
