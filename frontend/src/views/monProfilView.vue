//! ............................... TEMPLATE ............................... //

<template>
  <div class="post container">
    <h1>Mon Profil</h1>
    <section class="monProfilContainer">
      <div class="profil-card">
        <p class="user-pseudo">{{ getApiResponse.pseudo }}</p>

        <img
          alt="avatar"
          class="avatar"
          v-bind:src="inputAvatar"
          :title="inputAvatar"
        />
        <p class="user-email" title="identifiant@gpm.fr (30 caractères max)">
          Email : {{ getApiResponse.email }}
        </p>
        <p class="user-time">
          Profil créé le : {{ format(getApiResponse.time) }}
        </p>

        <div class="profil-card-icons d-flex2c">
          <p class="deleteProfil-text">Supprimer le profil :</p>
          <i
            class="fa-solid fa-trash-can deleteUser"
            title="supprimer le profil"
            v-on:click="deleteUser"
          ></i>
        </div>

        <div class="profil-modifier d-flex">
          <p>-- Modifier le profil --</p>

          <label for="userPseudo" title="chiffres _ lettres (2à25)"
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
            required
          />
          <p
            id="pseudoOk"
            class="userPseudoOK"
            v-if="testRegex(/^\w{2,25}$/, this.inputPseudo, 1) === true"
          >
            <i class="fas fa-check-circle"></i>Pseudo accepté
          </p>
          <p v-else id="pseudoAlert" class="userPseudoAlert">
            <i class="fas fa-times-circle"></i>Pseudo incorrect
          </p>

          <label for="userBio" title="0-200 caractères)">Bio</label>
          <textarea
            v-model="inputBio"
            name="bio"
            id="bio"
            rows="3"
            cols="30"
            maxlength="120"
            class="centerTxt"
            wrap="soft"
          ></textarea>
          <p
            id="bioOk"
            class="userBioValid"
            v-if="testRegex(/^(.|\s){2,500}$/, this.inputBio, 2)"
          >
            <i class="fas fa-check-circle"></i>Bio acceptée
          </p>
          <p v-else id="bioAlert" class="userBioAlert">
            <i class="fas fa-times-circle"></i>Bio incorrecte
          </p>

          <label for="userAvatar" title="fichier jpg/webp/gif/png <3mo"
            >Avatar</label
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

          <button
            class="buttonValid envoiProfil"
            v-on:click.prevent="modifyUser"
          >
            Je valide !
          </button>
          <p class="messageRetour">{{ messageRetour }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

//! ............................... SCRIPT ............................... //
<script>
import axios from "axios";
import dayjs from "dayjs";

export default {
  name: "postsView",

  data() {
    return {
      info: null,
      loading: false,
      compteur: 0,
      text1: "texte de test",
      thisId: localStorage.getItem("userId"),
      //url: "http://localhost:3000/api",
      url: `${process.env.VUE_APP_URL_SERVEUR}/api`,
      thisUrl: "",
      getApiResponse: {},
      inputPseudo: "",
      testInputPseudo: false,
      inputBio: "",
      testInputBio: false,
      inputAvatar: "",
      messageRetour: "",
    };
  },
  created() {
    this.showUser();
  },
  mounted() {},
  watch: {
    inputPseudo: function (val) {
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
      switch (testFlag) {
        case 1:
          this.testInputPseudo = valeurTest;
          break;
        case 2:
          this.testInputBio = valeurTest;
          break;
      }
      // //console.log("valeurTest", valeurTest);
      // console.log("messageRetour", this.messageRetour);
      return valeurTest;
    },
    configAxios() {
      let jwtoken = localStorage.getItem("userToken");
      //console.log(jwtoken);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtoken}`,
        },
      };
      return config;
    },
    format(maDate) {
      return dayjs(maDate).format("DD/MM/YYYY HH:mm");
    },
    selectFile() {
      this.messageRetour = "";
      this.inputFile = this.$refs.file.files[0];
      //console.log(this.$refs.file.files[0].name);
      //console.log("$refs.file", this.$refs.file);
      this.inputAvatar = URL.createObjectURL(this.inputFile);
    },

    showUser() {
      axios
        .get(this.url + `/users/` + this.thisId, this.configAxios())
        .then((response) => {
          this.getApiResponse = response.data[0];
          this.inputPseudo = this.getApiResponse.pseudo;
          this.inputBio = this.getApiResponse.bio;
          this.inputAvatar = this.getApiResponse.avatar;
          this.loading = true;
        })
        .catch((error) => {
          console.log(error);
          this.messageRetour = error.response.data.erreur;
          //this.loading = false;
        });
    },

    modifyUser: function () {
      if (this.testInputPseudo && this.testInputBio) {
        this.messageRetour = "";
        // this.thisUrl = `http://localhost:3000/api/users/${this.thisId}`;
        this.thisUrl = `${this.url}/users/${this.thisId}`;
        let formdata = new FormData();
        formdata.append("pseudo", this.inputPseudo);
        //console.log(formdata);
        if (this.inputFile) {
          //console.log(this.inputFile);
          formdata.append("image", this.inputFile, this.inputFile.name);
        }

        formdata.append("bio", this.inputBio);
        axios
          .put(this.thisUrl, formdata, this.configAxios())
          // .post(this.url, { pseudo: "user60", password: "mdp" })
          .then((response) => {
            this.postApiResponse = response.data;
            this.messageRetour = "profil modifié !";
            //console.log(this.postApiResponse);
            this.loading = true;
            this.showUser();
          })
          .catch((error) => {
            console.log(error);
            console.log(error.response.status);
            if (error.response.status == 500) {
              this.messageRetour = "fichier trop gros (3Mo max)!";
            } else {
              this.messageRetour = "une erreur est survenue";
            }
            //this.loading = false;
          });
      } else {
        this.messageRetour = "champs mal remplis";
      }
    },

    deleteUser() {
      //console.log(this.thisId);
      this.messageRetour = "";
      let confirmDelete = prompt(
        "Utilisateur " +
          this.thisId +
          ", voulez vous vraiment supprimer votre profil définitivement?\nSi oui, tapez 'oui'\nCette action sera irréversible."
      );
      if (confirmDelete === "oui") {
        axios
          .delete(this.url + `/users/` + this.thisId, this.configAxios())
          .then((res) => {
            //console.log(res);
            localStorage.clear();
            this.$emit("connection", false); //fait remonter (app.vue) l'action connection avec parametre false
            alert("Votre profil a été définitivement supprimé");
            this.$router.push("/");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        //this.$router.push("/monProfil");
        this.showUser();
      }
    },
  },
};
</script>

//! ............................... STYLE ............................... //

<style scoped>
* {
  padding: 0.5% 1%;
}
.main {
  padding-bottom: 10px;
}

.post {
  padding: 5px;
  /* border: solid 1px cyan; */
}
.avatar {
  width: 20%;
  max-width: 600px;
  min-width: 80px;
  margin: 2px auto;
}
.profil-card-icons {
  margin: 8px;
  padding: 5px;
  color: red;
  /* font-size: 2vw; */
}
.profil-card-icons p {
  font-style: oblique;
  /* font-size: 2vw; */
  text-decoration: underline dotted red;
}

.userContainer {
  padding: 10px;
  border: solid 1px var(--primaryColor3);
}

.user {
  padding: 5px;
  border: solid 2px red;
}
.user-pseudo {
  font-weight: bold;
  text-transform: uppercase;
}
.user-time {
  font-style: italic;
}
.profil-modifier {
  padding: 5px;
  /* border: solid 2px red; */
  box-shadow: 0px 0px 5px 1px #ff0000;
  width: 90%;
  margin: 5px auto;
}
.fa-trash-can:hover {
  cursor: pointer;
  transform: scale(1.02);
}
.envoiProfil:hover {
  cursor: pointer;
  color: #3b46eb;
  color: var(--primaryColor3);
  /* transform: scale(1.02); */
}
.envoiProfil {
  padding: 1%;
  font-size: 2.7vw;
  width: 50%;
  margin: 1% auto;
}
@media all and (max-width: 400px) /* <300w*/ {
  .envoiProfil {
    padding: 1%;
    font-size: 5vw;
  }
}
@media all and (min-width: 1000px) /* >1000w*/ {
  .envoiProfil {
    padding: 1%;
    font-size: 2vw;
  }
}
</style>
