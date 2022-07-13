//! ............................... TEMPLATE ............................... //

<template>
  <div class="containAll d-flex">
    <div class="users container" v-if="loading === true">
      <h1>Déconnection page test</h1>
      <h2 class="centerTxt">cliquez pour vous déconnecter</h2>
      <div class="d-flex">
        <!-- <button class="buttonValid" v-on:click.prevent="localStorage.clear()">
          Je me déconnecte !
        </button> -->
        <button class="buttonValid" v-on:click.prevent="envoi">
          Je me déconnecte !
        </button>
      </div>
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

//! ............................... SCRIPT ............................... //

<script>
// @ is an alias to /src
//import axios from "axios";

export default {
  name: "deconnectionView",
  data() {
    return {
      compteur: 0,
      loading: true,
      url: "http://localhost:3000/api/users/login",
      messageRetour: "",
      pseudo: "",
      mdp: "",
    };
  },
  methods: {
    envoi: function () {
      localStorage.clear();
      this.$emit("connection", false);
      this.$router.push("/connection");
    },
  },
};
</script>

//! ............................... STYLE ............................... //
<style></style>

<style scoped>
.main {
  padding-bottom: 10px;
}

.userContainer {
  padding: 10px;
  border: solid 1px blue;
}

.user {
  padding: 5px;
  border: solid 2px red;
}
button {
  margin: 10px;
  padding: 5px;
}
</style>
