import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      // чтобы импорты вида "@/utils/date" работали в тестах так же, как в Next
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node", // DOM не нужен, мы тестируем обычные функции
  },
});
