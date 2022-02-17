import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//在外層建立變數
let productModal={};
let delProductModal ={};

createApp({
  data(){
    return{
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath:'jeanchiang',
      products:[],
      isNew: false,
      tempProduct: {
        imagesUrl: [], //多圖
      },
    }
  },
  methods:{
    //後台需要有token才能夠操作
    //確認是否登入
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
           this.getData();
        })
        //失敗結果
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html';//使用者若無登入直接進入商品頁面，會被導回登入頁面
        })
    },
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(url).then((response) => {
        this.products = response.data.products;
      }).catch((err) => {
        alert(err.data.message);
      })
    },

    openModal(status,item){
      if(status==='new'){
        this.tempProduct= {
          imagesUrl: [],
        },
        this.isNew=true;//資料是否為新的
        productModal.show();
      }else if(status==='edit'){
        this.tempProduct={...item};//淺拷貝,避免傳址
        this.isNew=false;
        productModal.show();
      }else if(status=== 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
    updateProduct(){
      //新增產品
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method='post';
      //修改產品
      if(!this.isNew){
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put'
      }

      axios[method](url, { data: this.tempProduct }).then((response) => {
        alert(response.data.message);
        productModal.hide();
        this.getData(); //重新渲染畫面;
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.data.message);
      })
    },


  },

  mounted(){
      // 取出 Token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common.Authorization = token;
      this.checkAdmin();

      //建立bootstrap實體，因為之後還會呼叫這個方法，所以賦予在變數上，並將變數放在外層
      productModal = new bootstrap.Modal(document.getElementById('productModal'));
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

  },



}).mount('#app');