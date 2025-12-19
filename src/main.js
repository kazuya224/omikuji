const results = ["大吉", "中吉", "小吉", "吉", "凶"];

const button = document.getElementById("draw");
const resultEl = document.getElementById("result");

button.addEventListener("click", () => {
  const index = Math.floor(Math.random() * results.length);
  resultEl.textContent = results[index];
});
