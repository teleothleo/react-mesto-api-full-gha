export function getCookie(cookieName) {
  const cookiesArr = document.cookie.split(';');
  const cookie = cookiesArr.find(cookie => cookie.trim().startsWith(`${cookieName}=`));
  if (cookie) {
    const cookieRes = cookie.split('=')[1];
    return cookieRes
  } else {
    return null;
  }
}

export function removeCookie(cookieName) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function saveCookie(cookieName, cookie) {
  document.cookie = `${cookieName}=${cookie}; path=/`;
}