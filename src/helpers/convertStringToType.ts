export function convertStringToUnionType<T>(str: string, typeArray: T[]): T | undefined {
  const validValues: T[] = typeArray;
  
  if (validValues.includes(str as T)) {
    return str as T;
  }
  return undefined;
};