<template>
  <section class="details-section container-movies">
    <div v-if="currMovie" class="movie-details flex">
      <div class="movie-img">
        <img :src="currMovie.details.movieImg">
      </div>
      <!-- <div class="movie-table"> -->
      <div class="movie-info">
        <div class="flex wrap space-between">

          <h1>{{currMovie.details.name}} ({{currMovie.details.year}})</h1>
          <!-- CHAT IN CURRENT MOVIE -->
          <movie-chat/>
        </div>

        <label>Rate this movie:</label>
        <StarRating :show-rating="false" v-model="selectedRate" :increment="0.5" :star-size="30"></StarRating>
        
        <p><span style="text-decoration: underline;">Directed by:</span>&nbsp;

          <span v-for="director in currMovie.details.director" :key="director._id">{{director}}
            <span v-if="director !== currMovie.details.director[currMovie.details.director.length-1]">,</span>
          </span><br/><span style="text-decoration: underline;">Starred by:</span>&nbsp;
          <span v-for="actor in currMovie.details.actors" :key="actor._id"> {{actor}}
            <span v-show="actor !== currMovie.details.actors[currMovie.details.actors.length-1]">,</span>
          </span>

        </p>
        <p>{{currMovie.details.description}}</p>
      </div>
    </div>

    <review-list :directAndId="detailsForShowReviews"></review-list>

  </section>
</template>

<script>
import ReviewList from "./ReviewList.vue";
import StarRating from "../components/RatingStars.vue";
import MovieChat from '../components/MovieChat.vue';

export default {
  name: "movieDetails",
  data() {
    return {
      selectedRate: 0
    };
  },
  created() {
    const movieId = this.$route.params.movieId;
    this.$store.dispatch({ type: "moviesModule/loadMovie", movieId });
    if(this.$store.state.moviesModule.movies.length===0){
      this.$store.dispatch({ type: "moviesModule/loadMovies" })
    }
  },
  destroyed() {
    this.$store.commit({ type: "moviesModule/setMovie", currMovie: null });
  },
  computed: {
    currMovie() {
      return this.$store.state.moviesModule.currMovie
         },

    detailsForShowReviews() {
      if (this.currMovie) {
        var directAndId = {
          direct: "movie",
          id: this.currMovie._id
        };
        return directAndId;
      } else {
        return { err: "problem in MovieDetails page" };
      }
    },
    loggedInuser(){
      return this.$store.state.usersModule.currUser._id;
    },
     previoslyRated(){
       console.log('natash', currMovie,loggedInUser )
       
     }

  },
  watch: {
    selectedRate: function (selectedRate) {
      var rateDetails = {
        movieId: this.currMovie._id,
        rate: this.selectedRate,
        loggedInUser:this.loggedInuser
      }
      
      localStorage.setItem("currRate", JSON.stringify(rateDetails));
     console.log(rateDetails )
      this.$store.dispatch({ type: "moviesModule/updateStarRate", rateDetails })
    }
  },
  methods: {},
  components: {
    ReviewList,
    StarRating,
    MovieChat
  }
};
</script>

<style scoped lang="scss">
h1{
  margin-top: 0;    margin-bottom: 10px;
}
.movie-info{
  text-align: left;
  color: white;
  font-size: 17px;
  }

.movie-details {
  width: fit-content;
  margin-top: 30px;
  margin-bottom: 0px;
}
.movie-img img {
  width: 190px;
  border-radius: 4px;
  margin-right: 26px;
}
label{
  display: block;
  margin-top: 0px;
  font-size: 19px;
}

@media (max-width: 720px) {
  .movie-details{
    flex-direction: column;
  }
  .movie-img img {
    margin: 0;
  }
}

</style>