<template>
  <div class="footer">
    <div v-if="imageWidth && imageHeight" class="image-info">
      Размер: {{ imageWidth }}px x {{ imageHeight }}px;
    </div>
    <div v-if="selectedColor" class="color-info">
      RGB ({{ selectedColor.r }}, {{ selectedColor.g }}, {{ selectedColor.b }})
      <div
        class="color-preview"
        :style="{
          backgroundColor: `rgb(${selectedColor.r},${selectedColor.g},${selectedColor.b})`,
        }"
      ></div>
      Координаты ({{ selectedPixel.x }}; {{ selectedPixel.y }})
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageFooter",
  props: {
    imageWidth: Number,
    imageHeight: Number,
    selectedColor: Object,
    selectedPixel: Object,
  },
};
</script>

<style scoped>
.footer {
  background-color: #535353;
  color: white;
  height: 20px;
  display: flex;
  gap: 15px;
}

.image-info,
.color-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.color-preview {
  width: 16px;
  height: 16px;
}
</style>
