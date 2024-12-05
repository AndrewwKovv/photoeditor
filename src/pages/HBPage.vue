<template>
  <div>
    <div class="input-container">
      <input v-model="inputCode" placeholder="Введите код" />
      <button @click="checkCode">Проверить</button>
    </div>

    <div v-if="showWords" class="words-container">
      <div
        v-for="(word, index) in shuffledWords"
        :key="index"
        :style="randomPosition()"
        class="word"
      >
        {{ word }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "CodeChecker",
  setup() {
    const inputCode = ref("");
    const correctCode = "hBKat";
    const showWords = ref(false);
    const words = ["Окно", "Шторы", "Лампа", "Стул", "Диван", "Цветок"];
    const shuffledWords = ref<string[]>([]);

    const checkCode = () => {
      if (inputCode.value === correctCode) {
        showWords.value = true;
        shuffledWords.value = shuffleArray(words);
      } else {
        alert("Неверный код! Попробуйте снова.");
      }
    };

    const shuffleArray = (array: string[]): string[] => {
      return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    };

    const randomPosition = () => {
      const x = Math.random() * 80 + 10; // Random position between 10% and 90%
      const y = Math.random() * 80 + 10; // Random position between 10% and 90%
      return {
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
      };
    };

    return {
      inputCode,
      correctCode,
      showWords,
      words,
      shuffledWords,
      checkCode,
      randomPosition,
    };
  },
});
</script>

<style scoped>
.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.words-container {
  position: relative;
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  overflow: hidden;
}

.word {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  transform: translate(-50%, -50%);
}
</style>
