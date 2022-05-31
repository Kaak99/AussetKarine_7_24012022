//! ............................... TEMPLATE ............................... //
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>➡️ About this project</h2>
    <p>Réseau social Groupomania</p>
    <img
      alt="Vue logo"
      src="../assets/Groupomania_Logos/icon-left-font-monochrome-black.svg"
    />
    <p>
      Notre entreprise, spécialisée dans la grande distribution, est en pleine
      expansion.
    </p>
    <p>
      Nous avons actuellement plus de 600 collaborateurs et avons beaucoup
      recruté depuis quelques années.
    </p>
    <p>Nous étions uniquement 300 il y a 3 ans.</p>
    <h2>➡️ About Vue.js</h2>
    <p>This project was created using Vue.js2</p>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld2 msg="Welcome to Your Vue.js App" />
  </div>
</template>

//! ............................... STYLE ............................... //

<style></style>

<style scoped></style>

//! ............................... SCRIPT ............................... //

<script>
// @ is an alias to /src
import HelloWorld2 from "@/components/HelloWorld.vue";

export default {
  name: "AboutView",
  components: {
    HelloWorld2,
  },
};
</script>
