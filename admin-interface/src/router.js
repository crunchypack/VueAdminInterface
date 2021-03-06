import Vue from "vue";
import Router from "vue-router";
import LoginComponent from "./views/Login.vue";
import LoggedComp from "./views/Logged.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: {
        name: "login"
      }
    },
    {
      path: "/login",
      name: "login",
      component: LoginComponent
    },
    {
      path: "/logged",
      name: "logged",
      component: LoggedComp
    }
  ]
});
