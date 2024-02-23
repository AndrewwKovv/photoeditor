<template>
  <div>
    <MainHeader :title="photoshopTitle" />
    <div class="content">
      <Sidebar v-model:activeTool="activeTool" />
      <ImageCanvas
        :activeTool="activeTool"
        @color-selected="handleColorSelected"
      />
    </div>
  </div>
</template>

<script>
import ImageCanvas from "../components/ImageCanvas.vue";
import MainHeader from "../components/MainHeader.vue";
import Sidebar from "../components/Sidebar.vue";

export default {
  name: "HomePage",
  components: {
    ImageCanvas,
    MainHeader,
    Sidebar,
  },
  data() {
    return {
      photoshopTitle: "Редактор Фото",
      activeTool: "",
      selectedColor: null,
    };
  },
  methods: {
    handleColorSelected(color) {
      this.selectedColor = color;
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
  background-color: #383838;
}
</style>
