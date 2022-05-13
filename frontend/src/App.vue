<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/posts">Posts</router-link>
    </nav>
    <router-view />
    <nav>
      <router-link to="/">RGPD</router-link>
      <router-link to="/about">Règlement interne</router-link>
      <router-link to="/posts">Nous contacter</router-link>
    </nav>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 20px 50px;
  /* margin: 20px;
  justify-content: space-around; */
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 20px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
