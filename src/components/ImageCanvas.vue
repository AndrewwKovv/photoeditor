<template>
  <div class="canvas-container">
    <canvas id="canvas" class="canvas-editor" ref="canvas"></canvas>

    <ImageFooter
      :imageWidth="imageWidth"
      :imageHeight="imageHeight"
      :selectedColor="selectedColor"
      :selectedPixel="selectedPixel"
      :activeTool="activeTool"
      :selectedScale="selectedScale"
      @scale-change="handleScaleChange"
    />

    <div v-if="isModalVisible" class="modal">
      <div class="modal-content modal-content__wrapper" @click.stop>
        <h2>Изменение размера изображения</h2>
        <div class="modal-content__item">
          <label for="resize-type">Тип изменения:</label>
          <select
            v-model="resizeType"
            id="resize-type"
            class="transparent-input"
          >
            <option value="percent">Проценты</option>
            <option value="pixels">Пиксели</option>
          </select>
        </div>
        <div class="modal-content__item">
          <label for="width">Ширина:</label>
          <input
            type="number"
            v-model.number="newWidth"
            id="width"
            min="1"
            class="transparent-input"
          />
        </div>
        <div class="modal-content__item">
          <label for="height">Высота:</label>
          <input
            type="number"
            v-model.number="newHeight"
            id="height"
            min="1"
            class="transparent-input"
          />
        </div>
        <div class="modal-content__item">
          <p>
            Общее количество пикселей до изменения размера:
            {{ (imageWidth * imageHeight) / 1000000 }} мегапикселей
          </p>
          <p>
            Общее количество пикселей после изменения размера:
            {{
              ((newWidth || imageWidth) * (newHeight || imageHeight)) / 1000000
            }}
            мегапикселей
          </p>
        </div>
        <div class="modal-content__item modal-content__ratio">
          <label class="modal-content__ratio-btn" for="maintain-aspect-ratio">
            <input
              type="checkbox"
              id="maintain-aspect-ratio"
              v-model="maintainAspectRatio"
            />
            Сохранить пропорции
          </label>
        </div>
        <div class="modal-content__item">
          <label for="interpolation-algorithm">Алгоритм интерполяции:</label>
          <select
            v-model="interpolationAlgorithm"
            id="interpolation-algorithm"
            class="transparent-input"
          >
            <option value="nearest-neighbor">Ближайший сосед</option>
          </select>
          <span class="tooltip"
            >Алгоритм ближайшего соседа используется для изменения размера
            изображения путем выбора цвета пикселя из оригинального изображения,
            наиболее близкого к центру пикселя в новом изображении.</span
          >
        </div>
        <div class="modal-content__item modal-content__button">
          <button @click="resizeImage">Изменить размер</button>
          <button @click="closeResizeModal">Отмена</button>
        </div>
      </div>
    </div>
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
  emits: ["closeResizeModal"],
  data() {
    return {
      imageWidth: 0,
      imageHeight: 0,
      selectedColor: null,
      selectedPixel: { x: 0, y: 0 },
      imageUrl: "",
      canvasRef: null,
      selectedScale: 100,
      isModalVisible: this.isResizeModalVisible,
      interpolationAlgorithm: "nearest-neighbor",
      resizeType: "percent", // Добавлено объявление переменной для типа изменения
      newWidth: null, // Добавлено объявление переменной для новой ширины
      newHeight: null, // Добавлено объявление переменной для новой высоты
      maintainAspectRatio: false,
      aspectRatio: 1,
    };
  },
  props: {
    activeTool: String,
    selectedImage: String,
    isResizeModalVisible: Boolean,
  },
  mounted() {
    this.canvasRef = this.$refs.canvas;
    this.canvasRef.addEventListener("click", this.handleCanvasClick);
    this.setupImageWatcher();
  },
  watch: {
    isResizeModalVisible(newValue) {
      this.isModalVisible = newValue;
    },
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
      this.renderImage(this.selectedImage);
    },
    closeResizeModal() {
      this.isModalVisible = false;
      this.$emit("closeResizeModal");
    },
    resizeImage() {
      let newWidth = this.newWidth;
      let newHeight = this.newHeight;

      // Проверка сохранения пропорций
      if (this.maintainAspectRatio) {
        const aspectRatio = this.imageWidth / this.imageHeight;
        if (newWidth && newHeight) {
          if (newWidth !== Math.round(newHeight * aspectRatio)) {
            // Если ширина не соответствует пропорции, то пересчитываем высоту
            newHeight = Math.round(newWidth / aspectRatio);
          } else if (newHeight !== Math.round(newWidth / aspectRatio)) {
            // Если высота не соответствует пропорции, то пересчитываем ширину
            newWidth = Math.round(newHeight * aspectRatio);
          }
        } else if (newWidth) {
          newHeight = Math.round(newWidth / aspectRatio);
        } else if (newHeight) {
          newWidth = Math.round(newHeight * aspectRatio);
        }
      }

      // Обработка изменения размера изображения
      console.log("New Width:", newWidth);
      console.log("New Height:", newHeight);
      // Закрыть модальное окно после изменения размера
      this.closeResizeModal();
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

/* Добавленные стили для модального окна изменения размера */

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Прозрачный черный фон */
  z-index: 1000;
}

.transparent-input {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #fff;
  background-color: transparent;
  color: #fff;
  border-radius: 5px;
}

.transparent-input:focus {
  outline: none;
}

.modal-content__wrapper {
  background-color: rgba(83, 83, 83, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  max-width: 570px;
  width: 100%;
  color: #fff;
}

.modal-content__item {
  margin-bottom: 15px;
}

.modal-content__ratio {
  display: flex;
  align-items: center;
}
.modal-content__ratio .modal-content__ratio-btn {
  display: flex;
  align-items: center;
}
.modal-content__ratio .modal-content__ratio-btn input[type="checkbox"] {
  margin-right: 5px;
  flex-shrink: 0;
}

.modal-content__button {
  display: flex;
  justify-content: space-around;
}

.modal-content__button button {
  padding: 10px 20px;
  border: 1px solid #fff;
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s, border-color 0.3s;
}

.modal-content__button button:hover {
  background-color: #fff;
  color: #000;
}
</style>
