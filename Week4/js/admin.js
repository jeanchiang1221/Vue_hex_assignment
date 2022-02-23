import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//在外層建立變數
let productModal={};
let delProductModal ={};

const app =createApp({
  data(){
    return{
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath:'jeanchiang',
      products:[],
      isNew: false,
      tempProduct: {
        imagesUrl: [], //多圖
      },
      pagination:{}
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
    getData(page = 1) { //參數預設值，query用問號去代，這裡的page先賦予1，才不會是undefined
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`; //連結products才有在後端資料庫才有頁面，products/all沒有
      axios.get(url).then((response) => {
        const { products, pagination } = response.data;
        this.products = products;
        this.pagination = pagination;
      }).catch((err) => {
        alert(err.data.message);
      })
    },

    openModal(isNew, item) {
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
    



  },

  mounted(){
      // 取出 Token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common.Authorization = token;
      this.checkAdmin();
    
  },



});


// 分頁元件
app.component('pagination', {
    template: '#pagination',
    props: ['pages'],
    methods: {
      emitPages(item) {
        this.$emit('emit-pages', item);
      },
    },
});



app.component('productModal',{
    template:'#productModal',
    props:['product','isNew'],
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath:'jeanchiang',
        };
    },

    mounted(){
         //建立bootstrap實體，因為之後還會呼叫這個方法，所以賦予在變數上，並將變數放在外層
      productModal = new bootstrap.Modal(document.getElementById('productModal'));
    },
    methods:{

        updateProduct(){
            //新增產品
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method='post';
            //修改產品
            if(!this.isNew){
              url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
              method = 'put'
            }
      
            axios[method](url, { data: this.product }).then((response) => {
              alert(response.data.message);
              this.hideModal();
              this.$emit('update');//重新渲染畫面;
            }).catch((err) => {
              alert(err.data.message);
            })
          },

        hideModal() {
            productModal.hide();
          }
    },

})


// //產品刪除元件

// 產品刪除元件
app.component('delProductModal', {
  template: '#delProductModal',
  props: ['item'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'jeanchiang',
    };
  },
  mounted() {
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
  },
  methods: {
    delProduct() {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`).then((response) => {
        this.hideModal();
        this.$emit('update');
      }).catch((error) => {
        alert(error.data.message);
      });
    },
    hideModal() {
      delProductModal.hide();
    },
  },
});


// app.component('delProductModal',{
//   template:'#delProductModal',
//   props: ['del'],
//   data() {
//     return {
//       apiUrl: 'https://vue3-course-api.hexschool.io/v2',
//       apiPath: 'jeanchiang',
//     };
//   },
//   mounted(){
//     delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
//   },
//   methods:{
//     delProduct() {
//       const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`;
//       axios.delete(url).then((response) => {
//         this.hideModal();
//         this.$emit('update');
//       }).catch((error) => {
//         alert(error.data.message);
//       });
//     },

//     hideModal() {
//       delProductModal.hide();
//     },

//   }
// })



app.mount('#app');