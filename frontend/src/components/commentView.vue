//! ............................... TEMPLATE ............................... //

<template>
  <div :class="`bloc-comments ${idFromPost}`">
    <div class="newComment d-flex">
      <label for="comment-write" title="1 à 256 caractères"></label>
      <textarea
        v-model="inputComment"
        rows="5"
        cols="1"
        maxlength="256"
        class="centerTxt input-text"
        name="inputText"
        id="inputText"
        placeholder="Écrivez ici votre commentaire"
        required
      ></textarea>
      <p
        id="commentOk"
        class="inputCommentValid"
        v-if="testRegex(/^.{1,256}$/, this.inputComment)"
      >
        Correct
      </p>
      <p v-else id="commentAlert" class="inputCommentAlert">
        Incorrect (1à256 caractères)
      </p>

      <i
        class="fa-solid fa-paper-plane envoiComment"
        title="envoyer!"
        v-on:click.prevent="envoiComment"
      ></i>
      <p class="messageRetour">{{ messageRetour }}</p>
    </div>

    <!-- ........💬 ici démarre la zone d'affichage des commentaires 💬....VFOR.... -->
    <!-- <div class="commentsList"> -->
    <div class="commentsList">
      <div
        v-for="comment in getApiResponse"
        :key="comment.idComments"
        class="commentsCard"
      >
        <!-- v-for="(comment, index) in getApiResponse" -->
        <div class="comment">
          <div class="d-flex2c commentOrigin">
            <p>Commenté par {{ comment.pseudo }}</p>
            <img
              alt="avatar"
              class="commentAvatar"
              v-bind:src="comment.avatar"
            />
            <p>
              le
              {{ format(comment.time) }}
            </p>
          </div>
          <p class="comment-text">{{ comment.contenu }}</p>
          <p class="comment-icon d-flex2c">
            <i
              class="fa-solid fa-pen-to-square modifyComment"
              title="modifier le commentaire"
              v-if="comment.id_Users == idConnected || idConnected == 45"
              v-on:click="modifyComment(comment.idComments, comment.contenu)"
            ></i>
            <i
              class="fa-solid fa-trash-can deletePost"
              title="supprimer le commentaire"
              v-if="comment.id_Users == idConnected || idConnected == 45"
              v-on:click="deleteComment(comment.idComments, comment.id_Posts)"
            ></i>
          </p>
          <!-- {{ idFromPost }} -->
          <!-- {{ comCount - index }}sur {{ comCount }} -->
        </div>
      </div>
    </div>
    <!-- ........💬 fin de zone d'affichage des commentaires 💬...&VFOR.... -->
  </div>
</template>

//! ............................... SCRIPT ............................... //

<script>
import axios from "axios";
import dayjs from "dayjs";

export default {
  name: "comment-view",
  props: {
    toggleCommentsView: Boolean,
    text: String,
    idFromPost: Number,
    comCountTab: Array,
  },
  data() {
    return {
      compteur: 0,
      idConnected: localStorage.getItem("userId"),
      inputText: "",
      getApiResponse: "",
      // url: `http://localhost:3000/api/comments`,
      url: `${process.env.VUE_APP_URL_SERVEUR}/api/comments`,
      inputComment: "",
      testInputComment: false,
      commentApiResponse: "",
      comCount: 0,
      hasCommentedThisPost: false,
      messageRetour: "",
    };
  },
  watch: {
    inputComment: function (val) {
      this.messageRetour = "";
    },
  },
  mounted() {
    this.getAllComments4OnePost();
  },

  methods: {
    testRegex(laRegex, varATester) {
      //const regex = new RegExp(laRegex);
      const valeurTest = laRegex.test(varATester);
      //console.log("valeurTest", valeurTest);
      this.testInputComment = valeurTest;
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

    //! on récupère tous les commentaires from backend
    getAllComments4OnePost: function () {
      axios
        .get(this.url + "/" + this.idFromPost, this.configAxios())
        .then((response) => {
          this.getApiResponse = response.data;
          this.comCount = response.data.length;
          //console.log(this.getApiResponse);
          for (let index = 0; index < this.getApiResponse.length; index++) {
            if (
              this.getApiResponse[index].idUsers ==
              localStorage.getItem("userId")
            ) {
              this.hasCommentedThisPost = true;
            }
          }
          this.$emit("combiendecomment", this.comCount);
          this.$emit("aCommente", this.hasCommentedThisPost);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //! on 🗑️ supprime un commentaire
    deleteComment(idComment, idPost) {
      //console.log(idComment);
      if (
        confirm(
          "Voulez vous vraiment supprimer ce commentaire " + idComment + " ?"
        )
      ) {
        axios
          .delete(this.url + "/" + idComment + "/" + idPost, this.configAxios())
          .then((res) => {
            //on met à jour la liste des idpost commentés par ce user
            let allCommentedPostTab = JSON.parse(
              localStorage.getItem("allCommentedPost")
            );
            const test = allCommentedPostTab.indexOf(this.idFromPost);
            if (test == -1) {
              //La fonction indexOf() renvoie l’index de la valeur donnée (sauf si absent: renvoie -1)
              console.log(
                "vous demander d'effacez un com pour le post " +
                  this.idFromPost +
                  " qui pourtant n'est pas dans la liste (allCommentedPostTab)"
              );
            } else {
              //si cet idpost etait stocké, on retire la 1ere occurence
              //(car on peut avoir commenté pls fois un post et donc avoir pls fois son idpost ds sa liste)
              allCommentedPostTab.splice(test, 1);
              localStorage.setItem(
                "allCommentedPost",
                JSON.stringify(allCommentedPostTab)
              );
              this.getAllComments4OnePost();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.getAllComments4OnePost();
      }
    },
    //! on ✍️ modifie un commentaire
    modifyComment(idComment, textComment) {
      //console.log(idComment);
      const modif = prompt("Modifiez votre commentaire:", textComment);
      // console.log("modif", modif);
      // console.log("test regexComment", this.testRegex(/^.{1,256}$/, modif));
      if (modif && this.testRegex(/^.{1,256}$/, modif)) {
        axios
          .put(
            this.url + "/" + idComment,
            { contenu: modif },
            this.configAxios()
          )
          .then((res) => {
            this.messageRetour = "Commentaire modifié";
            this.getAllComments4OnePost();
          })
          .catch((error) => {
            console.log(error.message);
            this.messageRetour = error.message;
          });
      } else {
        this.messageRetour = "champs mal rentrés";
        this.getAllComments4OnePost();
      }
    },

    //! Création d'un commentaire (envoi au backend)
    envoiComment: function () {
      if (this.testInputComment) {
        //mais d'abord on rajoute l'idpost du commentaire à la liste des post commentés par ce user
        let allCommentedPostTab = JSON.parse(
          localStorage.getItem("allCommentedPost")
        );
        const test = allCommentedPostTab.indexOf(this.idFromPost);
        allCommentedPostTab.push(this.idFromPost); //on push toujours, meme si cet idpost est déja stocké, car on veut autant d'idpost stocké que de com par ce user(important pour le delete)
        localStorage.setItem(
          "allCommentedPost",
          JSON.stringify(allCommentedPostTab)
        );
        //puis on envoi le commentaire au backend
        let bodyParameters = {
          contenu: this.inputComment,
          id_Posts: this.idFromPost,
          id_Users: this.idConnected,
        };
        //console.log(bodyParameters);
        axios
          .post(this.url, bodyParameters, this.configAxios())
          .then((response) => {
            this.postApiResponse = response.data;
            this.messageRetour = "Commentaire envoyé !";
            this.loading = true;
            //remettre les champs à zero
            this.inputComment = "";
            this.getAllComments4OnePost();
            //this.$router.push("/");
          })
          .catch((error) => {
            console.log(error);
            this.messageRetour = error.response.data.message;
            console.log(error.response.data.message);
            //this.loading = false;
          });
      } else {
        this.messageRetour = "champ mal rempli";
      }
    },
  },
};
</script>

//! ............................... STYLE ............................... //
<style scoped>
.fa-solid {
  cursor: pointer;
  /* color: #3b46eb; */
  margin: 1vw 3vw;
}
.envoiComment {
  /* padding: 1vw 1vw 1.2vw 1vw; */
  transform: scale(1.02);
  color: #3b46eb;
  color: var(--primaryColor3);
}
.newComment {
  background-color: #fbeded;
  border-radius: 8px;
  margin: 15px;
  padding: 2px;
}
.bloc-comments {
  width: 96%;
  margin: 2px auto;
}
.comment {
  /* border: solid 1px blue; */
  margin-bottom: 1vw;
  border-radius: 4px;
  box-shadow: 0px 0px 5px 1px rgb(255, 129, 129);
}
.commentOrigin {
  margin: 5px 0;
}
.comment-text {
  width: 90%;
  margin: 10px auto;
}
.commentAvatar {
  width: 2%;
  max-width: 100px;
  min-width: 20px;
  object-fit: contain;
  margin-left: 5px;
  margin-right: 20px;
}
</style>
