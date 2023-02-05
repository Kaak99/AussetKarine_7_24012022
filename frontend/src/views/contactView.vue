//! ............................... TEMPLATE ............................... //

<template>
  <div class="contact container">
    <h1 class="centerTxt">Vous voulez nous contacter ?</h1>
    <img
      alt="Logo de Groupomania"
      src="../assets/Groupomania_Logos/icon-above-font.png"
    />
    <div class="texte d-flex">
      <p class="centerTxt">Problème technique :</p>
      <a :href="`mailto:${tech.mail}`"> {{ tech.mail }} </a>
      <p class="centerTxt">Administrateur :</p>
      <a v-bind:href="'mailto:' + admin.mail">{{ admin.mail }}</a>
    </div>
  </div>
</template>

//! ............................... SCRIPT ............................... //

<script>
export default {
  name: "contactView",

  data() {
    return {
      admin: { name: "administrateur", mail: "admin-forum@groupomania.fr" },
      tech: { name: "technicien", mail: "tech-forum@groupomania.fr" },
    };
  },
};
</script>

//! ............................... STYLE ............................... //
<style></style>

<style scoped>
* {
  padding: 8px 4px;
}

img {
  width: 30%;
  max-width: 800px;
  min-width: 80px;
  max-height: 1000px;
  object-fit: contain;
}
</style>
