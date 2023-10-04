import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Documentation on the cn function (twMerge): https://www.npmjs.com/package/tailwind-merge

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
