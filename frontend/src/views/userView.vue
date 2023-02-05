//! ............................... TEMPLATE ............................... //

<template>
  <div>
    <div class="users container" v-show="loading === true">
      <h1>La fiche du membre :</h1>
      <div class="OneUserContainer d-flex">
        <!--ici démarre la zone de user-->

        <div class="user">
          <p class="user-pseudo">{{ getApiResponse.pseudo }}</p>
          <img alt="avatar" class="avatar" v-bind:src="getApiResponse.avatar" />
          <p class="user-email">Adresse email : {{ getApiResponse.email }}</p>

          <p class="user-bio">{{ getApiResponse.bio }}</p>
          <p class="user-time">
            Profil créé le : {{ format(getApiResponse.time) }}
          </p>
        </div>
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
import dayjs from "dayjs";
export default {
  name: "usersView",
  data() {
    return {
      loading: false,
      getApiResponse: "",
      // url: "http://localhost:3000/api",
      url: `${process.env.VUE_APP_URL_SERVEUR}/api`,
      urlVue2: "https://fr.vuejs.org/v2/guide/installation.html",
      //oneUrl: "http://localhost:3000/api/user/{{getApiResponse.idUsers}}",
      oneUrl: `${process.env.VUE_APP_URL_SERVEUR}/api/user/{{getApiResponse.idUsers}}`,
      timeDayjs: [],
    };
  },
  created() {
    this.getOneUser();
  },
  methods: {
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
    format(maDate) {
      return dayjs(maDate).format("DD/MM/YYYY HH:mm");
    },
    getOneUser() {
      //console.log(this.$route.params.id);
      axios
        // axios.get(this.url).then((response) => (this.getApiResponse = response.data));
        .get(this.url + `/users/` + this.$route.params.id, this.configAxios())
        .then((response) => {
          this.getApiResponse = response.data[0];
          //console.log(this.getApiResponse);
          this.timeDayjs = dayjs(this.getApiResponse.time).format(
            "DD/MM/YYYY HH:mm"
          );
          this.loading = true;
        });
    },
  },
};
</script>

//! ............................... STYLE ............................... //

<style scoped>
* {
  padding: 8px 4px;
}
.main {
  padding-bottom: 10px;
}

.userContainer {
  padding: 10px;
  /* border: solid 1px blue; */
}

.user {
  padding: 5px;
  border: solid 2px red;
  box-shadow: 0px 0px 5px 1px #ff0000;
}
.user-pseudo {
  font-weight: bold;
  text-transform: uppercase;
}
.user-bio {
  /* white-space: pre; */
  white-space: pre-wrap;
  box-shadow: 0px 0px 2px 1px #ff0000;
}
.user-time {
  font-style: italic;
}

.avatar {
  width: 20%;
  max-width: 800px;
  min-width: 80px;
  max-height: 1000px;
  object-fit: contain;
}
</style>
