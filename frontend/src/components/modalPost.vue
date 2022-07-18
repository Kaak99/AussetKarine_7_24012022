//! ............................... TEMPLATE ............................... //

<template>
  <!-- <div class="container">  </div> -->
  <div class="bloc-modale">
    <div class="overlay">
      <div class="btn-modale">x</div>
      <h2>Le contenu de la modale {{ revele }}</h2>
      <p>hellomodale {{ toggleModal }}</p>
    </div>
  </div>
</template>

//! ............................... SCRIPT ............................... //

<script>
export default {
  name: "modalPost",
  props: {
    revele: Boolean,
    toggleModal: String,
  },
};
</script>

//! ............................... STYLE ............................... //
<style scoped>
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
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modale {
  background: #f1f1f1f1;
  color: #333;
  padding: 50px;
  position: fixed;
  bottom: 10%;
}
.btn-modale {
  top: 10%;
}
</style>
