//! ............................... TEMPLATE ............................... //

<template>
  <div id="app">
    <div class="logoContainer">
      <img class="logo" src="./assets/Groupomania_Logos/icon-left-font.png" />
    </div>
    <nav>
      <!-- router-link = les liens pour la navigation via le routeur -->
      <router-link to="/"
        ><i class="fa-sharp fa-solid fa-house navicon" title="Home"></i
      ></router-link>
      <router-link to="/posts" v-if="isConnected"
        ><i
          class="fa-sharp fa-solid fa-envelopes-bulk navicon"
          title="Tous les messages"
        ></i
      ></router-link>
      <router-link to="/users" v-if="isConnected"
        ><i class="fa-solid fa-users navicon" title="Membres"></i
      ></router-link>
      <router-link to="/monProfil" v-if="isConnected"
        ><i class="fa-regular fa-address-card navicon" title="Mon profil"></i
      ></router-link>
      <router-link to="/deconnection" v-if="isConnected"
        ><i
          class="fa-sharp fa-solid fa-door-open navicon"
          title="Se déconnecter"
        ></i
      ></router-link>
      <router-link to="/connection" v-if="!isConnected" title="Se connecter"
        >Se connecter</router-link
      >
      <router-link
        to="/signup"
        v-if="isConnected === false"
        title="Créer un compte"
        >S'inscrire</router-link
      >
      <!-- {{ isConnected }} -->
    </nav>
    <!-- <router-view /> -->
    <!-- router-view = là ou le routeur doit afficher la route choisie -->
    <!-- c'est donc là le main de la page (routerlink up&down pour la navigation haut&bas) -->
    <!-- bien définir les PROPS dans le router-view -->
    <router-view
      :token="monTest"
      @connection="
        (booleanTransmis) => {
          isConnected = booleanTransmis;
        }
      "
    ></router-view>
    <!-- ou bien on peut appeler la fonction qui retourne isConnected = booleanTransmi au leiu de cette ronction fléchée -->
    <!--on a défini dans routerView des props, v-bind_token et l'action connection qui recoit un parametre booelen(true à la connection, false à la deco)-->
    <nav>
      <router-link to="/#">About</router-link>
      <router-link to="/#">Rules</router-link>
      <router-link to="/#">RGPD</router-link>
      <router-link to="/contact" title="nous contacter">Contact</router-link>
    </nav>
  </div>
</template>

//! ............................... SCRIPT ............................... //

<script>
export default {
  name: "App",
  data() {
    return {
      monTest: "ceci est mon test!!",
      // thisId: localStorage.getItem("userId"),
      // thisToken: localStorage.getItem("token"),
      thisId: "vide",
      thisToken: "vide",
      isConnected: false,
    };
  },
  props: {
    token: String,
  },
  created() {
    if (localStorage.getItem("userId")) {
      this.thisId = localStorage.getItem("userId");
      this.thisToken = localStorage.getItem("userToken");
      this.isConnected = true;
    } else {
      this.isConnected = false;
    }
    //console.log(this.thisId);
    //console.log(this.thisToken);
    //console.log(this.isConnected);
  },
};
</script>

//! ............................... STYLE ............................... //

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap");

#app {
  font-family: "Lato", sans-serif;
  /* font-family: Lato, Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  --primaryColor1: #919ba7;
  --primaryColor2: #d11421;
  --primaryColor3: #3b46eb;
  --primaryColor50: #2c3e50;
  word-break: break-word;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
nav {
  padding: 0.5vw 2vw;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}

a {
  font-weight: bold;
  color: #919ba7;
  margin: 1vw 2vw;
  font-size: 3.4vw;
}

nav a.router-link-exact-active {
  color: #3b46eb;
}

.centerTxt {
  text-align: center;
}
h1 {
  /* color: var(--main-color1); */
  color: #fd2d01;
  font-size: 4.4vw;
}
h2 {
  /* color: var(--main-color1); */
  color: black;
  font-size: 3.4vw;
}
p {
  /* color: var(--main-color3); */
  color: #4e5166;
  font-size: 2.4vw;
}
.d-flex {
  display: flex;
  flex-direction: column;
}
.d-flex2c {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.d-flex2s {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.container {
  /* background-color: var(--main-color2); */
  background-color: #ffd7d7;
  /* margin: 1vw 6vw; */
  width: 85%;
  margin: 0px auto;
  max-width: 1400px;
}

.logo {
  width: 30%;
  height: 5vw;
  object-fit: cover;
}
.messageRetour {
  color: red;
  opacity: 55%;
  animation: insiste 800ms ease 6;
}
@keyframes insiste {
  0% {
    opacity: 100%;
    transform: scale(1.04);
  }
  25% {
    opacity: 90%;
    transform: scale(1.02);
  }
  50% {
    opacity: 80%;
    transform: scale(1);
  }
  75% {
    opacity: 90%;
    transform: scale(1.02);
  }
  100% {
    opacity: 100%;
    transform: scale(1.04);
  }
}

/*_______________________________________________________*/
/*_____________responsive___@media______________________*/
/*_____________________________________________________*/

@media all and (max-width: 300px) /* <300w*/ {
  a,
  h2 {
    font-size: 6vw;
  }
  h1 {
    font-size: 4vw;
  }
  p,
  label,
  input,
  textarea {
    font-size: 3.5vw;
  }
  .fileButton {
    font-size: 1.9vw !important;
  }
}
@media all and (min-width: 300px) and (max-width: 400px) /* 300-400w*/ {
  a,
  h2 {
    font-size: 3vw;
  }
  h1 {
    font-size: 3vw;
  }
  p {
    font-size: 2.8vw;
  }
  .fileButton {
    font-size: 2.9vw !important;
  }
}
@media all and (min-width: 400px) and (max-width: 500px) /* 400-500w*/ {
  a,
  h2 {
    font-size: 2.8vw;
  }
  h1 {
    font-size: 2.8vw;
  }
  p {
    font-size: 2.6vw;
  }
  .fileButton {
    font-size: 1.8vw !important;
  }
}

@media all and (min-width: 500px) and (max-width: 600px) /* 500-600w*/ {
  a,
  h2 {
    font-size: 2.6vw;
  }
  h1 {
    font-size: 2.6vw;
  }

  p {
    font-size: 2.2vw;
  }
  .fileButton {
    font-size: 2vw !important;
  }
}

@media all and (min-width: 600px) and (max-width: 900px) /* entre 600 et 900px*/ {
  a,
  h2 {
    font-size: 2.2vw;
  }
  h1 {
    font-size: 2vw;
  }

  p {
    font-size: 1.8vw;
  }
  .fileButton {
    font-size: 1.8vw !important;
  }
}

@media all and (min-width: 900px) and (max-width: 1400px) /* 900-1400w*/ {
  a,
  h2 {
    font-size: 1.7vw;
  }
  h1 {
    font-size: 1.7vw;
  }

  p {
    font-size: 1.2vw;
  }
  .fileButton {
    font-size: 1.2vw !important;
  }
}
@media all and (min-width: 1400px) and (max-width: 2000px) /* 1400-2000w*/ {
  a,
  h2 {
    font-size: 1.5vw;
  }
  h1 {
    font-size: 1.6vw;
  }
  p {
    font-size: 1vw;
  }
  .fileButton {
    font-size: 1vw !important;
  }
}
@media all and (min-width: 2000px) /* >2000w*/ {
  a,
  h2 {
    font-size: 1.4vw;
  }
  h1 {
    font-size: 1.5vw;
  }
  p {
    font-size: 0.9vw;
  }
  .fileButton {
    font-size: 0.9vw !important;
  }
}
</style>

<style scoped></style>
