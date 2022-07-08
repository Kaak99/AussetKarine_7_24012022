//! ............................... TEMPLATE ............................... //

<template>
  <div class="containAll d-flex">
    <h1>On dirait que vous vous êtes perdu</h1>
    <h2 class="centerTxt erreur404">... Erreur 404 ...</h2>
    <img
      class="404 fnaf"
      src="../assets/img/fnaf1desk.webp"
      alt="typical fnaf"
    />
    <br />
    <h2 class="centerTxt">Vous ne devriez pas rester ici</h2>
    <router-link to="/" class="home">Je veux rentrer à la maison</router-link>
  </div>
</template>

//! ............................... SCRIPT ............................... //

<script></script>

//! ............................... STYLE ............................... //
<style></style>

<style scoped>
.main {
  padding-bottom: 10px;
}
img {
  transition: 1500ms ease-in-out;
}
img:hover {
  filter: blur(8px);
}
.home {
  margin-bottom: 40px;
  animation: apparition 3000ms infinite;
  color: #fd2d01;
}
@keyframes apparition {
  0% {
    opacity: 10%;
  }
  20% {
    opacity: 30%;
  }
  40% {
    opacity: 60%;
  }
  60% {
    opacity: 80%;
  }
  80% {
    opacity: 50%;
  }
  90% {
    opacity: 20%;
  }
  100% {
    opacity: 00%;
  }
}
/*glitch*/
h1 {
  animation: glitch1 2.5s infinite;
}

h1:nth-child(2) {
  color: #67f3da;
  animation: glitch2 2.5s infinite;
}

h1:nth-child(3) {
  color: #f16f6f;
  animation: glitch3 2.5s infinite;
}
/*Keyframes*/

@keyframes glitch1 {
  0% {
    transform: none;
    opacity: 1;
  }
  7% {
    transform: skew(-0.5deg, -0.9deg);
    opacity: 0.75;
  }
  10% {
    transform: none;
    opacity: 1;
  }
  27% {
    transform: none;
    opacity: 1;
  }
  30% {
    transform: skew(0.8deg, -0.1deg);
    opacity: 0.75;
  }
  35% {
    transform: none;
    opacity: 1;
  }
  52% {
    transform: none;
    opacity: 1;
  }
  55% {
    transform: skew(-1deg, 0.2deg);
    opacity: 0.75;
  }
  50% {
    transform: none;
    opacity: 1;
  }
  72% {
    transform: none;
    opacity: 1;
  }
  75% {
    transform: skew(0.4deg, 1deg);
    opacity: 0.75;
  }
  80% {
    transform: none;
    opacity: 1;
  }
  100% {
    transform: none;
    opacity: 1;
  }
}

@keyframes glitch2 {
  0% {
    transform: none;
    opacity: 0.25;
  }
  7% {
    transform: translate(-2px, -3px);
    opacity: 0.5;
  }
  10% {
    transform: none;
    opacity: 0.25;
  }
  27% {
    transform: none;
    opacity: 0.25;
  }
  30% {
    transform: translate(-5px, -2px);
    opacity: 0.5;
  }
  35% {
    transform: none;
    opacity: 0.25;
  }
  52% {
    transform: none;
    opacity: 0.25;
  }
  55% {
    transform: translate(-5px, -1px);
    opacity: 0.5;
  }
  50% {
    transform: none;
    opacity: 0.25;
  }
  72% {
    transform: none;
    opacity: 0.25;
  }
  75% {
    transform: translate(-2px, -6px);
    opacity: 0.5;
  }
  80% {
    transform: none;
    opacity: 0.25;
  }
  100% {
    transform: none;
    opacity: 0.25;
  }
}

@keyframes glitch3 {
  0% {
    transform: none;
    opacity: 0.25;
  }
  7% {
    transform: translate(2px, 3px);
    opacity: 0.5;
  }
  10% {
    transform: none;
    opacity: 0.25;
  }
  27% {
    transform: none;
    opacity: 0.25;
  }
  30% {
    transform: translate(5px, 2px);
    opacity: 0.5;
  }
  35% {
    transform: none;
    opacity: 0.25;
  }
  52% {
    transform: none;
    opacity: 0.25;
  }
  55% {
    transform: translate(5px, 1px);
    opacity: 0.5;
  }
  50% {
    transform: none;
    opacity: 0.25;
  }
  72% {
    transform: none;
    opacity: 0.25;
  }
  75% {
    transform: translate(2px, 6px);
    opacity: 0.5;
  }
  80% {
    transform: none;
    opacity: 0.25;
  }
  100% {
    transform: none;
    opacity: 0.25;
  }
}
</style>
