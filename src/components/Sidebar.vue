<template>
  <aside class="sidebar">
    <div @click="openModalUpload">
      <img
        src="../assets/icons/Icon/W95-60.png"
        alt="Upload"
        class="file-upload-icon"
      />
    </div>
    <div
      v-for="tool in tools"
      :key="tool.id"
      @click="toggleToolActivation(tool)"
      :class="{ active: activeTool === tool.name }"
    >
      <img
        class="tool__icon"
        :src="tool.icon"
        :alt="tool.name"
        @mouseover="showTooltip(tool.name)"
        @mouseleave="hideTooltip"
      />
      <span
        class="tooltip"
        v-if="showTooltipFlag && currentTool === tool.name"
        >{{ tool.name }}</span
      >
    </div>
    <div @click="saveImage">
      <img
        src="../assets/icons/Icon/W95-139.png"
        alt="Save images"
        title="Скачать изображение"
        class="file-upload-icon"
      />
    </div>
  </aside>
  <div v-if="isModalVisible" @click="closeModal" class="modal">
    <div class="modal-content" @click.stop>
      <div class="upload__cont">
        <img
          src="../assets/icons/Icon/W95-59.png"
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
    </div>
  </div>
</template>

<script>
export default {
  name: "sidebar-menu",
  emits: [
    "imageSelected",
    "update:activeTool",
    "image-selected",
    "openResizeModal",
  ],
  props: {
    activeTool: String,
  },
  data() {
    return {
      tools: [
        {
          id: 1,
          name: "Пипетка",
          icon: require("../assets/icons/Icon/W95-63.png"),
        },
        {
          id: 2,
          name: "Изменение размера",
          icon: require("../assets/icons/Icon/W95-82.png"),
        },
        {
          id: 3,
          name: "Рука",
          icon: require("../assets/icons/Icon/W95-104.png"),
        },
        {
          id: 4,
          name: "Кривые",
          icon: require("../assets/icons/Icon/W95-78.png"),
        },
      ],
      showTooltipFlag: false,
      currentTool: "",
      isModalVisible: false,
      imageUrl: "",
    };
  },
  methods: {
    toggleToolActivation(tool) {
      this.$emit(
        "update:activeTool",
        this.activeTool === tool.name ? "" : tool.name
      );
      if (tool.name === "Изменение размера") {
        this.$emit("openResizeModal");
      }
    },
    showTooltip(toolName) {
      this.showTooltipFlag = true;
      this.currentTool = toolName;
    },
    hideTooltip() {
      this.showTooltipFlag = false;
      this.currentTool = "";
    },
    openModalUpload() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const target = event.target;
      const selectedFile = target.files?.[0];

      if (selectedFile) {
        const imageUrl = URL.createObjectURL(selectedFile);
        this.selectedImage = imageUrl;
        this.$emit("image-selected", imageUrl);

        target.value = "";
      }
      this.closeModal();
    },
    loadImageFromUrl() {
      this.$emit("image-selected", this.imageUrl);
      this.selectedImage = this.imageUrl;
      this.imageUrl = "";
      this.closeModal();
    },
    saveImage() {
      this.$emit("save-image");
    },
  },
  beforeUnmount() {
    if (this.selectedImage) {
      URL.revokeObjectURL(this.selectedImage);
    }
  },
};
</script>

<style scoped>
.sidebar {
  min-width: 55px;
  background-color: #535353;
  padding: 10px;
  height: 100vh;
}

.sidebar div {
  cursor: pointer;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 3px;
  border: solid 1px white;
  background-color: #535353;
  position: relative;
  width: 35px;
  height: 35px;
}

.tooltip {
  position: absolute;
  background-color: #fff;
  color: grey;
  border: solid 1px;
  border-radius: 3px;
  padding: 2px;
  left: 100%;
  transform: translateX(-10%);
  white-space: nowrap;
  display: none;
  z-index: 999;
}

.sidebar div:hover .tooltip {
  display: block;
}

.sidebar div.active {
  background-color: #383838;
}
.modal {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  position: fixed;
  display: flex;
}

.modal-content {
  background-color: #535353;
  width: 350px;
  height: 100px;
  border-radius: 10px;
  margin: auto;
  padding: 20px;
}
.tool__icon {
  width: 23px;
  height: 21px;
}
.upload__cont {
  display: flex;
  align-items: center;
}

.url-upload-container {
  display: flex;
  gap: 10px;
}

.url-upload-container input[type="text"] {
  flex: 1;
}

.url-upload-container button {
  cursor: pointer;
}

.file-upload-button {
  cursor: pointer;
  background-color: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 3px;
  width: 36px;
  height: 36px;
  padding: 5px;
  margin: 10px;
}
.file-upload-icon {
  height: 20.84px;
}
input[type="file"] {
  display: none;
}
</style>
