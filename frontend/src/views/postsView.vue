//! ............................... TEMPLATE ............................... //

<template>
  <div>
    <div class="posts" v-if="loading === true">
      <h1>This is a posts page test</h1>
      <h2 class="centerTxt">Tous les posts</h2>
      <div class="postContainer d-flex">
        <!--ici démarre la zone de création de posts-->
        <div v-for="post in getApi" :key="post.idPosts" class="postsCard">
          <div class="post">
            <!-- <router-link to="/posts">Posts</router-link> -->
            <p class="post-title">{{ post.titre }}</p>
            <p class="post-text">{{ post.contenu }}</p>
          </div>
        </div>
        <p>{{ getApi }}</p>
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
  mounted() {
    // axios.get(this.url).then((response) => (this.getApi = response.data));
    axios.get(this.url).then((response) => {
      this.getApi = response.data;
      this.loading = true;
    });
  },
};
/*
import axios from "axios";
export default {
  //pourquoi erreur sinon??
  name: "postsView",
  data() {
    return {
      getApi: null,
      url: "http://localhost:3000/posts",
    };
  },
};
// eslint-disable-next-line no-undef
new Vue({
  el: "#app",
  data: {
    loading: false,
    compteur: 0,
    text1: "texte de test",
    //url: "http://localhost:3000/posts",
    //getApi: null,
  },
  methods: {
    getPostsAxios: function () {
      axios
        .get("http://localhost:3000/posts")
        .then((data) => {
          console.log(data); //affiche les data de l'api (tableau d'objet)
          this.getApi = data;
        })

        // Message d'erreur //
        .catch((error) => {
          console.error("erreur : ", error); //affiche message d'erreur
          //warning();
        });
    },
  },
  computed: {},
  watch: {},
});

*/
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
