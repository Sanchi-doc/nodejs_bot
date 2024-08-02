export default {
    modules: [
      '@nuxtjs/axios',
      '@nuxtjs/auth-next'
    ],
    axios: {
      baseURL: 'http://localhost:3000' 
    },
    auth: {
      strategies: {
        local: {
          token: {
            property: 'token',
            global: true,
            required: true,
            type: 'Bearer'
          },
          user: {
            property: 'user',
            autoFetch: true
          },
          endpoints: {
            login: { url: '/api/auth/login', method: 'post' },
            logout: { url: '/api/auth/signup', method: 'post' },
            user: { url: '/api/auth/user', method: 'get' }
          }
        }
      }
    }
  }