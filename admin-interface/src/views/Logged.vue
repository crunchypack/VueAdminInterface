<template>
  <div id="logged">
    <h1>Welcome admin</h1>
    <h2>Add movies to the database</h2>
    <label>Title</label>
    <input type="text" v-model="addMovie.title">
    <br>
    <label>Description</label>
    <input type="text" v-model="addMovie.desc">
    <br>
    <label>Length</label>
    <input type="number" v-model="addMovie.length">
    <br>
    <label>Director</label>
    <input type="text" v-model="addMovie.director">
    <br>
    <label>Imdb URL</label>
    <input type="text" v-model="addMovie.url">
    <br>
    <label>Genre</label>
    <div v-for="(gen, index) in addMovie.genre" :key="index">
      <input type="text" v-model="addMovie.genre[index]">
      <button v-on:click="removeGen(index)">Remove</button>
      <button v-if="index + 1 === gen.lenght" v-on:click="addGen">Add</button>
    </div>

    <h2>Movies in database</h2>
    <div v-for="(movie, index) in movies" :key="index">
      <a v-bind:href="movie.url" target="_blank">
        <h3>{{movie.title}}</h3>
      </a>
      <!-- <p>
        Genre:
        <span v-for="(genre, index) in movie.genre" :key="index">{{genre}}</span>
      </p>
      <p>
        Cast:
        <span v-for="(actor, index) in movie.starring" :key="index">{{actor}}</span>
      </p>
      <p>Year: {{movie.year}}</p>
      <p>Director: {{movie.director}}</p>
      <p>length: {{movie.length}} minutes</p>
      <p>{{movie.desc}}</p>-->
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Logged",
  data() {
    return {
      blockRemove: true,
      addMovie: {
        title: "",
        year: "",
        lenth: "",
        desc: "",
        director: "",
        genre: ["stuff", "morre"],
        starring: [],
        available: [],
        url: ""
      },
      movies: null,
      addedRes: null
    };
  },
  watch: {
    genres() {
      this.blockRemove = this.addMovie.genre.length <= 1;
    }
  },
  mounted() {
    axios({ method: "GET", url: "https://lobonode.ddns.net/api" })
      .then(response => (this.movies = response.data))
      .catch(e => {
        this.errors.push(e);
      });
    this.addGen();
  },
  methods: {
    addGen() {
      if (this.addMovie.genre.length > 0) return;
      this.addMovie.genre.push(" ");
    },
    removeGen(id) {
      if (!this.blockRemove) this.addMovie.genre.splice(id, 1);
    },
    add() {
      axios({ method: "POST", url: "https://lobonode.ddns.net/api" })
        .then(res => {
          this.addedRes = res.data;
        })
        .catch(e => {
          this.errors.push(e);
          console.log(errors);
        });
    }
  }
};
</script>

<style scoped>
#secure {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 20px;
  margin-top: 10px;
}
</style>
