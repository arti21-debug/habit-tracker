import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.101"],
};

// плагин сам находит src/i18n/request.ts и связывает его с next-intl
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
