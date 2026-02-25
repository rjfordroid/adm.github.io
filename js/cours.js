   // Chaje Kou yo (COURE)
db.ref('RJFORDROID/COURE')
.limitToLast(100)
.on('value', (snapshot) => {

    const coures = snapshot.val();
    const container = document.getElementById('courseList');
    container.innerHTML = '';

    if (!coures) return;

    let html = '';

    for (let id in coures) {
        const c = coures[id];
        const articleUrl = `https://rjfordroid.netlify.app/article/${id}`;
        const whatsappLink = `whatsapp://send/?text=${encodeURIComponent(articleUrl)}`;

        html += `
        <div style="background:#f8fafc;padding:20px;border-radius:10px;margin-bottom:15px;">
            <h3>${c.NomCours}</h3>
            <p>${c.DesCours}</p>
            <small>${new Date(c.dateCreation).toLocaleDateString()}</small>
            <div style="margin-top:10px;">
                <a href="${whatsappLink}" style="padding:8px 12px;background:#2563eb;color:white;border-radius:6px;text-decoration:none;">
                    📲 WhatsApp
                </a>
            </div>
        </div>`;
    }

    container.innerHTML = html;
});


function shareArticle(url) {
    if (navigator.share) {
        navigator.share({
            title: 'Atik RJFORDROID',
            url: url
        });
    } else {
        const wa = "https://wa.me/?text=" + encodeURIComponent(url);
        window.open(wa, "_blank");
    }
}