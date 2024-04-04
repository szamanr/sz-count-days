import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function for constructing classes conditionally and merging tailwind css classes without style conflicts.
 * Combines [tailwind-merge](https://github.com/dcastil/tailwind-merge) and [clsx](https://github.com/lukeed/clsx).
 */
export const twClass = (...classes: ClassValue[]): string => {
  return twMerge(clsx(...classes));
};
