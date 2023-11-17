export default {
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/admin': {
				target: 'http://localhost:3001',
				changeOrigin: true,
			},
			'/login': {
				target: 'http://localhost:3001',
				changeOrigin: true,
			}
		}
	}
}