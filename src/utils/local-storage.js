const ACCESS_TOKEN = "fekorgmwepwjcqpgrneiogecvbnyuidslkcmioqfnmjvbrfeio";

export const addAccessToken = (token) =>
  localStorage.setItem(ACCESS_TOKEN, token);
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN);
export const removeAccessToken = () => localStorage.removeItem(ACCESS_TOKEN);
