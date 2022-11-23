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
          v-bind:src="this.inputAvatar"
          :title="this.inputAvatar"
        />
        <p class="user-email">Email : {{ getApiResponse.email }}</p>

        <!-- <p class="user-bio">Bio : {{ getApiResponse.bio }}</p> -->
        <p class="user-time">
          Profil créé le : {{ format(getApiResponse.time) }}
        </p>

        <div class="profil-card-icons d-flex2c">
          <!-- <i
            class="fa-solid fa-pen-to-square modifyUser"
            title="modifier le profil"
            v-on:click="modifyUser"
          ></i> -->
          <p class="deleteProfil-text">Supprimer le profil :</p>
          <i
            class="fa-solid fa-trash-can deleteUser"
            title="supprimer le profil"
            v-on:click="deleteUser"
          ></i>
        </div>

        <div class="profil-modifier d-flex">
          <p>-- Modifier le profil --</p>

          <label for="userPseudo" title="au moins 5 lettres">Pseudo :</label>
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

          <label for="userAvatar" title="fichier jpg/webp/gif/png <3mo"
            >Avatar :</label
          >

          <!-- <p class="user-avatar">{{ inputAvatar }}</p> -->
          <input
            type="file"
            class="fileButton"
            id="file"
            ref="file"
            name="image"
            @change="selectFile()"
            accept=".jpg,.jpeg,.png,.gif,.webp"
          />

          <p id="avatarAlert" class="userAvatarAlert">
            <i class="fas fa-times-circle"></i>Avatar incorrect
          </p>
          <p id="avatarOk" class="userAvatarValid">
            <i class="fas fa-check-circle"></i>Avatar accepté
          </p>

          <button
            class="buttonValid envoiProfil"
            v-on:click.prevent="modifyUser"
          >
            Je valide !
          </button>
          <p>{{ messageRetour }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

//! ............................... SCRIPT ............................... //
<script>
// @ is an alias to /src
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
      url: "http://localhost:3000/api",
      thisUrl: "",
      getApiResponse: {},
      inputPseudo: "",
      inputBio: "",
      inputAvatar: "",
      messageRetour: "",
    };
  },
  created() {
    //console.log("hook created");
    this.showUser();
  },
  mounted() {
    //console.log("hook mounted");
  },
  methods: {
    format(maDate) {
      return dayjs(maDate).format("DD/MM/YYYY HH:mm");
      // console.log();
    },
    selectFile() {
      //console.log(this.$refs.file.files[0].name);
      this.inputFile = this.$refs.file.files[0];
      console.log("$refs.file", this.$refs.file);
      //console.log("file", this.inputFile);
      //this.inputAvatar = this.inputFile;
    },

    showUser() {
      //console.log("affiche");
      //this.thisUrl = `http://localhost:3000/api/users/${this.thisId}`;
      // axios.get(this.url).then((response) => (this.getApiResponse = response.data));
      //this.thisId = localStorage.getItem("userId");
      //console.log(this.thisId);
      //console.log(this.thisUrl);
      //console.log(this.url + `/users/` + this.thisId);
      axios
        .get(this.url + `/users/` + this.thisId)
        .then((response) => {
          // axios.get(this.thisUrl).then((response) => {
          // axios.get(`${this.url}/4`).then((response) => {
          this.getApiResponse = response.data[0];
          this.inputPseudo = this.getApiResponse.pseudo;
          this.inputBio = this.getApiResponse.bio;
          this.inputAvatar = this.getApiResponse.avatar;
          // this.$refs.file.value = "123456";
          //console.log(response);
          //console.log(this.getApiResponse);
          //console.log(this.getApiResponse);
          //console.log(this.inputPseudo, this.inputBio, this.inputFile);
          this.loading = true;
        })
        .catch((error) => {
          console.log(error);
          this.messageRetour = error.response.data.erreur;
          //console.log(error.response.data);
          //this.messageRetour = this.getApi.error;
          //this.loading = false;
        });
    },

    modifyUser: function () {
      // console.log("je modifie");
      this.thisUrl = `http://localhost:3000/api/users/${this.thisId}`;
      let formdata = new FormData();
      //console.log(this.inputPseudo);
      //console.log(this.inputPassword);
      //console.log(this.inputEmail);
      formdata.append("pseudo", this.inputPseudo);
      //console.log(formdata);
      if (this.inputFile) {
        console.log(this.inputFile);
        formdata.append("image", this.inputFile, this.inputFile.name);
        // } else {
        //   formdata.append(
        //     "image",
        //     "http://localhost:3000/images/default.jpg",
        //     "default.jpg"
        //   );
      }

      formdata.append("bio", this.inputBio);

      // console.log(formdata);
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
        .put(this.thisUrl, formdata)
        // .post(this.url, { pseudo: "user60", password: "mdp" })
        .then((response) => {
          this.postApiResponse = response.data;
          this.messageRetour = "profil modifié !";
          //console.log(this.postApiResponse);
          //console.log(this.postApiResponse.userId);
          //console.log(this.postApiResponse.token);
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
          //this.messageRetour = error.response.data.erreur;
          // console.log(error.response.data);
          //this.messageRetour = this.postApiResponse.error;
          //this.loading = false;
        });
    },
    deleteUser() {
      //console.log("j'efface");
      //console.log(this.thisId);
      let confirmDelete = prompt(
        "Utilisateur " +
          this.thisId +
          ", voulez vous vraiment supprimer votre profil définitivement?\nSi oui, tapez 'oui'\nCette action sera irréversible."
      );
      if (confirmDelete === "oui") {
        axios
          .delete(this.url + `/users/` + this.thisId)
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
  border: solid 1px cyan;
}
.avatar {
  width: 20%;
  max-width: 600px;
  min-width: 80px;
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
  border: solid 1px blue;
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
  border: solid 2px red;
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
