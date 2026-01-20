const apiDev = process.env.NEXT_PUBLIC_API_URL_DEV;
const apiProd = process.env.NEXT_PUBLIC_API_URL_PROD;
const isDev = process.env.NODE_ENV === "development";
const defaultUrl = isDev ? apiDev : apiProd;
export default defaultUrl;
