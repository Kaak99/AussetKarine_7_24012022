//! ............................... TEMPLATE ............................... //

<template>
  <div class="containAll">
    <div class="users container">
      <!-- <div class="users" v-if="loading === true"> -->
      <form class="formSignup">
        <h1>Page d'inscription</h1>
        <!-- <h2 class="centerTxt">Obligatoire: pseudo, email, mot de passe</h2> -->
        <div class="userContainer d-flex">
          <!--ici démarre la zone de création de posts-->
          <!-- <div class="usersCard">
          <div class="user">
            <p class="user-pseudo">pseudo</p>
            <p class="user-bio">presentation</p>
          </div>
         </div> -->

          <label
            for="userPseudo"
            title="chiffres et lettres (2-25)"
            class="inputLabel"
            >Pseudo :</label
          >
          <input
            v-model="inputPseudo"
            type="text"
            size="10"
            maxlength="25"
            class="centerTxt inputBox"
            name="pseudo"
            id="pseudo"
            placeholder="2 à 25 caractères"
            pattern="\w*"
            required
          />
          <p
            id="pseudoOk"
            class="userPseudoValid"
            v-if="testRegex(/^\w{2,25}$/, this.inputPseudo, 1) === true"
          >
            <i class="fas fa-check-circle"></i>Correct
          </p>
          <p v-else id="pseudoAlert" class="userPseudoAlert">
            <i class="fas fa-times-circle"></i>lettre/chiffre/underscore
            uniquement
          </p>

          <label
            for="userEmail"
            title="identifiant@gpm.fr (40 caractères max)"
            class="inputLabel"
            >Email :</label
          >
          <input
            v-model="inputEmail"
            type="text"
            size="20"
            maxlength="40"
            class="centerTxt inputBox"
            name="email"
            id="email"
            placeholder="votre email d'entreprise gpm.fr"
            required
          />
          <p
            id="emailOk"
            class="userEmailValid"
            v-if="testRegex(/^\w+([\.-]?\w+)*@gpm.fr$/, this.inputEmail, 2)"
          >
            <i class="fas fa-check-circle"></i>Correct
          </p>
          <p v-else id="emailAlert" class="userEmailAlert">
            <i class="fas fa-times-circle"></i>identifiant@gpm.fr
          </p>

          <label
            for="userPassword"
            title="8 à 20 caractères dont maj/min/chiffre/special"
            class="inputLabel"
            >Mot de passe :</label
          >

          <input
            v-model="inputPassword"
            type="password"
            size="10"
            maxlength="20"
            class="centerTxt inputBox"
            name="userPassword"
            id="userPassword"
            placeholder="8 à 20 caractères"
            required
          />
          <p
            id="passwordOk"
            class="userPasswordValid"
            v-if="
              testRegex(
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/,
                this.inputPassword,
                3
              )
            "
          >
            <i class="fas fa-check-circle"></i>Correct
          </p>
          <p v-else id="passwordAlert" class="userPasswordAlert">
            <i class="fas fa-times-circle"></i>Avec:
            majuscule,minuscule,chiffre,special
          </p>
          <p class="infoSignUp">
            Vous pourrez ultérieurement changer votre pseudo, et rajouter un
            avatar et une bio.
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
      testEmail: false,
      inputPseudo: "",
      testPseudo: false,
      inputPassword: "",
      testPassword: false,
      inputBio: "",
      testBio: false,
      testFinal: {
        testEmail: false,
        testPseudo: false,
        testPassword: false,
        testBio: false,
      },
      inputFile: "",
      image: "",
    };
  },
  watch: {
    inputPseudo: function (val) {
      //console.log("watch", val);
      this.messageRetour = "";
    },
    inputEmail: function (val) {
      this.messageRetour = "";
    },
    inputPassword: function (val) {
      this.messageRetour = "";
    },
    inputBio: function (val) {
      this.messageRetour = "";
    },
    inputFile: function (val) {
      this.messageRetour = "";
    },
  },

  methods: {
    testRegex(laRegex, varATester, testFlag) {
      const valeurTest = laRegex.test(varATester);
      //testFlag = valeurTest;
      switch (testFlag) {
        case 1:
          this.testPseudo = valeurTest;
          break;
        case 2:
          this.testEmail = valeurTest;
          break;
        case 3:
          this.testPassword = valeurTest;
          break;
      }
      return valeurTest;
    },
    selectFile() {
      this.messageRetour = "";
      //console.log(this.$refs.file.files[0].name);
      this.inputFile = this.$refs.file.files[0];
      this.image = URL.createObjectURL(this.inputFile);
      //console.log(this.inputFile);
    },
    envoiInscription: function () {
      if (this.testPseudo && this.testPassword && this.testEmail) {
        //this.messageRetour = "";
        let formdata = new FormData();
        formdata.append("pseudo", this.inputPseudo);
        formdata.append("password", this.inputPassword);
        formdata.append("email", this.inputEmail);
        //console.log(formdata);
        if (this.inputFile) {
          formdata.append("image", this.inputFile, this.inputFile.name);
        }
        formdata.append("bio", "");
        formdata.append("admin", 0);
        formdata.append("active", 1);
        //console.log(formdata);
        axios
          .post(this.url, formdata)
          .then((response) => {
            this.postApiResponse = response.data;
            this.messageRetour = "inscription...";
            //console.log(this.postApiResponse);
            this.loading = true;
            this.$router.push("/connection"); //redirection vers /connection
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
              this.messageRetour = "une erreur est survenue";
            }
            //this.messageRetour = this.postApiResponse.error;
            //this.loading = false;
          });
      } else {
        this.messageRetour = "probleme!";
      }
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
  padding: 5px;
  /* border: solid 1px blue; */
  box-shadow: 0px 0px 5px 1px var(--primaryColor3);
}
.infoSignUp {
  margin: 20px auto 15px auto;
  font-style: italic;
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
.inputLabel {
  margin: 10px auto 5px auto;
}

.buttonValid {
  margin: 15px 0 10px 0;
  font-weight: bold;
}
</style>
