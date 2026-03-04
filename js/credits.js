document.addEventListener("DOMContentLoaded", () => {
      const monthlyRadio = document.getElementById("billing-monthly");
      const yearlyRadio = document.getElementById("billing-yearly");

      function updatePrices(billing) {
        document.querySelectorAll(".price-amount[data-monthly]").forEach(el => {
          el.textContent = billing === "monthly" ? el.dataset.monthly : el.dataset.yearly;
        });
        document.querySelectorAll(".price-savings[data-monthly]").forEach(el => {
          el.textContent = billing === "monthly" ? el.dataset.monthly : el.dataset.yearly;
        });
      }

      monthlyRadio.addEventListener("change", () => updatePrices("monthly"));
      yearlyRadio.addEventListener("change", () => updatePrices("yearly"));
    });
