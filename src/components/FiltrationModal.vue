<template>
  <aside class="sidebar">
    <div class="panel-header">
      <button class="close-button" @click="closeSetting">
        <img src="@/assets/icons/crest.png" />
      </button>
    </div>
    <div class="input-fields">
      <select
        @change="applyPreset($event.target.value)"
        class="filtration-preset"
      >
        <option value="identity">Тождественное отображение</option>
        <option value="sharpen">Повышение резкости</option>
        <option value="gaussian">Фильтр Гаусса (3 на 3)</option>
        <option value="blur">Прямоугольное размытие</option>
      </select>
      <div class="input-fields-wrapper">
        <div class="filtration-inputs">
          <div class="point-inputs">
            <div
              v-for="(row, rowIndex) in kernel"
              class="point-inputs-column"
              :key="rowIndex"
            >
              <div
                v-for="(value, colIndex) in row"
                :key="colIndex"
                class="point-with-prefix"
              >
                <input
                  :value="kernel[rowIndex][colIndex]"
                  @change="(e) => updateKernel(e, rowIndex, colIndex)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="corrections-preview">
        <div class="custom-checkbox">
          <input type="checkbox" v-model="togglePreview" />
          <img
            v-if="togglePreview"
            src="../assets/icons/Icon/W95-89.png"
            alt="Предпросмотр"
            :class="{ 'preview-active': togglePreview }"
            style="width: 24px; height: 24px; cursor: pointer"
          />
          <img
            v-else
            src="../assets/icons/Icon/W95-89.png"
            alt="Предпросмотр"
            style="width: 24px; height: 24px; cursor: pointer"
          />
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="apply-button" @click="applyFiltration">Применить</button>
      <button class="reset-button" @click="resetValues">Сброс</button>
    </div>
  </aside>
</template>

<script>
import { watch } from "vue";

export default {
  name: "sidebar-filtration",

  props: {
    xMouse: Number,
    yMouse: Number,
    origImg: Object,
    ih: Number,
    iw: Number,
    canvasRef: Object,
  },
  data() {
    return {
      togglePreview: false,
      kernel: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    };
  },
  methods: {
    closeSetting() {
      this.$emit("closeSetting");
    },
    applyPreset(preset) {
      const kernels = {
        identity: [
          [0, 0, 0],
          [0, 1, 0],
          [0, 0, 0],
        ],
        sharpen: [
          [0, -1, 0],
          [-1, 5, -1],
          [0, -1, 0],
        ],
        gaussian: [
          [1, 2, 1],
          [2, 4, 2],
          [1, 2, 1],
        ],
        blur: [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
      };
      this.kernel = kernels[preset] || kernels.identity;
    },
    updateKernel(event, rowIndex, colIndex) {
      const num = +event.target.value;
      if (!isNaN(num)) {
        this.kernel[rowIndex][colIndex] = num;
      }
    },
    // Функция для применения фильтрации к изображению на основе заданного ядра
    calculateFiltration() {
      const ctx = this.canvasRef?.getContext("2d");
      if (!ctx) return;

      // Получение данных изображения из канваса
      const imageData = ctx.getImageData(
        this.xMouse,
        this.yMouse,
        this.iw,
        this.ih
      );
      // Создание нового массива для хранения отфильтрованных данных изображения
      const newData = new Uint8ClampedArray(imageData.data.length);
      // Получение дополненных данных изображения для обработки краевых пикселей
      const paddedData = this.padImageData(
        imageData.data,
        imageData.width,
        imageData.height
      );

      // Вычисление суммы всех элементов ядра (для нормализации)
      const kernelSum = this.kernel.flat().reduce((a, b) => a + b, 0) || 1;

      // Проход по каждому пикселю изображения
      for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
          let sumR = 0,
            sumG = 0,
            sumB = 0,
            sumA = 0;
          // Применение фильтра (свертка с ядром) к пикселям в окрестности
          for (let ky = 0; ky < 3; ky++) {
            for (let kx = 0; kx < 3; kx++) {
              const inputIndex =
                ((y + ky) * (imageData.width + 2) + (x + kx)) * 4;
              const weight = this.kernel[ky][kx];
              sumR += paddedData[inputIndex] * weight;
              sumG += paddedData[inputIndex + 1] * weight;
              sumB += paddedData[inputIndex + 2] * weight;
              sumA += paddedData[inputIndex + 3] * weight;
            }
          }
          const outputIndex = (y * imageData.width + x) * 4;
          newData[outputIndex] = sumR / kernelSum;
          newData[outputIndex + 1] = sumG / kernelSum;
          newData[outputIndex + 2] = sumB / kernelSum;
          newData[outputIndex + 3] = sumA / kernelSum;
        }
      }

      // Обновление данных изображения в канвасе
      imageData.data.set(newData);
      ctx.putImageData(imageData, this.xMouse, this.yMouse);
    },
    // Функция для дополнения данных изображения, чтобы избежать проблем с краевыми пикселями при свертке
    padImageData(data, width, height) {
      const paddedWidth = width + 2;
      const paddedHeight = height + 2;
      const paddedData = new Uint8ClampedArray(paddedWidth * paddedHeight * 4);

      // Копирование исходных данных изображения в центр дополненного массива
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const inputIndex = (y * width + x) * 4;
          const outputIndex = ((y + 1) * paddedWidth + x + 1) * 4;
          paddedData.set(
            data.subarray(inputIndex, inputIndex + 4),
            outputIndex
          );
        }
      }

      // Заполнение краев дополненного массива, копируя соседние пиксели
      for (let y = 0; y < paddedHeight; y++) {
        for (let x = 0; x < paddedWidth; x++) {
          const outputIndex = (y * paddedWidth + x) * 4;
          if (
            x === 0 ||
            x === paddedWidth - 1 ||
            y === 0 ||
            y === paddedHeight - 1
          ) {
            const nearestX = Math.max(1, Math.min(x, paddedWidth - 2));
            const nearestY = Math.max(1, Math.min(y, paddedHeight - 2));
            const nearestIndex = (nearestY * paddedWidth + nearestX) * 4;
            paddedData.set(
              paddedData.subarray(nearestIndex, nearestIndex + 4),
              outputIndex
            );
          }
        }
      }
      return paddedData;
    },
    resetValues() {
      this.applyPreset("identity");
      this.revertFiltration();
    },
    revertFiltration() {
      this.togglePreview = false;
      this.$emit("renderImage");
    },
    applyFiltration() {
      this.closeSetting();
      this.calculateFiltration();
    },
  },
  watch: {
    togglePreview(newVal) {
      if (newVal) {
        this.calculateFiltration();
      } else {
        this.revertFiltration();
      }
    },
    kernel: {
      handler() {
        if (this.togglePreview) {
          this.calculateFiltration();
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.sidebar {
  min-width: 220px;
  background-color: #535353;
  padding: 10px;
  height: calc(100vh - 25px);
  border-bottom: 2px solid #383838;
}
.panel-header {
  display: flex;
  justify-content: end;
}

.close-button {
  cursor: pointer;
  color: #fff;
  background: transparent;
  width: 24px;
  height: 24px;
}
.input-fields {
  margin-top: 20px;
}

.input-fields-wrapper {
  color: #fff;
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  border: 1px solid white;
  border-radius: 5px;
}
.input-fields-i {
  display: flex;
  max-width: 50px;
}
.filtration-content {
  display: flex;
  gap: 10px;
}
.filtration-inputs {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.point-inputs {
  display: flex;
  gap: 3px;
}
.point-inputs-column {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.point-with-prefix[type="input"] {
  position: relative;
  height: 20px;
  width: 28px;
  border-radius: 5px;
  padding-left: 5px;
}
.corrections-preview {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.preview-active {
  opacity: 0.6;
}
.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.apply-button,
.reset-button {
  background-color: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  padding: 5px 5px;
  cursor: pointer;
}

.apply-button:hover,
.reset-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.curve-chart {
  font-size: small;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

input {
  background-color: transparent;
  color: white;
  padding-left: 5px;
  width: 50px;
}

.custom-checkbox {
  position: relative;
  display: inline-block;
}
.checkbox-image {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
</style>
