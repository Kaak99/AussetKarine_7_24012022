//! ............................... TEMPLATE ............................... //

<template>
  <div class="container">
    <div class="users">
      <h1>Connection page test</h1>
      <h2 class="centerTxt">Veuillez rentrer votre pseudo et mot de passe</h2>
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
      </div>
    </div>
    <div class="noLoading">
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

//! ............................... SCRIPT ............................... //

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "connectionView",
  data() {
    return {
      compteur: 0,
      loading: false,
      url: "http://localhost:3000/api/users/login",
      getApi: "",
    };
  },
  created() {
    axios
      .post(this.url, { pseudo: "user60", password: "mdp" })
      .then((response) => {
        this.getApi = response.data;
        console.log(this.getApi);
        console.log(this.getApi.userId);
        console.log(this.getApi.token);
        this.loading = true;
      });
  },
};
/*
//afficher warning
function warning(){
  noLoading.style.display = 'block' ;
}

//afficher warning
function noWarning(){
  noLoading.style.display = 'none' ;
}
*/
//const noLoading = document.querySelector('.noLoading');

//const postsContainerHTML = document.querySelector(".postsContainer");
//const url = "http://localhost:3000/api/users/login";

// axios.get('https://api.chucknorris.io/jokes/search?query=god')
//   .then(function (response) {
//     return response;
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
</script>
