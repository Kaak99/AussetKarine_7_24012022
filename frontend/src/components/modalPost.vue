//! ............................... TEMPLATE ............................... //

<template>
  <!-- <div class="container">  </div> -->

  <div class="bloc-modale" v-if="revele">
    <div class="overlay" v-on:click="toggleModale"></div>

    <div class="modaleCard">
      <!-- <div class="btn-modale">cliquez pour fermer</div> -->
      <div class="content-modale">
        <h1>Modifiez votre message</h1>
        <div class="post-modifier d-flex">
          {{ postId }}
          <label for="title-modify" title="maximum 50 caractères"
            >Titre :</label
          >
          <input
            v-model="modifiedTitle"
            type="text"
            size="50"
            maxlength="25"
            class="centerTxt"
            name="modifiedTitle"
            id="modifiedTitle"
            required
          />
          <!-- <img
            class="postMiniImage"
            alt="image d'illustration "
            v-bind:src="post.image"
            v-if="post.image"
          /> -->
          <label for="postContent-modify" title="au moins 5 lettres"
            >Bio :</label
          >
          <textarea
            v-model="modifiedPostContent"
            name="modifiedText"
            id="modifiedText"
            rows="10"
            cols="500"
            maxlength="500"
            class="centerTxt"
            required
          />

          <label for="postImage" title="fichier jpg/webp/gif/png <3mo"
            >Image :</label
          >
          <img
            v-if="this.image"
            alt="illustration"
            class="illustration"
            v-bind:src="this.image"
            :title="this.image"
          />
          <div class="imgSelectContainer d-flex2c">
            <input
              type="file"
              class="fileButton"
              id="file"
              ref="file"
              name="image"
              @change="selectFile()"
              accept=".jpg,.jpeg,.png,.gif,.webp"
            />
            <i class="fa-sharp fa-solid fa-circle-xmark"></i>
          </div>
          <button
            class="buttonValid modifyPostButton"
            v-on:click.prevent="modifyPost"
          >
            Validez
          </button>
          <p>{{ messageRetour }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

//! ............................... SCRIPT ............................... //

<script>
import axios from "axios";
export default {
  name: "modal-post",
  // props: ["revele", "modalString", "toggleModale"],
  props: {
    revele: Boolean,
    modalString: String,
    toggleModale: Function,
  },
  data() {
    return {
      messageRetour: "",
      idConnected: JSON.parse(localStorage.getItem("userId")),
      postId: JSON.parse(localStorage.getItem("modifyPostId")),
      url: "http://localhost:3000/api",
      oneUrl: "http://localhost:3000/api/posts/postId",
      getApiResponse: "", //recupere le getOnePost
      putApiResponse: "", //recupere le modifyPost
      modifiedTitle: "",
      modifiedPostContent: "",
      inputFile: null,
      image: "",
    };
  },
  created() {
    console.log("created modalPost");
    this.getOnePost();
  },
  methods: {
    selectFile() {
      //console.log(this.$refs.file.files[0].name);
      this.inputFile = this.$refs.file.files[0];
      console.log(this.inputFile);
    },
    getOnePost() {
      // console.log("getOnePost");
      console.log(this.postId);
      let postId2 = localStorage.getItem("modifyPostId");
      console.log(postId2);
      axios
        .get(this.url + `/posts/` + this.postId)
        .then((response) => {
          this.getApiResponse = response.data;
          // this.getApiResponse = response.data;
          console.log(this.getApiResponse);
          this.modifiedTitle = this.getApiResponse.titre;
          this.modifiedPostContent = this.getApiResponse.contenu;
          this.image = this.getApiResponse.image;

          // console.log(this.modifiedTitle);
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

    modifyPost() {
      //quand on valide la modif
      // console.log("modifyPost");
      const formdata = new FormData();
      formdata.append("titre", this.modifiedTitle);
      formdata.append("contenu", this.modifiedPostContent);
      console.log(this.inputFile);
      if (this.inputFile) {
        console.log("dans if");
        formdata.append("image", this.inputFile, this.inputFile.name);
      }
      formdata.append("id_Users", this.idConnected);
      console.log("formdata");
      console.log(formdata);
      let modifyUrl = this.url + `/posts/` + this.postId;
      console.log(modifyUrl);
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // };
      // console.log(config);
      const config = null;

      axios
        .put(
          modifyUrl,
          formdata,
          config
          // { headers: { Authorization: "Bearer " + token } }
          // { headers: { Authorization: `Bearer ${token}` } }
        )
        // .post(this.url, { pseudo: "user60", password: "mdp" })
        .then((response) => {
          this.putApiResponse = response.data;
          console.log(this.putApiResponse);
          this.messageRetour = "Message envoyé !";
          //this.$emit("retourModalPost", this.revele);
          this.$emit("retourModalPost", this.toggleModale());

          // console.log(this.postApiResponse.userId);
          // console.log(this.postApiResponse.token);
          // this.loading = true;
          // this.inputTitle = "";
          // this.inputText = "";
          // this.$refs.file.value = "";
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
<style scoped>
* {
  padding: 0.5% 1%;
}
.bloc-modale {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modaleCard {
  background: #919ba7;
  color: #333;
  padding: 20px;
  position: fixed;
  top: 20%;
  border-radius: 10%;
}

/* .btn-modale {
  top: 10%;
} */
.content-modale {
  min-width: 60vw;
  min-height: 30vh;
  max-width: 80vw;
  max-height: 80vh;
  background-color: #ffd7d7;
  border-radius: 8%;
}
.imgSelectContainer {
  align-items: center;
}
.illustration {
  width: 40%;
  max-width: 600px;
  min-width: 80px;
}
.post-modifier {
  padding: 5px;
  /* border: solid 2px red; */
  width: 90%;
  margin: 5px auto;
}
.modifyPostButton:hover {
  cursor: pointer;
  color: #3b46eb;
  /* transform: scale(1.02); */
}
.modifyPostButton {
  padding: 1%;
  font-size: 2.7vw;
  width: 50%;
  margin: 1% auto;
}
@media all and (max-width: 400px) /* <300w*/ {
  .modifyPostButton {
    padding: 1%;
    font-size: 5vw;
  }
}
@media all and (min-width: 1000px) /* >1000w*/ {
  .modifyPostButton {
    padding: 1%;
    font-size: 2vw;
  }
}
</style>
