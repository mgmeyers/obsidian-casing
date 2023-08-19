export function lower(str: string) {
  return str.toLocaleLowerCase();
}

export function upper(str: string) {
  return str.toLocaleUpperCase();
}

export function capitalize(str: string) {
  // Ignore lone greek letters
  if (/^[\u0370-\u03FF]$/.test(str)) {
    return str;
  }
  return upper(str[0]) + str.substring(1);
}
