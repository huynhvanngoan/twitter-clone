import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  devtools: { enabled: false },

  runtimeConfig: {
      jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
      jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
      jwtAccessExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      jwtRefreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  compatibilityDate: "2024-09-05",
});