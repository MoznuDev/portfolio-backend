// backend/src/utils/getBaseUrl.js (বা server.js)
export const getFrontendUrl = () => {
  return process.env.FRONTEND_URL || "https://portfolio-client-9f2w.vercel.app";
};
