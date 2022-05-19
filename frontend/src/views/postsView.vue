<template>
  <div class="posts">
    <h1>This is a posts page test</h1>
    <h2 class="centerTxt">Tous les posts</h2>
    <div class="postContainer d-flex">
      <!--ici démarre la zone de création de posts-->
      <!-- <div class="postsCard">
        <div class="post">
          <p class="post-title">titre du post</p>
          <p class="post-text">texte du post</p>
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

<style>
.main {
  padding-bottom: 10px;
}

.postContainer {
  padding: 10px;
  border: solid 1px blue;
}
.post {
  padding: 5px;
  border: solid 1px cyan;
  margin-bottom: 5px;
}
</style>

<style scoped>
.main {
  padding-bottom: 10px;
}

.postContainer {
  padding: 10px;
  border: solid 1px blue;
}

.post {
  padding: 5px;
  border: solid 2px red;
}
.forme {
  color: green;
}
.post-title {
  background-color: pink;
  font-weight: bold;
  text-decoration: underline;
}
</style>
<script>
// @ is an alias to /src

//! ..... FONCTIONS ..... //
//afficher warning
function warning() {
  noLoading.style.visibility = "visible";
  //noLoading.style.display = "block";
}

//afficher warning
function noWarning() {
  noLoading.style.visibility = "hidden";
  //noLoading.style.display = "none";
}

//! ..... CONST ..... //
const noLoading = document.querySelector(".noLoading");
//const postsContainerHTML = document.querySelector(".postsContainer");
const url = "http://localhost:3000/api/posts";

//! ..... CODE ..... //
noWarning();

fetch(url)
  .then((res) => {
    if (res.ok) {
      console.log("success(fetch url)!");
      return res.json();
    } else {
      console.log("failed (fetch url)!"); //si bad url ou ...
      console.error("erreur : ", status.code); //affiche message d'erreur
      warning();
    }
  })
  .then((data) => {
    console.log(data); //affiche les data de l'api (tableau d'objet)
    let postsString = ""; // Création de la variable qui concatenera tous éléments

    // Boucle pour récupérer les données des produits &écrire html//
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].titre + data[i].contenu); // Visualisation si la boucle est opérationnel //

      // Création de l'élément en HTML //
      //avec pour chaque le lien .html?id et img/nom/prix/description
      postsString += `
      <div class="post forme">
        <p class="post-title">${data[i].titre}</p>
        <p class="post-text">${data[i].contenu}</p>
      </div>`;
    }

    // Insertion html créé : mis dans .postsContainerHTML (index.html) //
    console.log(postsString);
    const postContainerHTML = document.querySelector(".postContainer");
    console.log(postContainerHTML);
    postContainerHTML.innerHTML = postsString;
  })

  // Message d'erreur //
  .catch((error) => {
    console.log("error(du catch de fetch url)"); //+quand pas connexion server,bad url,erreur dans then
    console.error("erreur : ", error); //affiche message d'erreur
    warning();
  });
</script>
