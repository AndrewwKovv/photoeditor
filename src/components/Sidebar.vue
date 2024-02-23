<template>
  <aside class="sidebar">
    <div
      v-for="tool in tools"
      :key="tool.id"
      @click="toggleToolActivation(tool)"
      :class="{ active: activeTool === tool.name }"
    >
      <img
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
  </aside>
</template>

<script>
export default {
  name: "sidebar-menu",
  props: {
    activeTool: String,
  },
  data() {
    return {
      tools: [
        {
          id: 1,
          name: "Пипетка",
          icon: require("../assets/icons/pipetka.png"),
        },
      ],
      showTooltipFlag: false,
      currentTool: "",
    };
  },
  methods: {
    toggleToolActivation(tool) {
      this.$emit(
        "update:activeTool",
        this.activeTool === tool.name ? "" : tool.name
      );
    },
    showTooltip(toolName) {
      this.showTooltipFlag = true;
      this.currentTool = toolName;
    },
    hideTooltip() {
      this.showTooltipFlag = false;
      this.currentTool = "";
    },
  },
};
</script>

<style scoped>
.sidebar {
  min-width: 55px;
  background-color: #535353;
  padding: 10px;
  height: calc(100vh - 55px);
}
.sidebar div {
  cursor: pointer;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 3px;
  border: solid 1px white;
  background-color: #535353;
  position: relative;
}
.sidebar div img {
  width: 24px;
}
.tooltip {
  position: absolute;
  background-color: #fff;
  color: grey;
  border: solid 1px;
  border-radius: 3px;
  padding: 2px;
  left: 100%;
  transform: translateX(-50%);
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
</style>
