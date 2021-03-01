import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import { store } from './store/index'

import { determineRouteType } from './helpers/determineRouteType'

Vue.config.productionTip = false

window.EventBus = new Vue()

router.beforeEach((to, from, next) => {
  let isNotProtectedRoute = determineRouteType(to.name)

  if (isNotProtectedRoute) {
    // this route requires guest, check if logged in
    // if logged in, redirect to user-type dashboard.
    if (store.getters.isLoggedIn) 
      next({ name: store.getters.loggedUserDashbaord })
    else
      next()
  } else {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.isLoggedIn) 
      next({ name: to.name })
    else
      next()
  }
 
});
  

const app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

export default app
