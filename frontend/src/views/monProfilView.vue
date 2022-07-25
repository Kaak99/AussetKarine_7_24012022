//! ............................... TEMPLATE ............................... //

<template>
  <div class="post container">
    <h1>Mon Profil</h1>
    <section class="monProfilContainer">
      <div class="profil-card">
        <p class="user-pseudo">{{ getApiResponse.pseudo }}</p>

        <img alt="avatar" class="avatar" v-bind:src="getApiResponse.avatar" />
        <p class="user-email">Adresse email : {{ getApiResponse.email }}</p>

        <p class="user-bio">Bio : {{ getApiResponse.bio }}</p>
        <p class="user-time">Profil créé le : {{ getApiResponse.time }}</p>

        <div class="profil-card-icons d-flex2s">
          <i
            class="fa-solid fa-pen-to-square modifyUser"
            title="modifier le profil"
            v-on:click="modifyUser"
          ></i>
          <i
            class="fa-solid fa-trash-can deleteUser"
            title="supprimer le profil"
            v-on:click="deleteUser"
          ></i>
        </div>
        <div class="editProfil-card">
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

          <i
            class="fa-solid fa-paper-plane envoiPost"
            title="envoyer le message"
            v-on:click.prevent="envoiPost"
          ></i>
        </div>
      </div>
    </section>
  </div>
</template>

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
      thisId: localStorage.getItem("userId"),
      url: "http://localhost:3000/api",
      urlGod: "http://localhost:3000/api/users/4",
      thisUrl: "",
      getApiResponse: {},
    };
  },
  methods: {
    showUser() {
      console.log("affiche");
      this.thisUrl = `http://localhost:3000/api/users/${this.thisId}`;
      // axios.get(this.url).then((response) => (this.getApiResponse = response.data));
      //this.thisId = localStorage.getItem("userId");
      console.log(this.thisId);
      console.log(this.thisUrl);
      console.log(this.url + `/users/` + this.thisId);
      axios.get(this.url + `/users/` + this.thisId).then((response) => {
        // axios.get(this.thisUrl).then((response) => {
        // axios.get(`${this.url}/4`).then((response) => {
        this.getApiResponse = response.data[0];
        //console.log(response);
        console.log(this.getApiResponse);
        console.log(this.getApiResponse.pseudo);
        this.loading = true;
      });
    },
    modifyUser() {
      console.log("je modifie");
    },
    deleteUser() {
      console.log("j'efface");
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
            console.log(res);
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
  created() {
    this.showUser();
  },
};
</script>

//! ............................... STYLE ............................... //

<style scoped>
.main {
  padding-bottom: 10px;
}

.post {
  padding: 5px;
  border: solid 1px cyan;
}
.avatar {
  width: 50%;
  max-width: 600px;
  min-width: 80px;
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
.user-pseudo {
  font-weight: bold;
  text-transform: uppercase;
}
.user-time {
  font-style: italic;
}
</style>
