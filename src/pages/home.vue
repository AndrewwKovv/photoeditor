<template>
  <div>
    <div class="content">
      <Sidebar
        v-model:activeTool="activeTool"
        @image-selected="handleImageSelected"
      />
      <ImageCanvas
        :activeTool="activeTool"
        :selectedImage="selectedImage"
        @color-selected="handleColorSelected"
      />
    </div>
  </div>
</template>

<script>
import ImageCanvas from "../components/ImageCanvas.vue";
import Sidebar from "../components/Sidebar.vue";

export default {
  name: "HomePage",
  components: {
    ImageCanvas,
    Sidebar,
  },
  data() {
    return {
      activeTool: "",
      selectedImage: null,
      selectedColor: null,
    };
  },
  methods: {
    handleImageSelected(imageData) {
      this.selectedImage = imageData;
    },
    handleColorSelected(colorData) {
      this.selectedColor = colorData;
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  background-color: #383838;
}
</style>
