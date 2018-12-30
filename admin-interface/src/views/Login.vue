<template>
  <div id="login">
    <h1>Log in for admin</h1>
    <b-container fluid>
      <b-row>
        <b-col sm="4">
          <label for="email">Email</label>
        </b-col>
        <b-col sm="4">
          <b-form-input type="text" v-model="input.mail" placeholder="Email"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="4">
          <label for="password">Password</label>
        </b-col>
        <b-col sm="4">
          <b-form-input type="password" v-model="input.pass" v-on:key.enter="logIn()"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="9">
          <b-button :variant="'success'" v-on:click="logIn()">Login</b-button>
        </b-col>
      </b-row>
    </b-container>
    <p>{{failed}}</p>
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
      loginres: null,
      logged: false,
      status: "",
      failed: ""
    };
  },
  mounted() {
    axios({
      method: "GET",
      url: "https://lobonode.ddns.net/api/logged"
    })
      .then(res => {
        this.logged = res.data.status;
        let isLogged = this.logged == "true";
        if (isLogged) {
          this.$emit("authenticated", true);
          this.$router.replace({ name: "logged" });
        } else {
          this.$emit("authenticated", false);
          this.status = this.logged;
        }
      })
      .catch(e => {
        this.status = e;
      });
  },
  methods: {
    logIn() {
      axios({
        method: "POST",
        url: "https://lobonode.ddns.net/api/login",
        data: this.input,
        headers: { "content-type": "application/json" }
      })
        .then(res => {
          this.loginres = res.data.status;
          this.$emit("authenticated", true);
          this.$router.replace({ name: "logged" });
        })
        .catch(err => {
          this.failed = "Wrong email and/or password";
        });
    }
  }
};
</script>