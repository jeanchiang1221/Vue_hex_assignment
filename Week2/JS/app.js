import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
    }
  },
  methods: {
    //發送api至遠端並登入(並儲存Token)
    login() {
      const api = `${this.apiUrl}/admin/signin`;
      axios.post(api, this.user).then((response) => {
        const { token, expired } = response.data;
        // 寫入 cookie token
        // expires 設置有效時間，unix timestamp
        document.cookie = `myToken=${token};expires=${new Date(expired)};`;
        window.location = 'products.html';//使用者可以從登入頁面登入，並轉到後台商品頁面
      }).catch((error) => {
        alert(error.data.message);
      });
    },
  },
}).mount('#app');
