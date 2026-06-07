

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function putTokens({ accessToken }) {
  localStorage.setItem('accessToken', accessToken);
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
}

