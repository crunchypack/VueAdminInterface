<template>
  <div id="logged">
    <h1>Welcome admin</h1>
    <h2>Add movies to the database</h2>
    <b-container fluid>
      <b-row class="my-1" v-for="details in items" :key="details">
        <b-col sm="3">
          <label :for="`details-${details}`">{{details.charAt(0).toUpperCase() + details.slice(1)}}:</label>
        </b-col>
        <b-col sm="3">
          <b-form-input :id="`details-${details}`" type="text" v-model="addMovie[details]"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>Genre</label>
        </b-col>
        <b-col sm="3">
          <b-form-select multiple :select-size="5" v-model="addMovie.genre" :options="genres"></b-form-select>
        </b-col>
      </b-row>
    </b-container>

    <br>
    <label class="cast">Cast</label>
    <b-container fluid>
      <div v-for="(cast, index) in addMovie.starring" v-bind:key="index">
        <b-row class="my-1">
          <b-col>
            <label :for="`Cast member ${index}`">Cast member</label>
          </b-col>
          <b-col>
            <b-form-input
              type="text"
              v-model="addMovie.starring[index]"
              placeholder="Enter cast member"
            ></b-form-input>
          </b-col>
          <b-col>
            <b-button
              :disabled="blockCast"
              v-on:click="removeCast(index)"
              :size="'sm'"
              :variant="'success'"
            >Remove</b-button>
          </b-col>
        </b-row>
        <div v-if="index + 1 == addMovie.starring.length">
          <b-button :size="' '" :variant="'success'" v-on:click="addCast(index)">Add cast member</b-button>
        </div>
      </div>
    </b-container>
    <div>
      <b-form-group label="Available on:">
        <b-form-checkbox-group
          id="checkboxes1"
          name="flavour1"
          v-model="addMovie.available"
          :options="avilability"
        ></b-form-checkbox-group>
      </b-form-group>
    </div>
    <button @click="add()">Add Movie</button>
    <p class="big">{{addedRes}}</p>

    <h2>Movies in database</h2>
    <div v-for="(movie, indx) in movies" :key="indx">
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
axios.defaults.withCredentials = true; // enable axios post cookie
export default {
  name: "Logged",
  data() {
    return {
      avilability: ["Netflix", "Amazon Prime"],
      genres: [
        "Action",
        "Adventure",
        "Comedy",
        "Crime",
        "Drama",
        "Historical",
        "Horror",
        "Musical",
        "Science Fiction",
        "War",
        "Western",
        "Biopic",
        "Chick Flick",
        "Courtroom Drama",
        "Detective and Mystery",
        "Disaster",
        "Fantasy",
        "Romance",
        "Sports",
        "Super Hero",
        "Supernatural",
        "Thriller",
        "Zombie"
      ],
      castLines: [],
      blockCast: true,
      items: ["title", "desc", "year", "length", "director", "url"],
      addMovie: {
        title: "",
        year: "",
        length: "",
        desc: "",
        director: "",
        genre: [],
        starring: [],
        available: [],
        url: ""
      },
      movies: null,
      addedRes: null,
      errors: null
    };
  },
  watch: {
    castLines() {
      this.blockCast = this.addMovie.starring.length <= 1;
    }
  },
  mounted() {
    axios({ method: "GET", url: "https://lobonode.ddns.net/api" })
      .then(response => (this.movies = response.data))
      .catch(e => {
        this.errors.push(e);
      });
    this.addCast(0);
  },
  methods: {
    addCast(id) {
      let checkGen = this.addMovie.starring[id];
      if (checkGen == " " && this.addMovie.starring.length > 0) {
        return;
      }
      this.addMovie.starring.push("");
      this.castLines = this.addMovie.starring;
    },
    removeCast(id) {
      if (!this.blockCast) {
        this.addMovie.starring.splice(id, 1);
        this.castLines = this.addMovie.starring;
      }
    },
    add() {
      axios({
        method: "POST",
        url: "https://lobonode.ddns.net/api",
        data: this.addMovie,
        headers: { "content-type": "application/json" }
      })
        .then(result => {
          this.addedRes = result.data.message;
          this.clearObjects();
          this.reloadMovies();
        })
        .catch(e => {
          this.errors.push(e);
          console.log(errors);
        });
    },
    clearObjects() {
      this.addMovie.title = " ";
      this.addMovie.year = " ";
      this.addMovie.length = " ";
      this.addMovie.desc = " ";
      this.addMovie.director = " ";
      this.addMovie.genre = [];
      this.addMovie.starring = [];
      this.addMovie.available = [];
      this.addMovie.url = " ";
      this.castLines = [];
      this.addCast(0);
    },
    reloadMovies() {
      axios({ method: "GET", url: "https://lobonode.ddns.net/api" })
        .then(response => (this.movies = response.data))
        .catch(e => {
          this.errors.push(e);
        });
    }
  }
};
</script>

<style scoped>
#logged {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 20px;
  margin-top: 10px;
}
.big,
.cast {
  font-size: 150%;
  font-weight: bold;
}
</style>
