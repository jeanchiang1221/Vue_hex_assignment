import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'jeanjean',
      products: [],
      tempProduct: {},
    }
  },
  methods: {
    //後台需要有token才能夠操作
    //確認是否登入，要檢查token有沒有過期
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })

        //失敗結果
        .catch((err) => {
          alert(err.data.message)
          window.location = 'index.html';//使用者若無登入直接進入商品頁面，會被導回登入頁面
        })
    },
    //使用者可以查看產品列表
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(url)
        .then((response) => {
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    //使用者可以點擊單一產品，查看詳細資訊
    openProduct(item) {
      this.tempProduct = item;
    }
  },

  //token只要加進去一次就可以了，在外層取出Token，每次都可以保持取得token的登錄的狀態
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;//把token就可夾帶在header裡的authorization裡面，下次在發送axios請求時，就能使用這個預設值

    this.checkAdmin()
  }
}).mount('#app');



