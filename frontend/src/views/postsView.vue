//! ............................... TEMPLATE ............................... //

<template>
  <div>
    <div class="posts container" v-if="loading === true">
      <h1>Voici la liste de tous les messages</h1>
      <h2 class="centerTxt">Tous les posts</h2>
      <div class="postContainer d-flex">
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
        {{ idConnected }}
        <!--modale-->
        <!-- <modalPost2></modalPost2> -->
        <!-- <modalPost toggleModal="Welcome here" /> -->
        <!--ici démarre la zone d'affichage des posts-->
        <div
          v-for="post in getApiResponse"
          :key="post.idPosts"
          class="postsCard"
        >
          <div class="post">
            <!-- <router-link to="/posts">Posts</router-link> -->
            <p>Ecrit par {{ post.id_Users }} le {{ post.time }}</p>
            <p class="post-title">{{ post.titre }}</p>
            <div class="post-image">
              <!-- <img alt="imag" src="../assets/imag.jpg" /> -->
              <img
                alt="image d'illustration "
                v-bind:src="post.image"
                v-if="post.image"
              />
            </div>

            <p class="post-text">{{ post.contenu }}</p>
            <p class="post-icon d-flex2c">
              <!-- <p class="addComment d-flex">📩</p>
              <p class="thumbUp d-flex">👍🏻</p>
              <p class="thumbDown d-flex">👎🏻</p>
              <p class="modifyPost d-flex">✍🏻</p>
              <p class="deletePost d-flex">🗑️</p> -->
              <i
                class="fa-solid fa-comment addComment"
                title="Commentaires"
              ></i>
              <i
                class="fa-solid fa-thumbs-up thumbUp"
                title="liker le message"
              ></i>
              <i
                class="fa-solid fa-thumbs-down thumbDown"
                title="disliker le message"
              ></i>
              <i
                class="fa-solid fa-pen-to-square modifyPost"
                title="modifier le message"
                v-if="post.id_Users == idConnected || idConnected == 1"
              ></i>
              <i
                class="fa-solid fa-trash-can deletePost"
                title="supprimer le message"
                v-if="post.id_Users == idConnected || idConnected == 1"
                v-on:click="deletePost(post.idPosts)"
              ></i>
            </p>
          </div>
        </div>
        <!-- <p>{{ getApiResponse }}</p> -->
      </div>
    </div>

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
// import modalPost from "@/components/modalPost.vue";

export default {
  name: "postsView",
  // components: modalPost,

  data() {
    return {
      info: null,
      loading: false,
      compteur: 0,
      text1: "texte de test",
      url: "http://localhost:3000/api/posts",
      getApiResponse: null,
      postApiResponse: "",
      messageRetour: "",
      inputTitle: "",
      inputText: "",
      inputFile: "",
      commentFlag: 0,
      likeFlag: 0,
      unlikeFlag: 0,
      modifyFlag: 0,
      deleteFlag: 0,
      authFlag: 0,
      idConnected: localStorage.getItem("userId"),
    };
  },

  created() {
    //mounted() {
    // axios.get(this.url).then((response) => (this.getApiResponse = response.data));
    this.getAllPost();
  },
  methods: {
    selectFile() {
      //console.log(this.$refs.file.files[0].name);
      this.inputFile = this.$refs.file.files[0];
      console.log(this.inputFile);
    },
    // selectFile: function (e) {
    //   this.inputFile = e.target.files[0];
    //   console.log(this.inputFile);
    // },
    deletePost(idPosts) {
      console.log(idPosts);
      alert("Voulez vous vraiment supprimer le message " + idPosts + " ?");
      axios
        .delete(this.url + "/" + idPosts)
        .then((res) => {
          console.log(res);
          this.getAllPost();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAllPost() {
      axios
        .get(this.url)
        .then((response) => {
          this.getApiResponse = response.data;
          //car renvoi un objet data qui contient les differentes clés/valeur (cf postman)
          //console.log(this.getApiResponse);
          this.loading = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
      formdata.append("id_Users", localStorage.getItem("userId"));
      console.log(formdata);

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
          this.inputFile = "jjj";
          //this.$refs.file = "ttt";
          this.getAllPost();
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
  width: 90%;
  margin: 10px auto;
  color: #3b46eb;
}
.input-button {
  align-items: center;
  flex-wrap: wrap;
}
.fileButton {
  display: flex;
  flex-direction: columns;
  flex-wrap: wrap;
  color: green;
  font-size: 2vw;
}

.postContainer {
  padding: 10px;
  border: solid 1px blue;
}
.writeBox {
  padding: 10px;
  border: solid 1px blue;
  margin-bottom: 10px;
}
.post-icon {
  flex-direction: row;
  justify-content: space-evenly;
}
.post {
  padding: 5px;
  border: solid 1px red;
  margin-bottom: 5px;
}
.fa-solid:hover {
  /*box-shadow: 10px 5px 5px black;*/
  /*transform: scale(1.01);*/
  filter: brightness(1.5);
}
.forme {
  color: green;
}
.post-title {
  background-color: pink;
  font-weight: bold;
  text-decoration: underline;
}
.modifyPost,
.deletePost {
  color: #d11421;
}
.fa-solid {
  cursor: pointer;
  margin: 5px;
}
</style>
