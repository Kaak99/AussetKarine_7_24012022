//! ............................... TEMPLATE ............................... //

<template>
  <div>
    <div class="posts container" v-if="loading === true">
      <h1>Voici la liste de tous les messages</h1>
      <h2 class="centerTxt">Tous les posts</h2>
      <div class="postContainer d-flex">
        <div class="writeBox">
          <div class="inputContainer d-flex">
            <label for="post-title" title="maximum 50 caractères"
              >Titre :</label
            >
            <input
              type="text"
              size="50"
              maxlength="50"
              class="centerTxt input-title"
              name="inputTitle"
              id="inputTitle"
              placeholder="votre titre"
              required
            />

            <label for="post-write" title="maximum 500 caractères"
              >Contenu :</label
            >
            <textarea
              rows="4"
              cols="1"
              maxlength="500"
              class="centerTxt input-text"
              name="inputText"
              id="inputText"
              placeholder="votre message"
              required
            ></textarea>
            <div class="input-button d-flex2s">
              <i class="fa-solid fa-image"></i>
              <i class="fa-solid fa-paper-plane"></i>
            </div>
          </div>
        </div>
        <!--ici démarre la zone de création de posts-->
        <div v-for="post in getApi" :key="post.idPosts" class="postsCard">
          <div class="post">
            <!-- <router-link to="/posts">Posts</router-link> -->
            <p class="post-title">{{ post.titre }}</p>
            <div class="post-image">
              <!-- <img alt="imag" src="../assets/imag.jpg" /> -->
              <img
                alt="image d'illustration "
                v-bind:src="post.image"
                v-if="post.image"
              />
            </div>

            <p class="post-text">{{ post.contenu }}</p>
            <p class="post-icon d-flex2c">
              <!-- <p class="addComment d-flex">📩</p>
              <p class="thumbUp d-flex">👍🏻</p>
              <p class="thumbDown d-flex">👎🏻</p>
              <p class="modifyPost d-flex">✍🏻</p>
              <p class="deletePost d-flex">🗑️</p> -->
              <i class="fa-solid fa-comment addComment"></i>
              <i class="fa-solid fa-thumbs-up thumbUp"></i>
              <i class="fa-solid fa-thumbs-down thumbDown"></i>
              <i class="fa-solid fa-pen-to-square modifyPost"></i>
              <i class="fa-solid fa-trash-can deletePost"></i>
            </p>
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
      commentFlag: 0,
      likeFlag: 0,
      unlikeFlag: 0,
      modifyFlag: 0,
      deleteFlag: 0,
      authFlag: 0,
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

<style></style>

<style scoped>
.main {
  padding-bottom: 10px;
}
.inputContainer {
  /* background-color: var(--main-color2); */
  background-color: #919ba7;
  border-radius: 25px;
  /* margin: 1vw 6vw; */
  width: 90%;
  margin: 10px auto;
  color: #3b46eb;
}
.postContainer {
  padding: 10px;
  border: solid 1px blue;
}
.writeBox {
  padding: 10px;
  border: solid 1px blue;
  margin-bottom: 10px;
}
.post-icon {
  flex-direction: row;
  justify-content: space-evenly;
}
.post {
  padding: 5px;
  border: solid 1px red;
  margin-bottom: 5px;
}
.forme {
  color: green;
}
.post-title {
  background-color: pink;
  font-weight: bold;
  text-decoration: underline;
}
.modifyPost,
.deletePost {
  color: #d11421;
}
.fa-solid {
  cursor: pointer;
  margin: 5px;
}
</style>
