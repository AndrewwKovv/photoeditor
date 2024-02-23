<template>
  <div>
    <div class="upload__cont">
      <img
        src="../assets/icons/upload.png"
        alt="Upload"
        class="file-upload-button"
        @click="openFileInput"
      />
      <input
        ref="fileInput"
        id="file-upload"
        type="file"
        accept="image/*"
        @change="handleFileUpload"
        style="display: none"
      />
      <div class="url-upload-container">
        <input
          id="image-url"
          type="text"
          v-model="imageUrl"
          placeholder="Введите URL изображения"
        />
        <button @click="loadImageFromUrl">Загрузить</button>
      </div>
    </div>

    <div class="canvas-container">
      <div class="workspace">
        <canvas
          ref="canvas"
          class="canvas"
          :width="canvasWidth"
          :height="canvasHeight"
          style="border: 1px solid black"
        ></canvas>
      </div>
    </div>
    <div class="info-container">
      <div v-if="imageWidth && imageHeight" class="image-info">
        Размер картинки: {{ imageWidth }}px x {{ imageHeight }}px;
      </div>
      <div v-if="selectedColor" class="color-info">
        RGB({{ selectedColor.r }}, {{ selectedColor.g }}, {{ selectedColor.b }})
        <div
          class="color-preview"
          :style="{
            backgroundColor: `rgb(${selectedColor.r},${selectedColor.g},${selectedColor.b})`,
          }"
        ></div>
        на ({{ selectedPixel.x }}, {{ selectedPixel.y }})
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageCanvas",
  data() {
    return {
      canvasWidth: 800,
      canvasHeight: 400,
      imageWidth: 0,
      imageHeight: 0,
      selectedColor: null,
      selectedPixel: { x: 0, y: 0 },
      imageUrl: "",
    };
  },
  props: {
    activeTool: String,
  },
  mounted() {
    // обработчик клика на холсте
    const canvas = this.$refs.canvas;
    canvas.addEventListener("click", this.handleCanvasClick);
  },
  methods: {
    handleFileUpload(event) {
      // Обработчик загрузки файла изображения
      const file = event.target.files[0];
      this.renderImage(file);
    },
    loadImageFromUrl() {
      if (this.imageUrl.trim() !== "") {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Устанавливаем заголовок для избежания ошибки безопасности
        img.onload = () => {
          const canvas = this.$refs.canvas;
          const canvasContext = canvas.getContext("2d");
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;
          canvasContext.drawImage(img, x, y, newWidth, newHeight);
          this.imageWidth = img.width;
          this.imageHeight = img.height;
        };
        img.src = this.imageUrl;
      }
    },
    renderImage(file) {
      // Метод для отображения изображения на холсте
      const reader = new FileReader(); // Создаем объект для чтения файла
      reader.onload = async () => {
        const img = new Image(); // Создаем новый элемент изображения
        img.onload = async () => {
          const canvas = this.$refs.canvas; // Получаем холст
          const canvasContext = canvas.getContext("2d"); // Получаем контекст рисования на холсте

          // Очищаем холст перед отрисовкой нового изображения
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);

          // Вычисляем масштаб для отображения изображения на холсте
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );

          // Вычисляем новые размеры изображения
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;

          // Вычисляем координаты для отображения изображения по центру холста
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;

          // Отрисовываем изображение на холсте
          canvasContext.drawImage(img, x, y, newWidth, newHeight);

          // Устанавливаем ширину и высоту изображения
          this.imageWidth = img.width;
          this.imageHeight = img.height;
        };
        img.src = reader.result; // Устанавливаем источник изображения
      };
      reader.readAsDataURL(file);
    },
    handleCanvasClick(event) {
      // возвращаем размер элемента и его позицию
      const canvasRect = this.$refs.canvas.getBoundingClientRect();

      if (this.activeTool === "Пипетка") {
        const x = Math.round(event.clientX - canvasRect.left);
        const y = Math.round(event.clientY - canvasRect.top);
        this.selectedPixel = { x, y };
        this.updateSelectedColor();
      }
    },
    updateSelectedColor() {
      const x = this.selectedPixel.x;
      const y = this.selectedPixel.y;
      const canvasContext = this.$refs.canvas.getContext("2d");
      const pixelData = canvasContext.getImageData(x, y, 1, 1).data;
      const r = pixelData[0];
      const g = pixelData[1];
      const b = pixelData[2];
      this.selectedColor = { r, g, b };
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
  },
};
</script>

<style scoped>
.canvas-container {
  margin: 60px 40px;
}
.info-container {
  display: flex;
  gap: 15px;
}
.upload__cont {
  display: flex;
  align-items: center;
}
.url-upload-container {
  display: flex;
  gap: 10px;
}
.color-info,
.image-info {
  margin-top: 10px;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}
.color-preview {
  width: 16px;
  height: 16px;
}

.file-upload-button {
  cursor: pointer;
  background-color: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 3px;
  width: 36px;
  height: 36px;
  margin: 10px;
}

input[type="file"] {
  display: none;
}
</style>
