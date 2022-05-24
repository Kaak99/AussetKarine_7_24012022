<template>
  <div class="posts" v-if="loading === true">
    <h1>This is a posts page test</h1>
    <h2 class="centerTxt">Tous les posts</h2>
    <div class="postContainer d-flex">
      <!--ici démarre la zone de création de posts-->
      <!-- <div class="postsCard">
        <div class="post">
          <p class="post-title">titre du post</p>
          <p class="post-text">texte du post</p>
        </div>
      </div> -->
    </div>

    <div class="noLoading" v-if="loading === false">
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

<script>
// @ is an alias to /src
// eslint-disable-next-line no-undef
new Vue({
  el: "#monRS",
  data: {
    loading: false,
    compteur: 0,
    url: "http://localhost:3000/posts",
  },
  methods: {
    getPostsAxios: function () {},
  },
  computed: {},
  watch: {},
});
</script>
