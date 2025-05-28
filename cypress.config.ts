import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    baseUrl: 'https://r0879035-realbeans.myshopify.com/',
    password: '2000',
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.ts', // Ensure this points to .ts files
  },
});