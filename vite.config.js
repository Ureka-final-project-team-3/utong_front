import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve('./src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://54.180.0.98:8080',
        changeOrigin: true,
        secure: false,
        // 더 구체적인 설정이 필요한 경우만 추가
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // 쿠키 도메인 제거 (필요한 경우)
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                cookie.replace(/Domain=[^;]+;?/gi, '')
              );
            }
          });
        },
      },
    },
  },
});
