//! ............................... TEMPLATE ............................... //

<template>
  <div class="containAll">
    <div class="users container">
      <!-- <div class="users" v-if="loading === true"> -->
      <form class="formSignup">
        <h1>Page d'inscription</h1>
        <h2 class="centerTxt">Obligatoire: email, pseudo,mot de passe</h2>
        <div class="userContainer d-flex">
          <!--ici démarre la zone de création de posts-->
          <!-- <div class="usersCard">
          <div class="user">
            <p class="user-pseudo">pseudo</p>
            <p class="user-bio">presentation</p>
          </div>
         </div> -->

          <label for="userPseudo" title="chiffres et lettres (3-25)"
            >Pseudo :</label
          >
          <input
            v-model="inputPseudo"
            type="text"
            size="10"
            maxlength="20"
            class="centerTxt"
            name="pseudo"
            id="pseudo"
            placeholder="2+(lettre, chiffre,underscore)"
            pattern="\w*"
            required
          />
          <p
            id="pseudoAlert"
            class="userPseudoAlert"
            v-if="testRegex(/^\w{2,25}$/, this.inputPseudo) === false"
          >
            <i class="fas fa-times-circle"></i>Pseudo incorrect
          </p>
          <p
            id="pseudoOk"
            class="userPseudoValid"
            v-if="testRegex(/^\w{2,25}$/, this.inputPseudo) === true"
          >
            <i class="fas fa-check-circle"></i>Pseudo accepté
          </p>

          <label for="userEmail" title="identifiant@gpm.fr (30 caractères max)"
            >Email :</label
          >
          <input
            v-model="inputEmail"
            type="text"
            size="20"
            maxlength="30"
            class="centerTxt"
            name="email"
            id="email"
            placeholder="votre email @gpm.fr"
            required
          />
          <p
            id="emailAlert"
            class="userEmailAlert"
            v-if="!testRegex(/^\w+([\.-]?\w+)*@gpm.fr$/, this.inputEmail)"
          >
            <i class="fas fa-times-circle"></i>Email incorrect
          </p>
          <p
            id="emailOk"
            class="userEmailValid"
            v-if="testRegex(/^\w+([\.-]?\w+)*@gpm.fr$/, this.inputEmail)"
          >
            <i class="fas fa-check-circle"></i>Email accepté
          </p>

          <label for="userBio" title="chiffres et lettres (200 max)">Bio</label>
          <textarea
            v-model="inputBio"
            name="bio"
            id="bio"
            placeholder="parlez de vous..."
            class="centerTxt"
            rows="3"
            cols="30"
            maxlength="120"
          />
          <p
            id="bioAlert"
            class="userBioAlert"
            v-if="!testRegex(/^.{0,200}$/, this.inputBio)"
          >
            <i class="fas fa-times-circle"></i>Bio incorrecte
          </p>
          <p
            id="bioOk"
            class="userBioValid"
            v-if="testRegex(/^.{0,200}$/, this.inputBio)"
          >
            <i class="fas fa-check-circle"></i>Bio acceptée
          </p>

          <label for="userAvatar" title="fichier jpg/webp/gif/png <3mo"
            >Avatar</label
          >
          <!-- <img src="../../../backend/images/default.gif" /> -->
          <img
            v-if="!image"
            class="avatar"
            src="../assets/default.gif"
            title="changez le maintenant ou plus tard"
          />
          <img
            v-if="image"
            alt="avatar"
            class="avatar"
            v-bind:src="image"
            :title="image"
          />
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
          <!-- <p id="avatarAlert" class="userAvatarAlert">
            <i class="fas fa-times-circle"></i>Avatar incorrect
          </p>
          <p id="avatarOk" class="userAvatarValid">
            <i class="fas fa-check-circle"></i>Avatar accepté
          </p> -->

          <label
            for="userPassword"
            title="Au moins 8 caractères dont chiffre et lettre"
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
            placeholder="8+caractères (maj,min,chiffre,special)"
            required
          />
          <p
            id="passwordAlert"
            class="userPasswordAlert"
            v-if="
              !testRegex(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/,
                this.inputPassword
              )
            "
          >
            <i class="fas fa-times-circle"></i>mot de passe incorrect
          </p>
          <p
            id="passwordOk"
            class="userPasswordValid"
            v-if="
              testRegex(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/,
                this.inputPassword
              )
            "
          >
            <i class="fas fa-check-circle"></i>mot de passe accepté
          </p>
          <button class="buttonValid" v-on:click.prevent="envoiInscription">
            Je m'inscris !
          </button>
          <p class="messageRetour">{{ messageRetour }}</p>
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
      //url: "http://localhost:3000/api/users/signup",
      url: `${process.env.VUE_APP_URL_SERVEUR}/api/users/signup`,
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
    testRegex(laRegex, varATester) {
      //const regex = new RegExp(laRegex);
      const valeurTest = laRegex.test(varATester);
      console.log("valeurTest", valeurTest);
      return valeurTest;
    },
    selectFile() {
      // console.log("j'ai cliqué sur selecteur de fichier");
      this.messageRetour = "";
      //console.log(this.$refs.file.files[0].name);
      this.inputFile = this.$refs.file.files[0];
      this.image = URL.createObjectURL(this.inputFile);
      //console.log(this.inputFile);
    },
    envoiInscription: function () {
      // console.log("j'ai cliqué sur bouton inscription");
      this.messageRetour = "";
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
      //formdata.append("id_Users", localStorage.getItem("userId"));
      formdata.append("bio", this.inputBio);
      formdata.append("admin", 0);
      formdata.append("active", 1);

      console.log(formdata);
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
          //console.log(error.response.data);
          console.log(error.response.status);
          if (error.response.status == 500) {
            this.messageRetour = "fichier trop gros (3Mo max)!";
          } else {
            console.log(error.response.status);
            //this.messageRetour = "une erreur est survenue";
          }
          //this.messageRetour = this.postApiResponse.error;
          //this.loading = false;
        });
    },
  },
};
</script>

//! ............................... STYLE ............................... //
<style></style>

<style scoped>
* {
  padding: 0.5% 1%;
}
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
.avatar {
  width: 20%;
  max-width: 600px;
  min-width: 80px;
  margin: 2px auto;
}
</style>
