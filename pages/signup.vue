<template>
    <div>
      <h1>Sign Up</h1>
      <form @submit.prevent="signup">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: ''
      };
    },
    methods: {
      async signup() {
        try {
          await this.$axios.post('/api/auth/signup', {
            username: this.username,
            email: this.email,
            password: this.password
          });
          this.$router.push('/login');
        } catch (error) {
          console.error('Error signing up:', error);
        }
      }
    }
  };
  </script>
  