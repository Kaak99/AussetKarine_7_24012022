//! ............................... TEMPLATE ............................... //

<template>
  <!-- <div class="container">  </div> -->
  <div class="bloc-comments">
    <div class="newComment d-flex">
      <label for="comment-write" title="maximum 500 caractères"
        >Contenu :</label
      >
      <textarea
        v-model="inputComment"
        rows="4"
        cols="1"
        maxlength="500"
        class="centerTxt input-text"
        name="inputText"
        id="inputText"
        placeholder="votre commentaire"
        required
      ></textarea>
      <i
        class="fa-solid fa-paper-plane envoiPost"
        title="envoyer!"
        v-on:click.prevent="envoiComment"
      ></i>
    </div>

    <div class="commentsList">
      <div
        v-for="comment in getApiResponse"
        :key="comment.idComments"
        class="commentsCard"
      >
        <div class="comment">
          <!-- <router-link to="/posts">Posts</router-link> -->
          <!-- <p>Ecrit par {{ post.id_Users }} le {{ post.time }}</p> -->
          <div class="d-flex2c commentOrigin">
            <!-- <p>Ecrit par {{ post.pseudo }}</p>
              <img alt="avatar" class="postAvatar" v-bind:src="post.avatar" />
              <p>
                le
                {{ format(post.time) }}
              </p> -->
          </div>
          <p class="comment-text">{{ comment.contenu }}</p>
          {{ idFromPost }}
          <!-- {{ localStorage.getItem("postId2comment") }} -->
        </div>
      </div>
    </div>
    {{ text }}
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
  },
  data() {
    return {
      compteur: 0,
      inputText: "",
      getApiResponse: "",
      url: `http://localhost:3000/api/comments/`,
      inputComment: "",
      commentApiResponse: "",
    };
  },
  mounted() {
    //mounted() {
    // axios.get(this.url).then((response) => (this.commentApiResponse = response.data));
    this.getAllComment();
  },
  methods: {
    getAllComment: function () {
      //console.log(this.commentApiResponse);
      console.log("recup Commentaires");
      axios
        .get(this.url + this.idFromPost)
        .then((response) => {
          this.getApiResponse = response.data;
          console.log(this.getApiResponse);
          //car renvoi un objet data qui contient les differentes clés/valeur (cf postman)
          //console.log(this.getApiResponse);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    envoiComment: function () {
      const config = null;
      let id_Posts = "";
      let id_Users = "";
      let bodyParameters = {
        contenu: this.inputComment,
        id_Posts: id_Posts,
        id_Users: id_Users,
      };
      axios
        // .post(this.url, {
        //   contenu: this.contenu,
        //   id_Posts: this.id_Posts,
        //   id_Users: this.id_Users,
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
.comment {
  border: solid 1px green;
  margin-bottom: 5px;
}
.commentOrigin {
  margin: 5px 0;
}
.comment-text {
  width: 90%;
  margin: 10px auto;
}
</style>
