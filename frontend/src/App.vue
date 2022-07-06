//! ............................... TEMPLATE ............................... //

<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/posts" v-if="isConnected">Posts</router-link>
      <router-link to="/users" v-if="isConnected">Utilisateurs</router-link>
      <router-link to="/monProfil" v-if="isConnected">Mon profil</router-link>
      <router-link to="/deconnection" v-if="isConnected"
        >Déconnection</router-link
      >
      <router-link to="/connection" v-if="!isConnected"
        >Se connecter</router-link
      >
      <router-link to="/signup" v-if="isConnected === false"
        >S'inscrire</router-link
      >
      {{ isConnected }}
    </nav>
    <!-- <router-view /> -->
    <!-- <router-view :token="token"></router-view> -->
    <router-view
      :token="monTest"
      @connection="
        (booleanTransmis) => {
          isConnected = booleanTransmis;
        }
      "
    ></router-view>
    <nav>
      <router-link to="/about">About</router-link>
      <router-link to="/#">Règlement interne</router-link>
      <router-link to="/#">RGPD</router-link>
      <router-link to="/#">Nous contacter</router-link>
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
      isAdmin: "true",
    };
  },
  props: {
    token: String,
    connected: Boolean,
  },
  created() {
    if (localStorage.getItem("userId")) {
      this.thisId = localStorage.getItem("userId");
      this.thisToken = localStorage.getItem("userToken");
      this.isConnected = true;
    } else {
      this.isConnected = false;
    }
    console.log(this.thisId);
    console.log(this.thisToken);
    console.log(this.isConnected);
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
}

nav {
  padding: 1vw 2vw;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  /* margin: 20px;
  justify-content: space-around; */
}

nav a {
  font-weight: bold;
  color: #919ba7;
  margin: 1vw 2vw;
  font-size: 3vw+1;
}

nav a.router-link-exact-active {
  color: #3b46eb;
}

/* .centerTxt {
  text-align: center;
} */
h1 {
  /* color: var(--main-color1); */
  color: #fd2d01;
  font-size: 5vw+1;
}
h2 {
  /* color: var(--main-color1); */
  color: black;
  font-size: 4vw+1;
}
p {
  /* color: var(--main-color3); */
  color: #4e5166;
  font-size: 3vw+1;
}
.d-flex {
  display: flex;
  flex-direction: column;
}
.container {
  /* background-color: var(--main-color2); */
  background-color: #ffd7d7;
  /* margin: 1vw 6vw; */
  width: 85%;
  margin: 0px auto;
}
</style>
