// backend/src/utils/getBaseUrl.js (বা server.js)
export const getFrontendUrl = () => {
  return process.env.FRONTEND_URL || "https://portfolio-client-l39a.vercel.app";
};
