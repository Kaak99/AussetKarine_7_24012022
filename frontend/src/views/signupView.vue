//! ............................... TEMPLATE ............................... //

<template>
  <div class="containAll">
    <div class="users container">
      <!-- <div class="users" v-if="loading === true"> -->
      <form class="formSignup">
        <h1>Page d'inscription</h1>
        <h2 class="centerTxt">Veuillez rentrer les informations demandées</h2>
        <div class="userContainer d-flex">
          <!--ici démarre la zone de création de posts-->
          <!-- <div class="usersCard">
          <div class="user">
            <p class="user-pseudo">pseudo</p>
            <p class="user-bio">presentation</p>
          </div>
         </div> -->
          <label for="userEmail" title="format email & >5car">Email :</label>
          <input
            v-model="inputEmail"
            type="text"
            size="20"
            maxlength="30"
            class="centerTxt"
            name="email"
            id="email"
            placeholder="votre email"
            required
          />
          <p id="emailAlert" class="userEmailAlert">
            <i class="fas fa-times-circle"></i>Email incorrect
          </p>
          <p id="emailOk" class="userEmailValid">
            <i class="fas fa-check-circle"></i>Email accepté
          </p>

          <label for="userPseudo" title="au moins 5 lettres">Pseudo :</label>
          <input
            v-model="inputPseudo"
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

          <label for="userBio" title="au moins 5 lettres">Bio :</label>
          <textarea
            v-model="inputBio"
            name="bio"
            id="bio"
            placeholder="votre bio"
            rows="3"
            cols="30"
            maxlength="120"
          />
          <p id="bioAlert" class="userBioAlert">
            <i class="fas fa-times-circle"></i>Bio incorrecte
          </p>
          <p id="bioOk" class="userBioValid">
            <i class="fas fa-check-circle"></i>Bio acceptée
          </p>

          <label for="userAvatar" title="fichier jpg/webp/gif/png <50mo"
            >Avatar :</label
          >
          <input
            type="file"
            class="fileButton"
            id="file"
            ref="file"
            name="image"
            @change="selectFile()"
            accept=".jpg,.jpeg,.png,.gif,.webp"
          />
          <!-- <input
            v-model="avatar"
            type="text"
            size="20"
            maxlength="50"
            class="centerTxt"
            name="avatar"
            id="avatar"
            placeholder="votre avatar"
            default="avatarAnonyme"
          /> -->
          <p id="avatarAlert" class="userAvatarAlert">
            <i class="fas fa-times-circle"></i>Avatar incorrect
          </p>
          <p id="avatarOk" class="userAvatarValid">
            <i class="fas fa-check-circle"></i>Avatar accepté
          </p>

          <label for="userPassword" title="au moins 6 caractères"
            >Mot de passe :</label
          >
          <input
            v-model="inputPassword"
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
          <button class="buttonValid" v-on:click.prevent="envoiInscription">
            Je m'inscris !
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
  name: "signupView",
  data() {
    return {
      compteur: 0,
      loading: true,
      url: "http://localhost:3000/api/users/signup",
      postApiResponse: "",
      messageRetour: "",
      inputEmail: "",
      inputPseudo: "",
      inputBio: "",
      inputPassword: "",
      inputFile: "",
      image: "",
    };
  },
  methods: {
    selectFile() {
      //console.log(this.$refs.file.files[0].name);
      this.inputFile = this.$refs.file.files[0];
      //console.log(this.inputFile);
    },
    envoiInscription: function () {
      let formdata = new FormData();
      //console.log(this.inputPseudo);
      //console.log(this.inputPassword);
      //console.log(this.inputEmail);
      formdata.append("pseudo", this.inputPseudo);
      formdata.append("password", this.inputPassword);
      formdata.append("email", this.inputEmail);
      //console.log(formdata);
      if (this.inputFile) {
        formdata.append("image", this.inputFile, this.inputFile.name);
        // } else {
        //   formdata.append(
        //     "image",
        //     "http://localhost:3000/images/default.jpg",
        //     "default.jpg"
        //   );
      }
      formdata.append("id_Users", localStorage.getItem("userId"));
      formdata.append("bio", this.inputBio);
      formdata.append("admin", 0);
      formdata.append("active", 1);

      //console.log(formdata);
      axios
        // .post(this.url, {
        //   pseudo: this.pseudo,
        //   password: this.mdp,
        //   image: this.avatar,
        //   email: this.email,
        //   bio: this.bio,
        //   admin: 0,
        //   active: 1,
        // })
        .post(this.url, formdata)
        // .post(this.url, { pseudo: "user60", password: "mdp" })
        .then((response) => {
          this.postApiResponse = response.data;
          this.messageRetour = "inscription...";
          //console.log(this.postApiResponse);
          //console.log(this.postApiResponse.userId);
          //console.log(this.postApiResponse.token);
          this.loading = true;
          this.$router.push("/connection"); //redirection vers /connection
          // localStorage.setItem(
          //   JSON.stringify(this.postApiResponse.userId),
          //   JSON.stringify(this.postApiResponse.token)
          // );
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
