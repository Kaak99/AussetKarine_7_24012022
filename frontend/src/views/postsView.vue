//! ............................... TEMPLATE ............................... //

<template>
  <div>
    <div class="posts container" v-if="loading === true">
      <h1>Voici la liste de tous les messages</h1>
      <h2 class="centerTxt">Tous les posts</h2>
      <div class="postContainer d-flex">
        <!-- ............✍️ ici démarre la zone d'input "new post" ✍️.............. -->
        <div class="writeBox">
          <div class="inputContainer d-flex">
            <label for="post-title" title="maximum 50 caractères"
              >Titre :</label
            >
            <input
              v-model="inputTitle"
              type="text"
              size="50"
              maxlength="50"
              class="centerTxt input-title"
              name="inputTitle"
              id="inputTitle"
              placeholder="votre titre"
              required
            />

            <label for="post-write" title="maximum 500 caractères"
              >Contenu :</label
            >
            <textarea
              v-model="inputText"
              rows="4"
              cols="1"
              maxlength="500"
              class="centerTxt input-text"
              name="inputText"
              id="inputText"
              placeholder="votre message"
              required
            ></textarea>

            <div class="input-button d-flex">
              <!-- <i class="fa-solid fa-image"></i> -->
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
            </div>
          </div>
        </div>
        {{ idConnected }}{{ isAdmin }}{{ typeof isAdmin }}
        <!-- .................. modale .................. -->
        <!-- <modal-post></modal-post> -->
        <!-- <modalPost toggleModal="Welcome here" /> -->
        <!-- ................📩 ici démarre la zone d'affichage des posts 📩......VFOR.......... -->
        <div
          v-for="(post, index) in getApiResponse"
          :key="post.idPosts"
          :id="post.idPosts"
          class="postsCard"
        >
          <div class="post">
            <!-- <router-link to="/posts">Posts</router-link> -->
            <!-- <p>Ecrit par {{ post.id_Users }} le {{ post.time }}</p> -->
            <div class="d-flex2c postOrigin">
              <p>Ecrit par {{ post.pseudo }}</p>
              <img alt="avatar" class="postAvatar" v-bind:src="post.avatar" />
              <!-- <p>le {{ dayjs(post.time).format("DD/MM/YYYY") }}</p> 
              -->
              <p>
                le
                {{ format(post.time) }}
              </p>
            </div>
            <p class="post-title">{{ post.titre }}</p>
            <!-- {{ post.idLikes[0] }} -->
            <div class="post-image">
              <!-- <img alt="imag" src="../assets/imag.jpg" /> -->
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
                  :style="[aCommente && { color: 'blue' }]"
                  v-on:click="showCommentsFunction(post.idPosts)"
                ></i>
                <p class="commentNumber" title="nombre de commentaires">
                  {{ post.commentCount }}
                </p>
              </div>
              <!-- <i
                class="fa-solid fa-thumbs-up thumbUp"
                title="liker le message"
              ></i>
              <i
                class="fa-solid fa-thumbs-down thumbDown"
                title="disliker le message"
              ></i> -->
              <div class="likeContainer">
                <i
                  class="fa-solid fa-heart like"
                  title="liker le message"
                  :style="[checkLike(post.idPosts) && { color: 'blue' }]"
                  v-on:click="likeUnlike(post.idPosts)"
                ></i>
                <!-- <p class="likeNumber">{{ post.like }}</p> ----------------------- -->
                <p class="likeNumber" title="nombre de likes">
                  {{ (post.likeCounter = likeCount) }}
                </p>
              </div>
              <i
                class="fa-solid fa-pen-to-square modifyPost"
                title="modifier le message"
                v-if="post.id_Users == idConnected || isAdmin === true"
                v-on:click="modifyPost(post.idPosts)"
              ></i>
              <i
                class="fa-solid fa-trash-can deletePost"
                title="supprimer le message"
                v-if="post.id_Users == idConnected || isAdmin === true"
                v-on:click="deletePost(post.idPosts)"
              ></i>
            </div>

            <!-- ........💬 ici démarre la zone d'affichage des commentaires 💬........ -->
            <!-- <comment-view
              v-show="showCommentsBoolean"
              text="props!"
              :idFromPost="post.idPosts"
              @combiendecomment="
                (comCount) => {
                  commentCount = comCount;
                }
              :style="[true && { display: 'none' }]"
            ></comment-view> -->
            {{ post.commentCount }}

            <comment-view
              v-show="commentShowTab.indexOf(post.idPosts) !== -1"
              text="props!"
              :idFromPost="post.idPosts"
              @combiendecomment="
                (comCount) => {
                  getApiResponse[index].commentCount = comCount;
                }
              "
              @atilCommenteCePost="aCommente = $event"
            ></comment-view>
            <!-- on aurait pu utiliser 
              :style="[true && { display: 'none' }]" à la place de vshow -->
          </div>
          <!-- <p>{{ getApiResponse }}</p> -->
        </div>
      </div>
    </div>

    <!-- ........🔌 ici la zone d'erreur réseau / serveur 🔌........ -->
    <div class="noLoading" v-else>
      <!-- <div class="noLoading" v-if="loading === false"> -->
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
import modalPost from "@/components/modalPost.vue";
import commentView from "@/components/commentView.vue";
import dayjs from "dayjs";

export default {
  name: "postsView",
  components: { "comment-view": commentView },
  // components: { "modal-post": modalPost },

  data() {
    return {
      info: null,
      loading: false,
      compteur: 0,
      text1: "texte de test",
      url: "http://localhost:3000/api/posts",
      urlLikes: "http://localhost:3000/api/likes",
      getApiResponse: "", //reponse du getAllPost
      postApiResponse: "",
      getLikeResponse: "",
      messageRetour: "",
      inputTitle: "",
      inputText: "",
      inputFile: "",
      timeDayjs: [],
      idConnected: localStorage.getItem("userId"),
      isAdmin: localStorage.getItem("admin") == 1 ? true : false,
      postIdToComment: "5",
      showCommentsBoolean: false,
      commentShowTab: [],
      allLikedPostTab: JSON.parse(localStorage.getItem("allLikedPost")),
      likeOnTab: [],
      likeCount: 0,
      aCommente: false,
    };
  },

  // created() {
  mounted() {
    // axios.get(this.url).then((response) => (this.getApiResponse = response.data));
    //this.getAllLikes4OnePost(145);
    this.getAllPost(true); //recup tout (likes aussi)
    //this.getAllLikes();
  },
  computed: {},
  methods: {
    checkLike(idpost) {
      //regarde si user connecté a liké ce post
      let test = 0;
      let booleanResponse = false;
      test = this.allLikedPostTab.indexOf(idpost);
      if (test == -1) {
        //si idpost pas trouvé dans la liste des idpost likés
        booleanResponse = false; //like restera noir
      } else {
        booleanResponse = true; //sinon sera bleu
      }
      return booleanResponse;
    },
    checkComment(idpost) {
      //regarde si user connecté a commenté ce post
      let test = 0;
      let booleanResponse = false;
      test = this.allLikedPostTab.indexOf(idpost); //a changer
      if (test == -1) {
        //si idpost pas trouvé dans la liste des idpost likés
        booleanResponse = false; //like restera noir
      } else {
        booleanResponse = true; //sinon sera bleu
      }
      return booleanResponse;
    },
    //! retourne le nombre de like d'un post//(non impl)
    getAllLikes4OnePost(idPosts) {
      //console.log(idPosts);

      const test = axios
        .get(this.urlLikes + "/" + idPosts)
        .then((response) => {
          this.getLikeResponse = response.data;
          //car renvoi un objet data qui contient les differentes clés/valeur (cf postman)
          //console.log(this.getLikeResponse);
          this.likeCount = response.data.length;
          //console.log(this.likeCount);
          return response.data.length;
        })
        .catch((error) => {
          console.log(error);
        });
      //console.log("test", test);
      return test;
    },
    // showCommentsFunction(idpost) {
    //   const test = this.commentShowTab.indexOf(idpost);
    //   if (test == -1) {
    //     //pas de valeur retournée
    //     this.commentShowTab.push(idpost);
    //   } else {
    //     this.commentShowTab = this.commentShowTab.filter(
    //       (element) => element !== idpost
    //     );
    //   }
    // },
    showCommentsFunction(idpost) {
      //on va stocker dans un tableau les idpost des click pour afficher les Commentaires
      //dans le else, on retire les idpost si sont reclickés
      //car le vshow ne montrera que les idpost qui sont dans le tableau
      //(et si on avait reclické, on avait refermé)
      const test = this.commentShowTab.indexOf(idpost);
      //console.log("start");
      //console.log(this.commentShowTab);
      //console.log(this.commentShowTab.indexOf(idpost));
      if (test == -1) {
        //pas de valeur retournée=cet idPost n'est pas stocké
        //alors on l'ajoute au tableau
        this.commentShowTab.push(idpost);
        //console.log("ifmoins1");
        //console.log(this.commentShowTab);
        //console.log(this.commentShowTab.indexOf(idpost));
      } else {
        //si cet idpost etait stocké, on le retire
        //(on ne garde que les elements qui ne sont pas idPost)
        this.commentShowTab = this.commentShowTab.filter(
          (element) => element !== idpost
        );
        //console.log("sinon");
        //console.log(this.commentShowTab);
        //console.log(this.commentShowTab.indexOf(idpost));
      }
    },

    format(maDate) {
      return dayjs(maDate).format("DD/MM/YYYY HH:mm");
      // console.log();
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

    //!getAllLikes
    getAllLikes() {
      //console.log("getApiResponse  from getAllPost");
      //console.log(this.getApiResponse);
    },

    //! on like (ou retire le like)
    likeUnlike(idPosts) {
      // console.log(idPosts);
      //si n'existe pas dans tableau des like allLikedPostTab , on le push, sinon on vire
      const test = this.allLikedPostTab.indexOf(idPosts);
      //console.log("start");
      //console.log(this.commentShowTab);
      //console.log(this.commentShowTab.indexOf(idpost));
      let likeValueToSend;
      if (test == -1) {
        //pas de valeur retournée=cet idPost n'est pas stocké
        //alors on l'ajoute au tableau et on enverra 1 au backend
        this.allLikedPostTab.push(idPosts);
        likeValueToSend = 1;
      } else {
        //si cet idpost etait stocké, on le retire
        //(on ne garde que les elements qui ne sont pas idPost)
        //et on enverra 0 au backend
        this.allLikedPostTab = this.allLikedPostTab.filter(
          (element) => element !== idPosts
        );
        likeValueToSend = 0;
      }
      //on ajuste local storage allLikedPostTab: JSON.parse(localStorage.getItem("allLikedPost"))
      localStorage.setItem(
        "allLikedPost",
        JSON.stringify(this.allLikedPostTab)
      );

      const config = null;

      let newLike = {
        like: likeValueToSend, //sera forcément 0(retire le like) ou 1(ajoute le like)
        id_Posts: idPosts,
        id_Users: this.idConnected,
      };
      axios
        .post(
          this.urlLikes,
          newLike,
          config
          // { headers: { Authorization: "Bearer " + token } }
          // { headers: { Authorization: `Bearer ${token}` } }
        )
        // .post(this.url, { pseudo: "user60", password: "mdp" })
        .then((response) => {
          this.postApiResponse = response.data;
          this.messageRetour = "Message envoyé !";
          // console.log(this.postApiResponse);
          // console.log(this.postApiResponse.userId);
          // console.log(this.postApiResponse.token);
          this.loading = true;
          // console.log("j'ai liké !");

          this.getAllPost();
          //this.$router.push("/");
        })
        .catch((error) => {
          console.log(error);
          this.messageRetour = error.response.data.erreur;
          //console.log(error.response.data);
          //this.messageRetour = this.getApi.error;
          //this.loading = false;
        });
    },

    //! on montre les commentaires
    showComments(idPosts) {
      // console.log(idPosts);
      // this.showCommentsBoolean = true;
      this.showCommentsBoolean = !this.showCommentsBoolean;
      //console.log(this.showCommentsBoolean);
      // this.postIdToComment = idPosts;
      // localStorage.setItem("postId2comment", idPosts);
    },

    //! on 🗑️ supprime un post
    deletePost(idPosts) {
      //console.log(idPosts);
      if (
        confirm("Voulez vous vraiment supprimer le message " + idPosts + " ?")
      ) {
        axios
          .delete(this.url + "/" + idPosts)
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

    // //! on ✍️ modifie un post
    // //faire cas image ou non ; faire via modale?
    // modifyPost(idPosts) {
    //   console.log(idPosts);
    //   axios
    //     .put(this.url + "/" + idPosts)
    //     .then((res) => {
    //       console.log(res);
    //       //alert("Votre message " + idPosts + " a bien été supprimé");
    //       this.getAllPost();
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },

    //! on 📦 récupère tous les posts from backend
    getAllPost(premierChargement = false) {
      axios
        .get(this.url)
        .then((response) => {
          // this.getApiResponse = null;
          if (premierChargement) {
            this.getApiResponse = response.data.map((element) => {
              element.commentCount = 0;
              console.log("if");
              return element;
            });
          } else {
            console.log("else");
            this.getApiResponse = [...this.getApiResponse, response.data];
          }

          //car renvoi un objet data qui contient les differentes clés/valeur (cf postman)
          //console.log("getApiResponse from getAllPost");
          console.log("get", this.getApiResponse);
          this.timeDayjs = dayjs(this.getApiResponse.time).format(
            "DD/MM/YYYY HH:mm"
          );
          //console.log(this.timeDayjs);
          this.loading = true;
        })
        .catch((error) => {
          console.log(error);
        });

      //creer un tableau likeOnTab contenant pour chaque entrée/post la liste des users ayant liké
      // et dont index =idem celui de apiresponse entrée[0] = post le + recent, tout en haut

      // console.log("getApiResponse");
      // console.log(this.getApiResponse);
      // for (let index = 0; index < this.getApiResponse.length; index++) {
      //   this.likeOnTab.push(
      //     this.getAllLikes4OnePost(this.getApiResponse[0].idPosts)
      //   );
      // }
    },

    //! on ✉️ envoie un post au backend
    envoiPost: function () {
      // let bodyParameters = {
      //   titre: this.inputTitle,
      //   contenu: this.inputText,
      //   image: this.inputFile,
      //   //id_Users: JSON.parse(localStorage.getItem("userId")).toString(),
      //   id_Users: localStorage.getItem("userId"),
      // };

      const formdata = new FormData();
      formdata.append("titre", this.inputTitle);
      formdata.append("contenu", this.inputText);
      if (this.inputFile) {
        formdata.append("image", this.inputFile, this.inputFile.name);
      }
      formdata.append("id_Users", this.idConnected);
      //console.log(formdata);

      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // };
      // console.log(config);
      const config = null;

      axios
        .post(
          this.url,
          formdata,
          config
          // { headers: { Authorization: "Bearer " + token } }
          // { headers: { Authorization: `Bearer ${token}` } }
        )
        // .post(this.url, { pseudo: "user60", password: "mdp" })
        .then((response) => {
          this.postApiResponse = response.data;
          this.messageRetour = "Message envoyé !";
          // console.log(this.postApiResponse);
          // console.log(this.postApiResponse.userId);
          // console.log(this.postApiResponse.token);
          this.loading = true;
          //remettre els champs à zero
          this.inputTitle = "";
          this.inputText = "";
          this.$refs.file.value = "";

          this.getAllPost();
          //this.$router.push("/");
        })
        .catch((error) => {
          console.log(error);
          this.messageRetour = error.response.data.erreur;
          //console.log(error.response.data);
          //this.messageRetour = this.getApi.error;
          //this.loading = false;
        });
    },
  },
};
</script>

//! ............................... STYLE ............................... //

<style></style>

<style scoped>
.main {
  padding-bottom: 10px;
}
.inputContainer {
  /* background-color: var(--main-color2); */
  background-color: #919ba7;
  border-radius: 25px;
  /* margin: 1vw 6vw; */
  width: 100%;
  /* margin: 10px auto; */
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
  color: #ffd7d7;
  /* font-size: 5vw; */
}
.envoiPost {
  padding: 10px;
}
.postContainer {
  padding: 10px;
  border: solid 1px blue;
}
.writeBox {
  padding: 10px 0;
  border: solid 1px blue;
  margin-bottom: 10px;
}
.post-icon {
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 1.6vw;
}
.post {
  border: solid 1px red;
  margin: 1.4vw 0;
}
.postOrigin {
  margin: 5px 0;
}

.forme {
  color: green;
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
}

.fa-solid {
  cursor: pointer;
  margin: 5px;
  /* color: #3b46eb; */
}
.fa-solid:hover {
  /*box-shadow: 10px 5px 5px black;*/
  /*transform: scale(1.01);*/
  filter: brightness(1.5);
}
.modifyPost,
.deletePost {
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
  width: 2%;
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
  /* position: absolute; */
  left: 24px;
  top: 14px;
  cursor: default;
  /* width: 30px; */
}
.fa-heart:hover {
  color: #3b46eb;
}
.blue {
  color: #3b46eb;
}
</style>
