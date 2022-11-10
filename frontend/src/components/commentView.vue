//! ............................... TEMPLATE ............................... //

<template>
  <!-- <div class="container">  </div> -->
  <!-- notre bloc-comments aura aussi comme identifiant de classe l'id du post qui l'a appelé(idFromPost) -->
  <div :class="`bloc-comments ${idFromPost}`">
    <div class="newComment d-flex">
      <label for="comment-write" title="maximum 500 caractères"></label>
      <textarea
        v-model="inputComment"
        rows="4"
        cols="1"
        maxlength="500"
        class="centerTxt input-text"
        name="inputText"
        id="inputText"
        placeholder="Écrivez ici votre commentaire"
        required
      ></textarea>
      <i
        class="fa-solid fa-paper-plane envoiComment"
        title="envoyer!"
        v-on:click.prevent="envoiComment"
      ></i>
    </div>

    <!-- ........💬 ici démarre la zone d'affichage des commentaires 💬....VFOR.... -->
    <!-- <div class="commentsList"> -->
    <div class="commentsList">
      <div
        v-for="(comment, index) in getApiResponse"
        :key="comment.idComments"
        class="commentsCard"
      >
        <div class="comment">
          <!-- <router-link to="/posts">Posts</router-link> -->
          <!-- <p>Ecrit par {{ post.id_Users }} le {{ post.time }}</p> -->
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
          {{ idFromPost }}

          {{ comCount - index }}sur {{ comCount }}

          <!-- {{ localStorage.getItem("postId2comment") }} -->
        </div>
      </div>
    </div>
    <!-- {{ text }} -->
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
      url: `http://localhost:3000/api/comments`,
      inputComment: "",
      commentApiResponse: "",
      comCount: 0,
      hasCommentedThisPost: false,
    };
  },
  //created() {
  mounted() {
    // axios.get(this.url).then((response) => (this.commentApiResponse = response.data));
    this.getAllComments4OnePost();
  },
  // updated() {
  //   // axios.get(this.url).then((response) => (this.commentApiResponse = response.data));
  //   this.getAllComments4OnePost();
  // },
  // beforeUpdate() {
  //   // axios.get(this.url).then((response) => (this.commentApiResponse = response.data));
  //   this.getAllComments4OnePost();
  // },
  methods: {
    format(maDate) {
      return dayjs(maDate).format("DD/MM/YYYY HH:mm");
      // console.log();
    },

    //! on récupère tous les commentaires from backend
    getAllComments4OnePost: function () {
      //console.log(this.commentApiResponse);
      //console.log(this.getApiResponse);
      //console.log("recup Commentaires");
      axios
        .get(this.url + "/" + this.idFromPost)
        .then((response) => {
          this.getApiResponse = response.data;
          //car renvoi un objet data qui contient les differentes clés/valeur (cf postman)
          this.comCount = response.data.length;
          //console.log(this.getApiResponse);
          //console.log("test", this.comCount);
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
          .delete(this.url + "/" + idComment + "/" + idPost)
          .then((res) => {
            //console.log(res);
            //alert("Votre message " + idComment + " a bien été supprimé");
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
              // allCommentedPostTab = allCommentedPostTab.filter(
              //   (element) => element !== this.idFromPost
              // );//non car retire touets les occurences
              //on remet dans le localstorage la liste actualisée des post commentés par ce userId
              localStorage.setItem(
                "allCommentedPost",
                JSON.stringify(allCommentedPostTab)
              );
              //puis on "refresh"
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
      //console.log("hello");
      let modif = prompt("Modifiez votre commentaire:", textComment);
      if (modif) {
        axios
          .put(this.url + "/" + idComment, { contenu: modif })
          .then((res) => {
            //console.log(res);
            //alert("Votre message " + idPosts + " a bien été supprimé");
            this.getAllComments4OnePost();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.getAllComments4OnePost();
      }
    },

    //! Création d'un commentaire (envoi au backend)
    envoiComment: function () {
      //mais d'abord on rajoute l'idpost du commentaire à la liste des post commentés par ce user et
      let allCommentedPostTab = JSON.parse(
        localStorage.getItem("allCommentedPost")
      );
      const test = allCommentedPostTab.indexOf(this.idFromPost);
      // if (test == -1) {
      //   //pas de valeur retournée=cet idPost n'est pas stocké
      //   //alors on l'ajoute au tableau (s'il y etait déjà, rien à afire par contre)
      //   allCommentedPostTab.push(this.idFromPost);
      // }
      allCommentedPostTab.push(this.idFromPost); //on push toujours (si deja un com pour ce post, pas grave, on met autant d'idPost commenté qu'il y a de com de ce user)

      //on remet dans le localstorage la liste actualisée des post commentés par ce userId
      localStorage.setItem(
        "allCommentedPost",
        JSON.stringify(allCommentedPostTab)
      );
      //puis on envoi le commentaire au backend (plutot envoyer d'abord et si reussi mettre à jour localstorage?)
      const config = null;
      // let id_Posts = "";
      // let id_Users = "";
      //console.log(this.inputComment);
      //console.log(this.idFromPost);
      //console.log(this.idConnected);
      let bodyParameters = {
        contenu: this.inputComment,
        id_Posts: this.idFromPost,
        id_Users: this.idConnected,
      };
      //console.log(bodyParameters);
      axios
        // .post(this.url, {
        //   contenu: this.inputComment,
        //   id_Posts: this.idFromPost,
        //   id_Users: this.idConnected,
        // })
        .post(
          this.url,
          bodyParameters,
          config
          // { headers: { Authorization: "Bearer " + token } }
          // { headers: { Authorization: `Bearer ${token}` } }
        )
        // .post(this.url, { pseudo: "user60", password: "mdp" })
        .then((response) => {
          this.postApiResponse = response.data;
          this.messageRetour = "Commentaire envoyé !";
          // console.log(this.postApiResponse);
          // console.log(this.postApiResponse.userId);
          // console.log(this.postApiResponse.token);
          this.loading = true;
          //remettre els champs à zero
          this.inputComment = "";
          this.getAllComments4OnePost();
          //this.$router.push("/");
        })
        .catch((error) => {
          console.log(error);
          this.messageRetour = error.response.data.erreur;
          console.log(error.response.data);
          //this.messageRetour = this.getApi.error;
          //this.loading = false;
        });
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
  padding: 1vw 1vw 1.2vw 1vw;
  color: #3b46eb;
}
.bloc-comments {
  width: 96%;
  margin: 2px auto;
}
.comment {
  border: solid 1px green;
  margin-bottom: 1vw;
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
