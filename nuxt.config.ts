import { defineNuxtConfig } from "nuxt/config"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css:["~/assets/main.scss"],
  modules: [
    // https://pinia.vuejs.org/ssr/nuxt.html
    "@pinia/nuxt"
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || "https://escapematch.escmatch.fr/api/"
    }
  }
})
