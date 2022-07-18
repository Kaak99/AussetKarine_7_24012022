//! ............................... TEMPLATE ............................... //

<template>
  <div>
    <div class="users container" v-show="loading === true">
      <h1>Tous nos utilisateurs</h1>
      <!-- <p>{{ monToken }}</p> -->
      <h2 class="centerTxt">
        Cliquez sur un utilisateur pour détailler sa fiche
      </h2>
      <div class="userContainer d-flex">
        <!--ici démarre la zone de users-->
        <!-- <div class="usersCard">
        <div class="user">
          <p class="user-pseudo">pseudo</p>
          <p class="user-bio">presentation</p>
        </div>
        </div> -->
        <div v-for="user in getApi" :key="user.idUsers" class="usersCard">
          <div class="user">
            <router-link :to="{ name: 'user', params: { id: user.idUsers } }">{{
              user.pseudo
            }}</router-link>
            <!-- <router-link to="`/users/${user.idUsers}`" class="user-pseudo">{{
              user.pseudo
            }}</router-link> -->
          </div>
        </div>
        <!-- <p>{{ getApi }}</p> -->
      </div>
    </div>

    <div class="noLoading" v-show="loading === false">
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
  name: "usersView",
  data() {
    return {
      loading: false,
      getApi: "",
      number1: 2,
      url: "http://localhost:3000/api/users",
      urlVue2: "https://fr.vuejs.org/v2/guide/installation.html",
      monImport: "",
      monToken: this.token,
    };
  },

  props: ["token"],

  mounted() {
    axios
      .get(this.url)
      .then((response) => {
        this.getApi = response.data;
        this.loading = true;
      })
      // axios.get(this.url).then((response) => (this.getApi = response.data));
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

//! ............................... STYLE ............................... //

<style scoped>
.main {
  padding-bottom: 1vw;
}

.userContainer {
  padding: 10px;
  border: solid 2px darkblue;
}

.user {
  padding: 5px;
  border: solid 1px #fd2d01;
  /* #fd2d01=var(--main-color1); */
}
</style>
