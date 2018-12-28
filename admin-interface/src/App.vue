<template>
  <div id="app">
    <div id="nav">
      <b-button :variant="'danger'" v-if="authenticated" v-on:click="logout()" replace>Logout</b-button>
    </div>
    <router-view @authenticated="setAuthenticated"/>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      authenticated: false,
      msg: []
    };
  },
  mounted() {
    this.loggedCheck();
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status;
    },
    logout() {
      axios({
        method: "GET",
        url: "https://lobonode.ddns.net/api/logout"
      })
        .then(res => {
          this.msg = res.data.message;
          this.setAuthenticated(false);
          setTimeout(this.loggedCheck(), 3000);
        })
        .catch(e => {
          this.msg.push(e);
        });
    },
    loggedCheck() {
      if (!this.authenticated) {
        this.$router.replace({ name: "login" });
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
