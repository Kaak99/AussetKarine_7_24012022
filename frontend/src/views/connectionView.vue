//! ............................... TEMPLATE ............................... //

<template>
  <div class="containAll">
    <div class="users container" v-if="loading === true">
      <form class="formLogin">
        <h1>Connection</h1>
        <p class="centerTxt">
          Veuillez rentrer votre pseudo et votre mot de passe
        </p>
        <div class="userContainer d-flex">
          <!--ici démarre la zone de création de posts-->
          <!-- <div class="usersCard">
          <div class="user">
            <p class="user-pseudo">pseudo</p>
            <p class="user-bio">presentation</p>
          </div>
         </div> -->
          <label for="userPseudo" title="au moins 5 lettres"></label>
          <input
            v-model="pseudo"
            type="text"
            size="10"
            maxlength="20"
            class="centerTxt inputTxt"
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

          <label for="userPassword" title="au moins 6 caractères"></label>
          <input
            v-model="mdp"
            type="password"
            size="10"
            maxlength="16"
            class="centerTxt inputTxt"
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
  name: "connectionView",
  data() {
    return {
      compteur: 0,
      loading: true,
      url: "http://localhost:3000/api/users/login",
      urlallLikes: "http://localhost:3000/api/users/allLikes",
      urlallComments: "http://localhost:3000/api/users/allComments",
      postApiResponse: "",
      getApiResponseAllLikes: "",
      getApiResponseAllComments: "",
      allLikeUserTab: [],
      allCommentUserTab: [],
      messageRetour: "",
      pseudo: "",
      mdp: "",
      userId: "",
    };
  },
  // emits: ["update:isConnected"],
  watch: {
    pseudo: function (val) {
      console.log("watch", val);
      this.messageRetour = "";
    },
    mdp: function (val) {
      console.log("watch", val);
      this.messageRetour = "";
    },
  },
  methods: {
    async envoi() {
      await axios
        .post(this.url, { pseudo: this.pseudo, password: this.mdp })
        // .post(this.url, { pseudo: "user60", password: "mdp" })
        .then(async (response) => {
          this.postApiResponse = response.data;
          this.userId = this.postApiResponse.userId;
          this.messageRetour = "Connexion";
          //console.log(this.postApiResponse);
          //console.log(this.postApiResponse.userId);
          //console.log(this.postApiResponse.token);
          //console.log(this.postApiResponse.admin);
          this.loading = true;
          localStorage.setItem("userId", this.postApiResponse.userId);
          localStorage.setItem("userToken", this.postApiResponse.token);
          localStorage.setItem("admin", this.postApiResponse.admin);
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

          //on stocke dans le storage un tableau avec tous les idpost likés par cet userId
          await axios
            .get(this.urlallLikes + "/" + this.userId)
            .then((response) => {
              this.getApiResponseAllLikes = response.data;
              // console.log("likes", this.getApiResponseAllLikes);
              for (
                let index = 0;
                index < this.getApiResponseAllLikes.length;
                index++
              ) {
                // console.log(index);
                // console.log(this.getApiResponseAllLikes[index].id_Posts);
                this.allLikeUserTab.push(
                  this.getApiResponseAllLikes[index].id_Posts
                );
              }
              // console.log("allLikeUserTab",this.allLikeUserTab);
              localStorage.setItem(
                "allLikedPost",
                JSON.stringify(this.allLikeUserTab)
              );
            })
            .catch((error) => {
              console.log(error);
            });

          //on stocke dans le storage un tableau avec tous les idpost commentés par cet userId
          await axios
            .get(this.urlallComments + "/" + this.userId)
            .then((response) => {
              this.getApiResponseAllComments = response.data;
              // console.log("likes", this.getApiResponseAllLikes);
              for (
                let index = 0;
                index < this.getApiResponseAllComments.length;
                index++
              ) {
                // console.log(index);
                // console.log(this.getApiResponseAllLikes[index].id_Posts);
                this.allCommentUserTab.push(
                  this.getApiResponseAllComments[index].id_Posts
                );
              }
              // console.log("allLikeUserTab",this.allLikeUserTab);
              localStorage.setItem(
                "allCommentedPost",
                JSON.stringify(this.allCommentUserTab)
              );
            })
            .catch((error) => {
              console.log(error);
            });

          this.$router.push("/posts"); //redirection vers /home
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
<style></style>

<style scoped>
* {
  padding: 4px 4px;
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
.inputTxt {
  margin: 10px auto;
  padding: 5px;
  width: 75%;
}
.buttonValid {
  margin: 10px auto;
  padding: 5px;
  width: 50%;
}
@media all and (max-width: 400px) /* <300w*/ {
  .inputTxt,
  .buttonValid {
    margin: 6px auto;
    padding: 3px;
    width: 100%;
  }
}
@media all and (min-width: 1000px) /* >1000w*/ {
  .inputTxt {
    margin: 10px auto;
    padding: 5px;
    width: 50%;
  }
  .buttonValid {
    margin: 10px auto;
    padding: 5px;
    width: 30%;
  }
}
</style>
