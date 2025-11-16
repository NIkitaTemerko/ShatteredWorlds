import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges and deduplicates CSS class names using clsx and Tailwind CSS merge utilities.
 * Also transforms `tw:` prefix into arbitrary variant syntax `tw:[&&]:...` for specificity boost.
 *
 * @param inputs - Variable number of class values to merge (strings, objects, arrays, etc.)
 * @returns A single string of merged and deduplicated class names
 *
 * @example
 * cn('px-2', 'px-4') // => 'px-4'
 * cn('text-red-500', condition && 'text-blue-500') // => 'text-blue-500'
 * cn({ 'flex': true, 'hidden': false }) // => 'flex'
 * cn('tw:bg-red-500') // => 'tw:[&]:bg-red-500'
 */
export function cn(...inputs: ClassValue[]) {
  const merged = twMerge(clsx(inputs));

  // Transform tw: prefixes to tw:[&]: for specificity boost
  return merged.replace(/tw:([^\s]+)/g, 'tw:[&&]:$1');
}
