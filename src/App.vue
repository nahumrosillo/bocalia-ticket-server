<template>
  <div>
    <h1>¡Bienvenido a tu App con Electron y Vue!</h1>
    <nav>
      <ul>
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/about">Acerca de</router-link></li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 0;
}
nav ul li {
  display: inline;
}
</style>