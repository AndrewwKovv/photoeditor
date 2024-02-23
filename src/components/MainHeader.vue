<template>
  <header class="header">
    <h3>{{ title }}</h3>
  </header>
</template>

<script>
export default {
  name: "main-header",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #535353;
  color: #ccc;
  padding: 15px;
  text-align: center;
  max-height: 55px;
}
</style>
