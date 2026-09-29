export function isBirthdayRoute(location: Location): boolean {
  const normalizedPath = location.pathname.replace(/\/+$/, '');
  const pathIsBirthday =
    normalizedPath === '/birthday' || normalizedPath.endsWith('/birthday');
  const hashIsBirthday =
    location.hash === '#/birthday' || location.hash === '#birthday';
  return pathIsBirthday || hashIsBirthday;
}
