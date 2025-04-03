/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";
export default {
  content: [
    "./page/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  // 插件
  plugins: [
    forms({
      strategy: "class", // 使用类策略，只在添加了特定类名的元素上应用样式
    }),
  ],
};
