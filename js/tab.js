
  document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");

            // 1. Retire klas 'active' nan tout bouton
            tabButtons.forEach(b => b.classList.remove("active"));
            // 2. Retire klas 'active' nan tout kontni
            tabContents.forEach(c => c.classList.remove("active"));

            // 3. Ajoute 'active' sou bouton ki klike a epi sou kontni ki koresponn lan
            btn.classList.add("active");
            document.getElementById(target).classList.add("active");
        });
    });
});
