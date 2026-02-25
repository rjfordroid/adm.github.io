function upload() {
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];
  if (!file) return alert("Aucun fichier sélectionné");

  const loader = document.getElementById("loader");
  loader.style.display = "inline-block";
  loader.textContent = "⏳ Upload en cours...";

  const reader = new FileReader();

  reader.onload = function () {
    const base64 = reader.result.split(",")[1];

    const formData = new FormData();
    formData.append("file", base64);
    formData.append("name", file.name);
    formData.append("type", file.type);

    fetch("https://script.google.com/macros/s/AKfycbxHjVBNTOlj6xBUp_fl-aVbPSFZRiMQB77_YIvFeB79uq2Hx9P_r7HADZTYj9WElsXkug/exec", {
      method: "POST",
      body: formData
    })
    .then(r => r.json())
    .then(res => {
      loader.style.display = "none";

      if (!res.success) {
        alert("Erreur : " + res.error);
        return;
      }

      const driveId = extractDriveId(res.url);

      

      // LOGIQUE CLÉ
      if (file.type.startsWith("image/")) {
        document.getElementById("image").value = driveId;
        alert("✅ Image uploadée, ID placé dans le champ IMAGE");
      } else if (file.type === "application/pdf") {
        document.getElementById("pdf").value = driveId;
        alert("✅ PDF uploadé, ID placé dans le champ PDF");
      } else {
        alert("⚠️ Type de fichier non supporté");
      }
    })
    .catch(err => {
      loader.style.display = "none";
      alert("Erreur réseau : " + err);
    });
  };

  reader.readAsDataURL(file);
}

function extractDriveId(url) {
  const match = url.match(/\/d\/([^\/]+)/);
  return match ? match[1] : "";
}