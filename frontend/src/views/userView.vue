//! ............................... TEMPLATE ............................... //

<template>
  <div>
    <div class="users container" v-show="loading === true">
      <h1>Présentation de nos utilisateurs</h1>
      <h2 class="centerTxt">voici la fiche de :</h2>
      <div class="OneUserContainer d-flex">
        <!--ici démarre la zone de users-->
        <!-- <div class="usersCard">
        <div class="user">
          <p class="user-pseudo">pseudo</p>
          <p class="user-bio">presentation</p>
        </div>
      </div> -->
        <!-- <div v-for="user in getApiResponse" :key="user.idUsers" class="usersCard"> -->
        <!-- <div v-for="user in getApiResponse" :key="user.idUsers" class="usersCard"> -->
        <div class="user">
          <!-- <div class="user" :href="npmjs.com"> -->
          <!-- <div class="user" :href="html/product.html?${data[i]._id}"> -->
          <!-- <router-link to="/posts">Posts</router-link> -->
          <p class="user-pseudo">{{ getApiResponse.pseudo }}</p>

          <img alt="avatar" class="avatar" v-bind:src="getApiResponse.avatar" />
          <p class="user-email">Adresse email : {{ getApiResponse.email }}</p>

          <p class="user-bio">Bio : {{ getApiResponse.bio }}</p>
          <p class="user-time">Profil créé le : {{ getApiResponse.time }}</p>
          <!-- <img href="http://localhost>" -->
        </div>

        <!-- <p>{{ getApi }}</p> -->
      </div>
    </div>

    <div class="noLoading" v-show="loading === false">
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
export default {
  name: "usersView",
  data() {
    return {
      loading: false,
      getApiResponse: "",
      url: "http://localhost:3000/api",
      urlVue2: "https://fr.vuejs.org/v2/guide/installation.html",
      oneUrl: "http://localhost:3000/api/user/{{getApiResponse.idUsers}}",
    };
  },
  created() {
    console.log(this.$route.params.id);
    axios.get(this.url + `/users/` + this.$route.params.id).then((response) => {
      this.getApiResponse = response.data[0];
      // this.getApiResponse = response.data;
      console.log(this.getApiResponse);
      this.loading = true;
    });
    // axios.get(this.url).then((response) => (this.getApiResponse = response.data));
  },
};

// //fetch
// fetch(url)
//   .then((res) => {
//     if (res.ok) {
//       console.log("success(fetch url)!");
//       return res.json();
//     } else {
//       console.log("failed (fetch url)!"); //si bad url ou ...
//       console.error("erreur : ", status.code); //affiche message d'erreur
//       //warning();
//     }
//   })
//   .then((data) => {
//     console.log(data); //affiche les data de l'api (tableau d'objet)
//     let usersString = ""; // Création de la variable qui concatenera tous éléments

//     // Boucle pour récupérer les données des produits &écrire html//
//     for (let i = 0; i < data.length; i++) {
//       console.log(data[i].idUsers + data[i].pseudo); // Visualisation si la boucle est opérationnel //

//       // Création de l'élément en HTML //
//       //avec pour chaque le lien .html?id et img/nom/prix/description
//       usersString += `
//         <div class="user">
//           <p class="user-pseudo">${data[i].pseudo}</p>
//           <p class="user-bio">${data[i].bio}</p>
//         </div>`;
//     }

//     // Insertion html créé : mis dans .postsContainerHTML (index.html) //
//     const userContainerHTML = document.querySelector(".userContainer");
//     userContainerHTML.innerHTML = usersString;
//   })

//   // Message d'erreur //
//   .catch((error) => {
//     console.log("error(du catch de fetch url)"); //+quand pas connexion server,bad url,erreur dans then
//     console.error("erreur : ", error); //affiche message d'erreur
//     //warning();
//   });
//
</script>

//! ............................... STYLE ............................... //

<style scoped>
.main {
  padding-bottom: 10px;
}

.userContainer {
  padding: 10px;
  border: solid 1px blue;
}

.user {
  padding: 5px;
  border: solid 2px red;
}
.user-pseudo {
  font-weight: bold;
  text-transform: uppercase;
}
.user-time {
  font-style: italic;
}
</style>
