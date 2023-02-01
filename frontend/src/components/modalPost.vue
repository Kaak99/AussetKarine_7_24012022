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
          <label for="title-modify" title="2 à 50 caractères">Titre :</label>
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

          <p
            id="modifiedTitleOk"
            class="modifiedTitleValid"
            v-if="testRegex(/^.{2,50}$/, this.modifiedTitle, 1)"
          >
            <i class="fas fa-check-circle"></i>Correct
          </p>
          <p v-else id="modifiedTitleAlert" class="modifiedTitleAlert">
            <i class="fas fa-times-circle"></i>Incorrect (2 à 50 caractères)
          </p>
          <!-- <img
            class="postMiniImage"
            alt="image d'illustration "
            v-bind:src="post.image"
            v-if="post.image"
          /> -->
          <label for="postContent-modify" title="2 à 500 caractères"
            >Contenu :</label
          >
          <textarea
            v-model="modifiedPostContent"
            name="modifiedText"
            id="modifiedText"
            rows="10"
            cols="500"
            maxlength="500"
            class="centerTxt"
            wrap="soft"
            required
          />
          <p
            id="modifiedTextOk"
            class="modifiedTextValid"
            v-if="testRegex(/^(.|\s){2,500}$/, this.modifiedPostContent, 2)"
          >
            <i class="fas fa-check-circle"></i>Correct
          </p>
          <p v-else id="modifiedText" class="modifiedText">
            <i class="fas fa-times-circle"></i>Incorrect (2 à 500 caractères)
          </p>

          <label for="postImage" title="fichier jpg/webp/gif/png <3mo"
            >Image :</label
          >
          <div class="imgSelectContainer d-flex2c">
            <img
              v-if="image"
              alt="illustration"
              class="illustration"
              v-bind:src="image"
              :title="image"
            />

            <button
              class="deleteImgButton"
              v-on:click="deleteImage()"
              v-if="image || inputFile"
              title="supprimer image de profil"
            >
              Aucune image
            </button>
          </div>
          <!-- <i
            class="fa-sharp fa-solid fa-circle-xmark delImg"
            title="Aucune image (delete)"
            v-on:click="deleteImage()"
          ></i
          >{{ deleteImageBoolean }} -->
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
          </div>
          <button
            class="buttonValid modifyPostButton"
            v-on:click.prevent="modifyPost"
          >
            Validez
          </button>
          <p class="messageRetour">{{ messageRetour }}</p>
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
    idPosttoModify: Number,
  },
  data() {
    return {
      messageRetour: "",
      idConnected: JSON.parse(localStorage.getItem("userId")),
      postId: JSON.parse(localStorage.getItem("modifyPostId")),
      //url: "http://localhost:3000/api",
      url: `${process.env.VUE_APP_URL_SERVEUR}/api`,
      //oneUrl: "http://localhost:3000/api/posts/postId",
      oneUrl: `${process.env.VUE_APP_URL_SERVEUR}/api/posts/postId`,
      getApiResponse: "", //recupere le getOnePost
      putApiResponse: "", //recupere le modifyPost
      modifiedTitle: "",
      testModifiedTitle: false,
      modifiedPostContent: "",
      testModifiedPostContent: false,
      inputFile: null,
      image: "",
      deleteImageBoolean: false,
    };
  },
  // created() {
  //   console.log("created modalPost");
  //   this.getOnePost();
  // },
  watch: {
    idPosttoModify: function (val) {
      this.getOnePost(val);
      //console.log("watch", val);
      this.messageRetour = "";
      //this.idPosttoModify = 0;
    },
    inputTitle: function (val) {
      this.messageRetour = "";
    },
    inputText: function (val) {
      this.messageRetour = "";
    },
    inputFile: function (val) {
      this.messageRetour = "";
    },
  },

  methods: {
    testRegex(laRegex, varATester, testFlag) {
      //const regex = new RegExp(laRegex);
      const valeurTest = laRegex.test(varATester);
      switch (testFlag) {
        case 1:
          this.testModifiedTitle = valeurTest;
          break;
        case 2:
          this.testModifiedPostContent = valeurTest;
          break;
      }
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
    selectFile() {
      console.log("passe dans methode selectFile()");
      //console.log(this.$refs.file.files[0].name);
      this.inputFile = this.$refs.file.files[0];
      //console.log("this.inputFile", this.inputFile);
      this.image = URL.createObjectURL(this.inputFile);
      //this.inputFile = URL.createObjectURL(this.inputFile);
      // console.log(this.image);
    },
    deleteImage() {
      // this.inputFile = "";
      console.log("passe dans methode deleteImage()");
      this.deleteImageBoolean = true;
      this.image = ""; //suppr affichage image initiale
      this.inputFile = null; //suppr envoi image choisie
      this.$refs.file.value = ""; //suppr texte de image choisie
      //effacer image et selection fichier?
    },
    getOnePost(postId) {
      console.log("passe dans methode getOnePost");
      this.messageRetour = "";
      // console.log(this.postId);
      // let postId2 = localStorage.getItem("modifyPostId");
      // console.log(postId2);
      axios
        .get(this.url + `/posts/` + postId, this.configAxios())
        .then((response) => {
          this.getApiResponse = response.data;
          // this.getApiResponse = response.data;
          //console.log(this.getApiResponse);
          this.modifiedTitle = this.getApiResponse.titre;
          this.modifiedPostContent = this.getApiResponse.contenu;
          this.image = this.getApiResponse.image;
          //console.log("image", this.getApiResponse.image);
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
      if (this.testModifiedTitle && this.testModifiedPostContent) {
        console.log("passe dans methode modifyPost()");
        //quand on valide la modif
        // console.log("modifyPost");
        const formdata = new FormData();
        formdata.append("titre", this.modifiedTitle);
        formdata.append("contenu", this.modifiedPostContent);
        //console.log("inputFile", this.inputFile);
        //console.log("type inputFile", typeof this.inputFile);
        if (this.inputFile) {
          console.log("dans if this.inputFile");
          formdata.append("image", this.inputFile, this.inputFile.name);
        }
        if (this.deleteImageBoolean) {
          console.log("dans if this.deleteImageBoolean");
          formdata.append("noImg", ""); //pour dire d'effacer le fichier image d'avant
          this.deleteImageBoolean = false;
          //console.log(this.deleteImageBoolean);
          this.$refs.file.value = "";
        }
        formdata.append("id_Users", this.idConnected);
        //console.log("formdata");
        //console.log(formdata);
        let modifyUrl = this.url + `/posts/` + this.idPosttoModify;
        //console.log(modifyUrl);
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
            this.configAxios()
            // { headers: { Authorization: "Bearer " + token } }
            // { headers: { Authorization: `Bearer ${token}` } }
          )
          // .post(this.url, { pseudo: "user60", password: "mdp" })
          .then((response) => {
            this.putApiResponse = response.data;
            //console.log(this.putApiResponse);
            this.messageRetour = "Message envoyé !";
            this.inputFile = null;
            //this.$emit("retourModalPost", this.revele);
            //this.$emit("retourModalPost", this.toggleModale());
            this.toggleModale();
            this.$emit("retourModalPost", true);
            //modifier idPosttoModify à -1 pour forcer getOnePost si reclic sur meme post?
            //pas possible dans component? faire dans parent?
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
            //this.messageRetour = error.response.data.erreur;
            if (error.response.status == 500) {
              this.messageRetour = "fichier trop gros (3Mo max)!";
            } else {
              this.messageRetour = "une erreur est survenue";
            }
            //console.log(error.response.data);
            //this.messageRetour = this.getApi.error;
            //this.loading = false;
          });
      } else {
        this.messageRetour = "champs mal remplis";
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
  padding: 10px;
  position: fixed;
  top: 15%;
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
  /* align-self: center; */
}
.post-modifier {
  padding: 5px;
  /* border: solid 2px red; */
  width: 90%;
  margin: 5px auto;
}
.delImg {
  cursor: pointer;
  transform: scale(1.02);
}
.modifyPostButton:hover {
  cursor: pointer;
  color: #3b46eb;
  color: var(--primaryColor3);
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
