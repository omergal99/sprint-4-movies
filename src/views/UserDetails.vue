<template>
  <section class="user-profile container-movies">
    <!-- USER DETAILS -->

    <div class="user-container flex" v-if="viewUser">

      <div class="user">
        <h2>{{viewUser.name}}</h2>

        <div class="user-img">
          <img :src="viewUser.userImg">
          <!-- change image button -->
          <div v-if="currUser._id===viewUser._id" class="changeImg-btn">
            <input style="display: none" type="file" @change="onfileSelected" ref="fileInput">
            <button class="add-img" @click="$refs.fileInput.click()">Add/Change your picture</button>
          </div>
        </div>
      </div>

      <div class="details flex flex-col">
        <!-- number of reviews/likes/dislikes/following/followers -->
        <div class="user-data flex space-between wrap">
          <div class="reviews flex flex-col align-center">
            <span>{{numOfReviews}}</span>
            <span>Reviews</span>
          </div>
          <div class="likes flex flex-col align-center">
            <span>{{numOfLikes}}</span>
            <span>Likes</span>
          </div>
          <div class="dislikes flex flex-col align-center">
            <span>{{numOfDislikes}}</span>
            <span>Dislikes</span>
          </div>
          <div class="followers flex flex-col align-center">
            <span v-if="followers">{{followers.length}}</span>
            <span v-else>0</span>
            <span>Followers</span>
          </div>
          <div class="following flex flex-col align-center">
            <span v-if="following">{{following.length}}</span>
            <span v-else>0</span>
            <span>Following</span>
          </div>
        </div>
      
        <div class="flex space-between">
          <user-chat/>
          <follow-user @already-follow="alreadyFollow"></follow-user>
          <span v-if="already && viewUser" class="you-follow">You follow {{viewUser.name}}</span>
          <!-- <follow-user @viewUserFollowedBy="viewUserFollowedBy" @viewUserFollowAfter="viewUserFollowAfter"></follow-user> -->
        </div>

      </div>
    </div>


    <!--  user reviews -->
    <div class="user-reviews full">
      <review-list :directAndId="detailsForShowReviews"></review-list>
    </div>

    <!-- following reviews -->

  </section>
</template>

<script>
import ReviewList from "./ReviewList.vue";
import UserChat from "../components/UserChat.vue";
import FollowUser from "./FollowUser.vue";

export default {
  name: "UserDetails",
  data() {
    return {
      // followers: null,    
      // following: null,
      isUserChatOpen: false,
      selectedFile: null,
      already: false
    };
  },
  created() {
    this.loadUser();
  },
  destroyed() {
    this.$store.commit({ type: "usersModule/cleanViewUser" });
  },

  methods: {
    onfileSelected(event) {
      this.selectedFile = event.target.files[0];
      var fileAndUser = {
        selectedImg: this.selectedFile,
        user: this.viewUser._id
      };
      this.$store.dispatch({ type: "usersModule/uploadImg", fileAndUser });
    },

    loadUser() {
      var userId = this.$route.params.userId;
      this.$store.dispatch({ type: "usersModule/loadViewUser", userId });
    },
    // viewUserFollowedBy(list) {
    //   if( !list ) return
    //   console.log('followers:', list)
    //   this.followers = list; //followers
    // },
    // viewUserFollowAfter(list) {
    //   if( !list ) return
    //   this.following = list;   //following
    // },
    alreadyFollow(already){
      // console.log('already', already)
      this.already = true 
    }
  },
  watch: {
    userId: function () {
      this.loadUser();
    },
  },
  computed: {
    viewUser() {
      return this.$store.state.usersModule.viewUser;
    },
    userId() {
      return this.$route.params.userId;
    },
    detailsForShowReviews() {
      if (this.viewUser) {
        var directAndId = {
          direct: "user",
          id: this.viewUser._id
        };
        return directAndId;
      } else {
        return { err: "problem in UserDetails page" };
      }
    },
    followers(){
      if(this.$store.state.usersModule.viewUser){
        // console.log('followedBy:', this.$store.state.usersModule.viewUser.follow.followedBy)
        return this.$store.state.usersModule.viewUser.follow.followedBy;
      }
    },
    following(){
      if(this.$store.state.usersModule.viewUser){
        console.log('followAfter:', this.$store.state.usersModule.viewUser.follow.followAfter)
        return this.$store.state.usersModule.viewUser.follow.followAfter;
      }
    },

    currUser() {
      return this.$store.state.usersModule.currUser;
    },
    numOfReviews() {
      return this.$store.getters["reviewsModule/numOfReviews"];
    },
    numOfLikes() {
      return this.$store.getters["reviewsModule/numOfLikes"];
    },
    numOfDislikes() {
      return this.$store.getters["reviewsModule/numOfDislikes"];
    },
  },

  components: {
    ReviewList,
    UserChat,
    FollowUser
  }
};
</script>

<style scoped lang="scss">

.user-profile {
  color: white;
  text-align: left;
}

.user-container {
  flex: 0 0 270px;
  margin-top: 20px;
}

.details{
  width: 100%;
}


.user {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.user-img {
  width: 150px;
  display: inline-block;
  position: relative;
  margin: 0 auto;
}

.user-img img {
  border-radius: 3px;
  // width: 150px;
}

.add-img {
  padding: 5px;
  text-align: center;
  //color: white;
  border: solid 2px white;
  z-index: 1;
}

.changeImg-btn {
  position: absolute;
  bottom: 0;
  text-align: center;
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 1;
}

.user-img:hover .changeImg-btn {
  opacity: 1;
}

.user-data {
  width: 100%;
  padding: 20px;
}

.you-follow{
  margin: 27px;
  font-family: Arial, Helvetica, sans-serif;
}

.user-reviews {
  margin-top: 10px;
}

@media (max-width: 720px) {
  .user-profile {
    flex-direction: column;
    .add-img {
      color: white;
      padding: 7px;
      cursor: pointer;
      border: none;
      border-radius: 3px;
      outline: none;
      background-color: #1a1818;
      transition: 0.3s;
      margin-right: 3px;
      &:hover {
        color: #3481b4;
      }
    }
  }
  .user-container {
    flex-direction: column;
  }
}
</style>
