<template>
  <div class="canvas-container">
    <canvas class="canvas-editor" ref="canvas"></canvas>
    <ImageFooter
      :imageWidth="imageWidth"
      :imageHeight="imageHeight"
      :selectedColor="selectedColor"
      :selectedPixel="selectedPixel"
      :activeTool="activeTool"
      :selectedScale="selectedScale"
      @scale-change="handleScaleChange"
    />
  </div>
</template>

<script>
import ImageFooter from "./ImageFooter.vue";
import { watch } from "vue";

export default {
  name: "ImageCanvas",
  components: {
    ImageFooter,
  },
  data() {
    return {
      imageWidth: 0,
      imageHeight: 0,
      selectedColor: null,
      selectedPixel: { x: 0, y: 0 },
      imageUrl: "",
      canvasRef: null,
      selectedScale: 100,
    };
  },
  props: {
    activeTool: String,
    selectedImage: String,
  },
  mounted() {
    this.canvasRef = this.$refs.canvas;
    this.canvasRef.addEventListener("click", this.handleCanvasClick);
    this.setupImageWatcher();
  },
  methods: {
    setupImageWatcher() {
      watch(
        () => this.selectedImage,
        (imageData) => {
          if (imageData) {
            this.renderImage(imageData);
          }
        }
      );
    },
    renderImage(imageUrl) {
      const img = new Image();
      const canvas = this.$refs.canvas;
      const ctx = this.canvasRef?.getContext("2d");
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = this.canvasRef.clientWidth;
        canvas.height = this.canvasRef.clientHeight;
        const scaleFactor = this.selectedScale / 100; // масштабный коэффициент

        const scaledWidth = img.width * scaleFactor;
        const scaledHeight = img.height * scaleFactor;

        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        this.imageWidth = scaledWidth; // обновление ширины изображения
        this.imageHeight = scaledHeight; // обновление высоты изображения
      };
      img.src = imageUrl;
    },
    handleCanvasClick(event) {
      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      const canvasOffsetX = (this.canvasRef.clientWidth - this.imageWidth) / 2;
      const canvasOffsetY =
        (this.canvasRef.clientHeight - this.imageHeight) / 2;

      if (this.activeTool === "Пипетка") {
        const x = Math.round(event.clientX - canvasRect.left - canvasOffsetX);
        const y = Math.round(event.clientY - canvasRect.top - canvasOffsetY);
        this.selectedPixel = { x, y };
        this.updateSelectedColor();
      }
    },

    updateSelectedColor() {
      const x = this.selectedPixel.x;
      const y = this.selectedPixel.y;

      // Координаты относительно изображения
      const imageX = x + (this.canvasRef.clientWidth - this.imageWidth) / 2;
      const imageY = y + (this.canvasRef.clientHeight - this.imageHeight) / 2;

      const ctx = this.canvasRef.getContext("2d");
      const pixelData = ctx.getImageData(imageX, imageY, 1, 1).data;
      const r = pixelData[0];
      const g = pixelData[1];
      const b = pixelData[2];
      this.selectedColor = { r, g, b };
    },
    handleScaleChange(scale) {
      this.selectedScale = scale;
      console.log(this.selectedScale);
      this.renderImage(this.selectedImage); // перерисовываем изображение с новым масштабом
    },
  },
};
</script>

<style scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  flex: 1;
}
.canvas-editor {
  height: calc(100% - 25px);
}
</style>
