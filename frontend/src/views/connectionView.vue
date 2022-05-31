//! ............................... TEMPLATE ............................... //

<template>
  <!-- <div class="connection"> 
    <h1>This is a connection page test</h1>
  </div>-->

  <div class="users">
    <h1>This is a usersView page test</h1>
    <p>{{ text1 }}</p>
    <h2 class="centerTxt">Présentation de nos utilisateurs</h2>
    <div class="userContainer d-flex">
      <!--ici démarre la zone de création de posts-->
      <!-- <div class="usersCard">
        <div class="user">
          <p class="user-pseudo">pseudo</p>
          <p class="user-bio">presentation</p>
        </div>
      </div> -->
    </div>

    <div class="noLoading">
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

//! ............................... STYLE ............................... //
<style>
.user {
  padding: 5px;
  border: solid 1px cyan;
  margin-bottom: 5px;
}
.main {
  padding-bottom: 10px;
}

.userContainer {
  padding: 10px;
  border: solid 1px blue;
}
</style>

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
</style>

//! ............................... SCRIPT ............................... //

<script>
// @ is an alias to /src
//import { axios } from "axios";
import axios from "axios";
export default {
  name: "connectionView",
};
/*
//afficher warning
function warning(){
  noLoading.style.display = 'block' ;
}

//afficher warning
function noWarning(){
  noLoading.style.display = 'none' ;
}
*/
//const noLoading = document.querySelector('.noLoading');

//const postsContainerHTML = document.querySelector(".postsContainer");
const url = "http://localhost:3000/api/users";

// axios.get('https://api.chucknorris.io/jokes/search?query=god')
//   .then(function (response) {
//     return response;
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

axios
  .get(url)
  .then((data) => {
    console.log(data); //affiche les data de l'api (tableau d'objet)
    let usersString = ""; // Création de la variable qui concatenera tous éléments

    // Boucle pour récupérer les données des produits &écrire html//
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].idUsers + data[i].pseudo); // Visualisation si la boucle est opérationnel //

      // Création de l'élément en HTML //
      //avec pour chaque le lien .html?id et img/nom/prix/description
      usersString += `        
        <div class="user">
          <p class="user-pseudo">${data[i].pseudo}</p>
          <p class="user-bio">${data[i].bio}</p>
        </div>`;
    }

    // Insertion html créé : mis dans .postsContainerHTML (index.html) //
    const userContainerHTML = document.querySelector(".userContainer");
    userContainerHTML.innerHTML = usersString;
  })

  // Message d'erreur //
  .catch((error) => {
    console.error("erreur : ", error); //affiche message d'erreur
    //warning();
  });
</script>
