//! ............................... TEMPLATE ............................... //

<template>
  <div class="containAll">
    <div class="users container" v-if="loading === true">
      <form class="formLogin">
        <h1>Connectez vous ici</h1>
        <h2 class="centerTxt">
          Veuillez rentrer votre pseudo et votre mot de passe
        </h2>
        <div class="userContainer d-flex">
          <!--ici démarre la zone de création de posts-->
          <!-- <div class="usersCard">
          <div class="user">
            <p class="user-pseudo">pseudo</p>
            <p class="user-bio">presentation</p>
          </div>
         </div> -->
          <label for="userPseudo" title="au moins 5 lettres">Pseudo :</label>
          <input
            v-model="pseudo"
            type="text"
            size="10"
            maxlength="20"
            class="centerTxt"
            name="pseudo"
            id="pseudo"
            placeholder="votre pseudo"
            required
          />
          <p id="pseudoAlert" class="userPseudoAlert">
            <i class="fas fa-times-circle"></i>Pseudo incorrect
          </p>
          <p id="pseudoOk" class="userPseudoValid">
            <i class="fas fa-check-circle"></i>Pseudo accepté
          </p>

          <label for="userPassword" title="au moins 6 caractères"
            >Mot de passe :</label
          >
          <input
            v-model="mdp"
            type="password"
            size="10"
            maxlength="16"
            class="centerTxt cart"
            name="userPassword"
            id="userPassword"
            placeholder="mot de passe"
            required
          />
          <p id="passwordAlert" class="userPasswordAlert">
            <i class="fas fa-times-circle"></i>mot de passe incorrect
          </p>
          <p id="passwordOk" class="userPasswordValid">
            <i class="fas fa-check-circle"></i>mot de passe accepté
          </p>
          <button class="buttonValid" v-on:click.prevent="envoi">
            Je me connecte !
          </button>
          <p>{{ messageRetour }}</p>
        </div>
      </form>
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
import axios from "axios";

export default {
  name: "connectionView",
  data() {
    return {
      compteur: 0,
      loading: true,
      url: "http://localhost:3000/api/users/login",
      postApiResponse: "",
      messageRetour: "",
      pseudo: "",
      mdp: "",
    };
  },
  // emits: ["update:isConnected"],
  methods: {
    envoi: function () {
      axios
        .post(this.url, { pseudo: this.pseudo, password: this.mdp })
        // .post(this.url, { pseudo: "user60", password: "mdp" })
        .then((response) => {
          this.postApiResponse = response.data;
          this.messageRetour = "Connexion";
          console.log(this.postApiResponse);
          console.log(this.postApiResponse.userId);
          console.log(this.postApiResponse.token);
          this.loading = true;
          localStorage.setItem("userId", this.postApiResponse.userId);
          localStorage.setItem("userToken", this.postApiResponse.token);
          //stringify inutile? token est une chaine mais userId??
          // localStorage.setItem(
          //   "userId",
          //   JSON.stringify(this.postApiResponse.userId)
          // );
          // localStorage.setItem(
          //   "userToken",
          //   JSON.stringify(this.postApiResponse.token)
          // );
          this.$emit("connection", true); //fait remonter à app.vue l'action connection avec le parametre true
          this.$router.push("/"); //redirection vers /home
        })
        .catch((error) => {
          console.log(error);
          this.messageRetour = error.response.data.erreur;
          console.log(error.response.data);
          //this.messageRetour = this.postApiResponse.error;
          //this.loading = false;
        });
    },
  },
};
</script>

//! ............................... STYLE ............................... //
<style>
.user {
  padding: 5px;
  border: solid 1px cyan;
  margin-bottom: 5px;
}
.main {
  padding-bottom: 10px;
}

.userContainer {
  padding: 10px;
  border: solid 1px blue;
}
</style>

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
</style>
