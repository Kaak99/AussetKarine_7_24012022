//! ............................... TEMPLATE ............................... //

<template>
  <div class="post">
    <h1>This is a monProfile page test (adminprofile: id=4)</h1>
    <section class="monProfilContainer">
      <div class="profil">
        <p>{{ getApi[0].pseudo }}</p>
        <p>{{ getApi[0].email }}</p>
        <p>{{ getApi[0].bio }}</p>
        <!-- <img :src="/src/assets/img/avatar.png" /> -->
        <!-- <img :src="require(`@/assets/img/avatar.png`)" /> -->
      </div>
    </section>
  </div>
</template>

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
      url: "http://localhost:3000/api/users/4",
      getApi: null,
    };
  },
  created() {
    // axios.get(this.url).then((response) => (this.getApi = response.data));
    axios.get(this.url).then((response) => {
      // axios.get(`${this.url}/4`).then((response) => {
      this.getApi = response.data;
      console.log(this.getApi);
      this.loading = true;
    });
  },
};
</script>
