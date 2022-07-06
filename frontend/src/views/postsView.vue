//! ............................... TEMPLATE ............................... //

<template>
  <div>
    <div class="posts container" v-if="loading === true">
      <h1>This is a posts page test</h1>
      <h2 class="centerTxt">Tous les posts</h2>
      <div class="postContainer d-flex">
        <!--ici démarre la zone de création de posts-->
        <div v-for="post in getApi" :key="post.idPosts" class="postsCard">
          <div class="post">
            <!-- <router-link to="/posts">Posts</router-link> -->
            <p class="post-title">{{ post.titre }}</p>
            <div class="post-image">
              <!-- <img alt="imag" src="../assets/imag.jpg" /> -->
              <img alt="imag" v-bind:src="post.image" />
            </div>

            <p class="post-text">{{ post.contenu }}</p>
            <div class="post-icon d-flex">
              <p class="addComment d-flex">📩</p>
              <p class="thumbUp d-flex">👍🏻</p>
              <p class="thumbDown d-flex">👎🏻</p>
              <p class="modifyPost d-flex">✍🏻</p>
              <p class="deletePost d-flex">🗑️</p>
            </div>
          </div>
        </div>
        <!-- <p>{{ getApi }}</p> -->
      </div>
    </div>
    <div class="noLoading" v-else>
      <!-- <div class="noLoading" v-if="loading === false"> -->
      <p class="problemeServeur centerTxt">Un problème est survenu.</p>
      <p class="problemeServeur centerTxt">
        Il semble que le serveur soit indisponible.
      </p>
      <p class="problemeServeur centerTxt">
        Ou bien qu'il y ait un problème sur votre connexion internet
      </p>
    </div>
  </div>
</template>

//! ............................... SCRIPT ............................... //

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "postsView",

  data() {
    return {
      info: null,
      loading: false,
      compteur: 0,
      text1: "texte de test",
      url: "http://localhost:3000/api/posts",
      getApi: null,
    };
  },
  created() {
    //mounted() {
    // axios.get(this.url).then((response) => (this.getApi = response.data));
    axios
      .get(this.url)
      .then((response) => {
        this.getApi = response.data;
        //car renvoi un objet data qui contient les differentes clés/valeur (cf postman)
        console.log(this.getApi);
        this.loading = true;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

//! ............................... STYLE ............................... //

<style>
.main {
  padding-bottom: 10px;
}

.postContainer {
  padding: 10px;
  border: solid 1px blue;
}
.post {
  padding: 5px;
  border: solid 1px cyan;
  margin-bottom: 5px;
}
</style>

<style scoped>
.main {
  padding-bottom: 10px;
}

.postContainer {
  padding: 10px;
  border: solid 1px blue;
}
.post-icon {
  flex-direction: row;
  justify-content: space-evenly;
}
.post {
  padding: 5px;
  border: solid 2px red;
}
.forme {
  color: green;
}
.post-title {
  background-color: pink;
  font-weight: bold;
  text-decoration: underline;
}
</style>
