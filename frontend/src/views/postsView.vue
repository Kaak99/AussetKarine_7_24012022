//! ............................... TEMPLATE ............................... //

<template>
  <div>
    <div class="posts container" v-if="loading === true">
      <h1 class="centerTxt">Tous les messages</h1>
      <div class="postContainer d-flex">
        <!-- ............✍️ ici démarre la zone d'input "new post" ✍️.............. -->
        <div class="writeBox">
          <div class="inputContainer d-flex">
            <label for="post-title" title="2 à 50 caractères">Titre :</label>
            <input
              v-model="inputTitle"
              type="text"
              size="50"
              maxlength="50"
              class="centerTxt input-title"
              name="inputTitle"
              id="inputTitle"
              placeholder="2 à 50 caractères"
              required
            />
            <p
              id="titleOk"
              class="titleValid"
              v-if="testRegex(/^.{2,50}$/, this.inputTitle, 1)"
            >
              <i class="fas fa-check-circle"></i>Correct
            </p>
            <p v-else id="titleAlert" class="titleAlert">
              <i class="fas fa-times-circle"></i>Incorrect (2 à 50 caractères)
            </p>

            <label for="post-write" title="2 à 500 caractères">Contenu :</label>
            <textarea
              v-model="inputText"
              rows="4"
              cols="1"
              maxlength="500"
              class="centerTxt input-text"
              name="inputText"
              id="inputText"
              placeholder="2 à 500 caractères"
              wrap="soft"
            ></textarea>
            <p
              id="inputTextOk"
              class="inputTextValid"
              v-if="testRegex(/^(.|\s){2,500}$/, this.inputText, 2)"
            >
              <i class="fas fa-check-circle"></i>Correct
            </p>
            <p v-else id="inputTextAlert" class="inputTextAlert">
              <i class="fas fa-times-circle"></i>Incorrect (2 à 500 caractères)
            </p>

            <label for="post-image" title="fichier jpg/webp/gif/png <3mo"
              >Image :</label
            >
            <div class="input-button d-flex">
              <input
                type="file"
                class="fileButton"
                id="file"
                ref="file"
                @change="selectFile()"
                accept=".jpg,.jpeg,.png,.gif,.webp"
              />

              <i
                class="fa-solid fa-paper-plane envoiPost"
                title="envoyer le message"
                v-on:click.prevent="envoiPost"
              ></i>
              <p class="messageRetour">{{ messageRetour }}</p>
            </div>
          </div>
        </div>
        <!-- {{ idConnected }}{{ isAdmin }}{{ typeof idConnected }} -->

        <!-- ................📋 modale (modify post)📋................ -->
        <modal-post
          v-bind:revele="revele"
          v-bind:toggleModale="toggleModale"
          v-bind:idPosttoModify="idPosttoModify"
          modalString="Welcome here"
          @retourModalPost="refreshAll()"
        ></modal-post>
        <!-- ..............📋 fin modale (modify post)📋.............. -->

        <!-- ..............📩 ici démarre la zone d'affichage des posts 📩...... -->

        <!-- ....... ➰VFOR➰ .......... -->
        <div
          v-for="post in getApiResponse"
          :key="post.idPosts"
          :id="post.idPosts"
          class="postsCard"
        >
          <div class="post">
            <div class="d-flex2c postOrigin">
              <p>Par {{ post.pseudo }}</p>
              <img alt="avatar" class="postAvatar" v-bind:src="post.avatar" />
              <p>
                le
                {{ format(post.time) }}
              </p>
            </div>
            <p class="post-title">{{ post.titre }}</p>
            <div class="post-image">
              <img
                class="postImage"
                alt="image d'illustration "
                v-bind:src="post.image"
                v-if="post.image"
              />
            </div>

            <p class="post-text">{{ post.contenu }}</p>

            <div class="post-icon d-flex2c">
              <div class="commentContainer">
                <i
                  class="fa-solid fa-comment addComment"
                  title="Commentaires"
                  :style="[checkComment(post.idPosts) && { color: 'blue' }]"
                  v-on:click="showCommentsFunction(post.idPosts)"
                ></i>
                <p class="commentNumber" title="nombre de commentaires">
                  {{ post.nombreComment }}
                </p>
              </div>

              <div class="likeContainer">
                <i
                  class="fa-solid fa-heart like"
                  title="liker le message"
                  :style="[checkLike(post.idPosts) && { color: 'blue' }]"
                  v-on:click="likeNolike(post.idPosts)"
                ></i>
                <p class="likeNumber" title="nombre de likes">
                  {{ post.nombreLike }}
                </p>
              </div>
              <i
                class="fa-solid fa-pen-to-square modifyPostIcon"
                title="modifier le message"
                v-if="post.id_Users == idConnected || isAdmin === true"
                v-on:click="modifyPost(post.idPosts)"
              ></i>
              <i
                class="fa-solid fa-trash-can deletePostIcon"
                title="supprimer le message"
                v-if="post.id_Users == idConnected || isAdmin === true"
                v-on:click="deletePost(post.idPosts)"
              ></i>
            </div>

            <!-- ........💬 ici démarre la zone d'affichage des commentaires 💬........ -->

            <!-- {{ post.idPosts }}:{{ post.nombreComment }}/{{ post.nombreLike }} -->

            <comment-view
              v-show="commentShowTab.indexOf(post.idPosts) !== -1"
              text="props!"
              :idFromPost="post.idPosts"
              @combiendecomment="refreshAll()"
            ></comment-view>
            <!-- on aurait pu utiliser 
              :style="[true && { display: 'none' }]" à la place de vshow -->

            <!-- ........💬 fin de la zone d'affichage des commentaires 💬........ -->
          </div>
        </div>
        <!-- ....... ➰fin du VFOR➰ .......... -->
      </div>
    </div>

    <!-- ........🔌 ici la zone d'erreur réseau / serveur 🔌........ -->
    <div class="noLoading" v-else>
      <!-- <div class="noLoading" v-if="loading === false"> -->
      <p class="problemeServeur centerTxt">Un problème est survenu.</p>
      <p class="problemeServeur centerTxt">
        Il semble que le serveur soit indisponible.
      </p>
      {{ url }}
      <p class="problemeServeur centerTxt">
        Ou bien qu'il y ait un problème sur votre connexion internet
      </p>
    </div>
  </div>
</template>

//! ............................... SCRIPT ............................... //

<script>
import axios from "axios";
import modalPost from "@/components/modalPost.vue";
import commentView from "@/components/commentView.vue";
import dayjs from "dayjs";

export default {
  name: "postsView",
  components: {
    "comment-view": commentView,
    "modal-post": modalPost,
  },

  data() {
    return {
      info: null,
      loading: false,
      compteur: 0,
      text1: "texte de test",
      // url: "http://localhost:3000/api/posts",
      url: `${process.env.VUE_APP_URL_SERVEUR}/api/posts`,
      // urlLikes: "http://localhost:3000/api/likes",
      urlLikes: `${process.env.VUE_APP_URL_SERVEUR}/api/likes`,
      // urlLikesCount: "http://localhost:3000/api/likes/count",
      urlLikesCount: `${process.env.VUE_APP_URL_SERVEUR}/api/likes/count`,
      getApiResponse: "", //reponse du getAllPost
      postApiResponse: "", //ce qu'on envoi au back(new post)
      getLikeResponse: "", //recup like
      getCountLikeResponse: "", //recup nombrelike
      messageRetour: "",
      inputTitle: "",
      testInputTitle: false,
      inputText: "",
      testInputText: false,
      inputFile: "",
      timeDayjs: [],
      idConnected: JSON.parse(localStorage.getItem("userId")),
      isAdmin: localStorage.getItem("admin") == 1 ? true : false,
      showCommentsBoolean: false,
      commentShowTab: [],
      allLikedPostTab: JSON.parse(localStorage.getItem("allLikedPost")),
      allCommentedPostTab: JSON.parse(localStorage.getItem("allCommentedPost")),
      likeOnTab: [],
      likeCount: 0,
      revele: false,
      idPosttoModify: 0,
    };
  },
  watch: {
    inputTitle: function (val) {
      //console.log("watch", val);
      this.messageRetour = "";
    },
    inputText: function (val) {
      this.messageRetour = "";
    },
    inputFile: function (val) {
      this.messageRetour = "";
    },
  },
  // created() {},
  mounted() {
    // axios.get(this.url).then((response) => (this.getApiResponse = response.data));
    this.getAllPost(true); //recupere tout (likes aussi)
  },

  computed: {},

  methods: {
    testRegex(laRegex, varATester, testFlag) {
      const valeurTest = laRegex.test(varATester);
      switch (testFlag) {
        case 1:
          this.testInputTitle = valeurTest;
          break;
        case 2:
          this.testInputText = valeurTest;
          break;
      }
      return valeurTest;
    },

    configAxios() {
      //pour creer les headers avant envoi requete
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
    refreshAll() {
      this.getAllPost();
      this.allCommentedPostTab = JSON.parse(
        localStorage.getItem("allCommentedPost")
      );
      this.idPosttoModify = 0; //on réinitialise pour forcer le watch si on click 2 fois de suite sur meme post pour modifier
    },

    format(maDate) {
      return dayjs(maDate).format("DD/MM/YYYY HH:mm");
    },
    selectFile() {
      //console.log(this.$refs.file.files[0].name);
      this.inputFile = this.$refs.file.files[0];
      //console.log(this.inputFile);
    },
    // selectFile: function (e) {
    //   this.inputFile = e.target.files[0];
    //   console.log(this.inputFile);
    // },

    checkLike(idpost) {
      //regarde si user connecté a liké ce post, pour colorer le coeur en bleu ou non
      let test = 0;
      let booleanResponse = false;
      if (this.allLikedPostTab) {
        test = this.allLikedPostTab.indexOf(idpost);
        if (test == -1) {
          //si idpost pas trouvé dans la liste des idpost likés
          booleanResponse = false; //like restera noir
        } else {
          booleanResponse = true; //sinon sera bleu
        }
        return booleanResponse;
      }
    },
    checkComment(idpost) {
      //regarde si user connecté a commenté ce post, pour colorer le com en bleu ou non
      let test = 0;
      let booleanResponse = false;
      if (this.allCommentedPostTab) {
        test = this.allCommentedPostTab.indexOf(idpost);
        if (test == -1) {
          //si idpost pas trouvé dans la liste des idpost commentés
          booleanResponse = false; //comment restera noir
        } else {
          booleanResponse = true; //sinon sera bleu
        }
        return booleanResponse;
      }
    },

    showCommentsFunction(idpost) {
      //Fonction qui ne fait que OUVRIR/FERMER la liste des commentaires pour x posts
      //this.getAllPost(); //pour maj du nbre com
      //on va stocker dans tableau commentShowTab les idpost ou user a cliqué sur bulle pour dérouler les commentaires
      //mais si bulle recliquée, il faut virer cet idpost (puisque utilisateur referme=ne déroule plus la liste des com de ce post quand reclic
      //donc dans le else, on retire les idpost qui sont reclickés
      const test = this.commentShowTab.indexOf(idpost);
      //console.log(this.commentShowTab.indexOf(idpost));
      if (test == -1) {
        //pas de valeur retournée=cet idPost n'est pas stocké
        //alors on l'ajoute au tableau
        this.commentShowTab.push(idpost);
        //console.log("ifmoins1");
        //console.log(this.commentShowTab.indexOf(idpost));
      } else {
        //si cet idpost etait stocké, on le retire
        //(code=on ne garde que les elements qui ne sont pas idPost)
        this.commentShowTab = this.commentShowTab.filter(
          (element) => element !== idpost
        );
      }
    },

    //! on like (ou retire le like)
    likeNolike(idPosts) {
      // console.log(idPosts);
      //si n'existe pas dans tableau allLikedPostTab (post likés par ce user), on le push, sinon on vire
      if (this.allLikedPostTab) {
        const test = this.allLikedPostTab.indexOf(idPosts);
        let likeValueToSend;
        if (test == -1) {
          //pas de valeur retournée=cet idPost n'est pas stocké
          //alors on l'ajoute au tableau et on enverra 1 au backend
          this.allLikedPostTab.push(idPosts);
          likeValueToSend = 1; //quand a liké
        } else {
          //si cet idpost etait stocké, on le retire
          //(on ne garde que les elements qui ne sont pas idPost)
          //et on enverra 0 au backend
          this.allLikedPostTab = this.allLikedPostTab.filter(
            (element) => element !== idPosts
          );
          likeValueToSend = 0; //quand a retiré le like
        }
        localStorage.setItem(
          "allLikedPost",
          JSON.stringify(this.allLikedPostTab)
        );
        //maintenant on envoi au back
        let newLike = {
          like: likeValueToSend, //sera forcément 0(retire le like) ou 1(ajoute le like)
          id_Posts: idPosts,
          id_Users: this.idConnected,
        };
        // console.log("newLike", newLike);
        axios
          .post(this.urlLikes, newLike, this.configAxios())

          .then((response) => {
            this.postApiResponse = response.data;
            this.loading = true;
            // console.log("j'ai liké !");
            this.getAllPost();
            //this.$router.push("/");
          })
          .catch((error) => {
            console.log(error);
            this.messageRetour = error.response.data.erreur;
            //console.log(error.response.data);
            //this.loading = false;
          });
      }
    },

    //! on montre les commentaires
    showComments(idPosts) {
      this.showCommentsBoolean = !this.showCommentsBoolean;
      //console.log(this.showCommentsBoolean);
    },

    //! on 🗑️ supprime un post
    deletePost(idPosts) {
      //console.log(idPosts);
      if (
        confirm("Voulez vous vraiment supprimer le message " + idPosts + " ?")
      ) {
        let jwtoken = localStorage.getItem("userToken");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtoken}`,
          },
        };
        axios
          .delete(this.url + "/" + idPosts, this.configAxios())
          .then((res) => {
            //console.log(res);
            //alert("Votre message " + idPosts + " a bien été supprimé");
            this.getAllPost();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.getAllPost();
      }
    },

    //fait apparaitre/disparaitre la modale(modify post) onclick
    toggleModale: function () {
      this.revele = !this.revele;
      !this.revele ? (this.idPosttoModify = 0) : null;
    },
    // //! on ✍️ modifie un post
    modifyPost(idPosts) {
      this.idPosttoModify = idPosts;
      this.toggleModale();
    },

    //! on 📦 récupère tous les posts from backend
    getAllPost(premierChargement = false) {
      axios
        .get(this.url, this.configAxios())
        .then((response) => {
          this.getApiResponse = response.data;
          // console.log("getApiResponse", this.getApiResponse);
          this.timeDayjs = dayjs(this.getApiResponse.time).format(
            "DD/MM/YYYY HH:mm"
          );
          //console.log(this.timeDayjs);
          this.loading = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //! on ✉️ envoie un post au backend
    envoiPost: function () {
      if (this.testInputTitle && this.testInputText) {
        const formdata = new FormData();
        formdata.append("titre", this.inputTitle);
        formdata.append("contenu", this.inputText);
        if (this.inputFile) {
          formdata.append("image", this.inputFile, this.inputFile.name);
        }
        formdata.append("id_Users", this.idConnected);
        //console.log(formdata);
        //const config = null;

        axios
          .post(this.url, formdata, this.configAxios())
          .then((response) => {
            this.postApiResponse = response.data;
            this.messageRetour = "Message envoyé !";
            // console.log(this.postApiResponse.userId);
            // console.log(this.postApiResponse.token);
            this.loading = true;
            //remettre les champs à zero
            this.inputTitle = "";
            this.inputText = "";
            this.$refs.file.value = "";
            this.getAllPost();
            //this.$router.push("/");
          })
          .catch((error) => {
            this.messageRetour = error.response.data.erreur;
            // console.log("error.response.status", error.response.status);
            // console.log(
            //   "error.response.data.erreur",
            //   error.response.data.erreur
            // );
            if (error.response.status == 500) {
              this.messageRetour = "fichier trop gros (3Mo max)!";
            } else if (error.response.status == 400) {
              this.messageRetour = "titre&contenu à remplir)";
            } else {
              this.messageRetour = "une erreur est survenue";
            }
          });
      } else {
        this.messageRetour = "champs mal remplis";
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
.inputContainer {
  background-color: #fbeded;
  /* box-shadow: 1px 1px 2px 1px rgb(250, 102, 102); */
  border-radius: 10px;
  width: 100%;
}
.writeBox {
  padding: 5%;
  /*border: solid 1px blue;*/
  box-shadow: 0px 0px 10px 1px #ff0000;
  margin-bottom: 10px;
  background-color: #ffd7d7;
}
.input-button {
  align-items: center;
  flex-wrap: wrap;
}
.fileButton {
  /*display: none;*/
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  color: var(--primaryColor3);
}

.postContainer {
  padding: 10px;
}

.post-icon {
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 1.6vw;
}
.post {
  margin: 1.4vw 0;
  box-shadow: 0px 0px 5px 1px #ff0000;
}
.postOrigin {
  margin: 5px 0;
}

.post-title {
  background-color: #ffd7d7;
  font-weight: bold;
  text-decoration: underline;
  margin: 12px 0;
}
.post-text {
  width: 90%;
  margin: 10px auto;
  white-space: pre-wrap;
}

.fa-solid {
  cursor: pointer;
  margin: 5px;
}
.fa-solid:hover {
  /*box-shadow: 10px 5px 5px black;*/
  transform: scale(1.02);
  /* filter: brightness(1.5); */
}
.modifyPostIcon,
.deletePostIcon {
  color: #d11421;
}
.postImage {
  width: 90%;
  max-width: 800px;
  min-width: 80px;
  max-height: 1000px;
  object-fit: contain;
}
.postAvatar {
  width: 5%;
  max-width: 100px;
  min-width: 20px;
  object-fit: contain;
  margin-left: 5px;
  margin-right: 20px;
}
.likeContainer,
.commentContainer {
  position: relative;
}
.likeNumber,
.commentNumber {
  left: 24px;
  top: 14px;
  cursor: default;
}

.blue {
  color: #3b46eb;
  color: var(--primaryColor3);
}
.envoiPost:hover {
  color: #3b46eb;
  color: var(--primaryColor3);
  /* transform: scale(1.02); */
}
.envoiPost {
  padding: 1%;
  font-size: 3.5vw;
}
@media all and (max-width: 400px) /* <300w*/ {
  .envoiPost {
    padding: 1%;
    font-size: 6vw;
  }
}
@media all and (min-width: 1000px) /* >1000w*/ {
  .envoiPost {
    padding: 1%;
    font-size: 2vw;
  }
}
</style>
