<template>
  <div id="logged">
    <h1>Welcome admin</h1>
    <h2>Add movies to the database</h2>
    <b-container fluid>
      <b-row class="my-1" v-for="(details,index) in items" :key="details">
        <b-col sm="3">
          <label :for="`details-${details}`">{{details.charAt(0).toUpperCase() + details.slice(1)}}:</label>
        </b-col>
        <b-col sm="3">
          <b-form-textarea
            v-if="details == 'desc'"
            :id="`details-${details}`"
            :type="`${types[index]}`"
            v-model="addMovie[details]"
            :rows="4"
          ></b-form-textarea>
          <b-form-input
            v-else
            :id="`details-${details}`"
            :type="`${types[index]}`"
            v-model="addMovie[details]"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <label>Genre</label>
        </b-col>
        <b-col sm="3">
          <b-form-select multiple :select-size="7" v-model="addMovie.genre" :options="genres"></b-form-select>
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
    <b-btn
      :size="'lg'"
      :variant="'success'"
      :disabled="updateMovie"
      v-if="isFilled"
      @click="add()"
    >Add Movie</b-btn>
    <b-btn
      v-if="updateMovie"
      :size="'lg'"
      :variant="'success'"
      :disabled="!updateMovie"
      @click="upMovie(updateID)"
    >Update Movie</b-btn>
    <p class="big">{{addedRes}}</p>
    <b-container fluid>
      <b-row>
        <b-col sm="3">
          <label class="big">Search Movies</label>
        </b-col>
        <b-col sm="6">
          <b-form-input type="text" v-model="search" placeholder="Enter title"></b-form-input>
        </b-col>
      </b-row>
    </b-container>
    <h2>Movies in database</h2>
    <div v-for="(movie, indx) in searchMovies" :key="indx">
      <a v-bind:href="movie.url" target="_blank">
        <h3>{{movie.title}}</h3>
      </a>
      <b-button :size="' '" :variant="'warning'" @click="getData(movie._id)">Update</b-button>
      <b-button :size="' '" :variant="'danger'" @click="deleteItem(movie._id)">Remove</b-button>
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
        "Documentary",
        "Historical",
        "Horror",
        "Musical",
        "Mystery",
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
      types: ["text", "text", "number", "number", "text", "text"],
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
      updateMovie: false,
      updateID: null,
      movies: [],
      addedRes: null,
      errors: null,
      search: ""
    };
  },
  watch: {
    castLines() {
      this.blockCast = this.addMovie.starring.length <= 1;
    }
  },
  computed: {
    isFilled: function() {
      if (this.addMovie.title != "" && this.addMovie.title.length >= 3)
        return true;
      return false;
    },
    searchMovies: function() {
      let filter = new RegExp(this.search, "i");
      return this.movies.filter(movie => {
        return movie.title.match(filter);
      });
    }
  },
  mounted() {
    this.genres.sort();
    this.reloadMovies();
    this.addCast(0);
  },
  methods: {
    addCast(id) {
      let checkGen = this.addMovie.starring[id];
      if (checkGen == "" && this.addMovie.starring.length > 0) {
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
        });
    },
    upMovie(id) {
      axios({
        method: "PUT",
        url: "https://lobonode.ddns.net/api/update/" + id,
        data: this.addMovie,
        headers: { "content-type": "application/json" }
      }).then(result => {
        this.addedRes = result.data.message;

        this.updateID = null;
        this.updateMovie = false;

        this.clearObjects();
        this.reloadMovies();
      });
    },
    deleteItem(id) {
      let deleteMovie = confirm("Are you sure?");
      if (deleteMovie) {
        axios({
          method: "DELETE",
          url: "https://lobonode.ddns.net/api/delete/" + id,
          headers: { "content-type": "application/json" }
        })
          .then(result => {
            this.addedRes = result.data.message;
            this.clearObjects();
            this.reloadMovies();
          })
          .catch(e => {
            this.errors.push(e);
          });
      }
    },
    getData(id) {
      axios({
        method: "GET",
        url: "https://lobonode.ddns.net/api/movie/" + id,
        headers: { "content-type": "application/json" }
      }).then(result => {
        let movie = result.data;
        this.addMovie.title = movie.title;
        this.addMovie.year = movie.year;
        this.addMovie.length = movie.length;
        this.addMovie.desc = movie.desc;
        this.addMovie.director = movie.director;
        this.addMovie.genre = movie.genre;
        this.addMovie.starring = movie.starring;
        this.addMovie.available = movie.available;
        this.addMovie.url = movie.url;
        this.updateID = movie._id;
        this.updateMovie = true;
        this.castLines = movie.starring;
        window.scrollTo(0, 0);
      });
    },
    clearObjects() {
      this.addMovie.title = "";
      this.addMovie.year = "";
      this.addMovie.length = "";
      this.addMovie.desc = "";
      this.addMovie.director = "";
      this.addMovie.genre = [];
      this.addMovie.starring = [];
      this.addMovie.available = [];
      this.addMovie.url = "";
      this.castLines = [];
      this.addCast(0);
    },
    reloadMovies() {
      axios({ method: "GET", url: "https://lobonode.ddns.net/api/_id/-1" })
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
