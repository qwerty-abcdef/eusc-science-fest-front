import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you deploy to https://<username>.github.io/<repo-name>/ set base below.
// If you deploy to https://<username>.github.io/ (a user/org page repo) leave base as '/'.
export default defineConfig({
  plugins: [react()],
  base: '/eusc-science-fest-front/'
})
