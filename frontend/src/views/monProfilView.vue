//! ............................... TEMPLATE ............................... //

<template>
  <div class="post">
    <h1>This is a monProfile page test</h1>
    <section class="monProfilContainer">
      <div class="profil">
        <p>{{ getApi.pseudo }}</p>
        <p>{{ getApi.email }}</p>
        <p>{{ getApi.bio }}</p>
        <!-- <img :src="/src/assets/img/avatar.png" /> -->
        <!-- <img :src="require(`@/assets/img/avatar.png`)" /> -->
      </div>
    </section>
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
      thisId: localStorage.getItem("userId"),
      url: "http://localhost:3000/api",
      urlGod: "http://localhost:3000/api/users/4",
      thisUrl: "",
      getApi: {},
    };
  },
  created() {
    this.thisUrl = `http://localhost:3000/api/users/${this.thisId}`;
    // axios.get(this.url).then((response) => (this.getApi = response.data));
    //this.thisId = localStorage.getItem("userId");
    console.log(this.thisId);
    console.log(this.thisUrl);
    console.log(this.url + `/users/` + this.thisId);
    axios.get(this.url + `/users/` + this.thisId).then((response) => {
      // axios.get(this.thisUrl).then((response) => {
      // axios.get(`${this.url}/4`).then((response) => {
      this.getApi = response.data[0];
      //console.log(response);
      console.log(this.getApi);
      console.log(this.getApi.pseudo);
      this.loading = true;
    });
  },
};
</script>

//! ............................... STYLE ............................... //

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
  border: solid 1px cyan;
}
</style>
