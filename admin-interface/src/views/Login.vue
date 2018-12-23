<template>
  <div id="login">
    <input type="text" v-model="input.mail" placeholder="Email">
    <input type="password" v-model="input.pass">
    <button v-on:click="logIn()">Login</button>
    <br>
    <span>{{loginres}}</span>
    <br>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      input: {
        mail: "",
        pass: ""
      },
      errors: null,
      loginres: null
    };
  },
  methods: {
    logIn() {
      axios({
        method: "POST",
        url: "https://lobonode.ddns.net/api/login",
        data: this.input,
        headers: { "content-type": "application/json" }
      }).then(res => {
        this.loginres = res.data.user.email;
        this.$emit("authenticated", true);
        this.$router.replace({ name: "logged" });
      });
    }
  }
};

// addMovies() {
//       axios({
//         method: "POST",
//         url: "https://lobonode.ddns.net/api",
//         data: {},
//         headers: { "content-type": "application/json" }
//       }).then(res => {
//         this.addedRes = res.data;
//       });
//     }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>