  
        const adminList = document.getElementById("adminVideoList");
        const loginMessage = document.getElementById("loginMessage");


// ➕ Ajouter vidéo ak Planifikasyon

document.getElementById("addVideo").addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("description").value.trim();
    const url = document.getElementById("url").value.trim();
    const scheduleTime = document.getElementById("scheduleTime").value;
    
    if(!title || !url) {
        alert("Titre et URL obligatoires.");
        return;
    }
    
    let type = "mp4";
    if(url.includes("youtube.com") || url.includes("youtu.be")) type = "youtube";
    
    const newVideoRef = db.ref("videos").push();
    const videoKey = newVideoRef.key;

    // Kreye objè videyo a
    const videoData = {
        title: title,
        description: desc,
        url: url,
        type: type,
        date: Date.now(),
        likes: 0,
        views: 0,
        enLigne: false, // Toujou kòmanse false
        scheduledAt: scheduleTime || null 
    };

    try {
        await newVideoRef.set(videoData);

        if (scheduleTime) {
            // --- LOJIK PLANIFIKASYON ---
            const now = new Date();
            const [hours, minutes] = scheduleTime.split(':');
            const targetDate = new Date();
            targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            if (targetDate < now) {
                targetDate.setDate(targetDate.getDate() + 1);
            }

            const diff = targetDate.getTime() - now.getTime();

            setTimeout(() => {
                // Lè tan an rive, li mete sa a online epi koupe tout lòt yo
                setOnlyOneOnline(videoKey);
                console.log(`Vidéo "${title}" est maintenant en ligne !`);
            }, diff);

            alert(`Vidéo planifiée pour ${scheduleTime}. Elle coupera les autres à cette heure.`);
        } else {
            // Si pa gen planifikasyon, nou mete l online dirèkteman epi koupe rès yo
            setOnlyOneOnline(videoKey);
            alert("Vidéo ajoutée et mise en ligne !");
        }

        // Netwaye fòm nan
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("url").value = "";
        document.getElementById("scheduleTime").value = "";

    } catch (err) {
        alert("Erreur: " + err.message);
    }
});

// Asire w fonksyon yo aksesib nan HTML
window.toggleEnLigne = toggleEnLigne;


/**
 * Mete tout videyo offline, epi limen sèlman videyo ki gen ID sa a
 */
async function setOnlyOneOnline(targetVideoId) {
    try {
        // 1. Chache tout videyo yo
        const snapshot = await db.ref("videos").once("value");
        const updates = {};

        snapshot.forEach(child => {
            const vidId = child.key;
            // Si se videyo nou vle a, mete l true, sinon mete l false
            updates[`${vidId}/enLigne`] = (vidId === targetVideoId);
            
            // Si se sa n ap limen an, nou pwofite retire planifikasyon an
            if (vidId === targetVideoId) {
                updates[`${vidId}/scheduledAt`] = null;
            }
        });

        // 2. Voye tout chanjman yo an yon sèl fwa nan Firebase
        await db.ref("videos").update(updates);
        console.log("Mise à jour réussie : une seule vidéo en ligne.");
    } catch (err) {
        console.error("Erreur switch online:", err);
    }
}

        // Fonction pour mettre à jour le statut en ligne
function toggleEnLigne(id, currentStatus) {
    if (!currentStatus) {
        // Si nou vle mete l online, nou fè l vin sèl ki online
        setOnlyOneOnline(id);
    } else {
        // Si se koupe nou t ap koupe l, nou jis mete l false senp
        db.ref("videos/" + id).update({ enLigne: false });
    }
}


        // 📂 LISTE VIDEOS
// 📂 LISTE VIDEOS AK KÒMANTÈ
// Jwenn pati sa nan kòd ou a epi ranplase blòk la
db.ref("videos").orderByChild("date").on("value", snapshot => {
    adminList.innerHTML = "";
    snapshot.forEach(child => {
        const videoId = child.key;
        const video = child.val();
        const div = document.createElement("div");
        div.className = "admin-card";
        
        const enLigne = video.enLigne || false;
        const statusBadge = enLigne ? 
            '<span class="online-badge">● EN LIGNE</span>' : 
            '<span class="offline-badge">● HORS LIGNE</span>';
        
        // ✅ Tcheke si gen yon planifikasyon
        let scheduleInfo = "";
        if (!enLigne && video.scheduledAt) {
            scheduleInfo = `<p style="color: #00d4ff; font-size: 13px;">
                <i class="fa fa-clock"></i> Planifié pour : <strong>${video.scheduledAt}</strong>
            </p>`;
        }
        
        // Prepare seksyon kòmantè yo (pa chanje)
        let commentsHTML = `<div class="comment-admin-list"><strong>💬 Commentaires :</strong>`;
        // ... (rest kòd kòmantè a rete menm jan an)
        if (video.comments) {
            Object.keys(video.comments).forEach(commKey => {
                const c = video.comments[commKey];
                commentsHTML += `<div class="comment-item"><span><strong>${c.username || 'User'}:</strong> ${c.text}</span><button class="btn-del-comm" onclick="deleteComment('${videoId}', '${commKey}')">Supprimer</button></div>`;
            });
        } else { commentsHTML += `<p style="font-size:12px; color:gray;">Aucun commentaire.</p>`; }
        commentsHTML += `</div>`;

        div.innerHTML = `
            <h3>${video.title} ${statusBadge}</h3>
            ${scheduleInfo} <p>${video.description || ''}</p>
            <p>👁 ${video.views || 0} | ❤️ ${video.Applikes || 0}</p>
            <div class="button-group">
                <button class="${enLigne ? 'btn-offline' : 'btn-online'}" onclick="toggleEnLigne('${videoId}', ${enLigne})">
                    ${enLigne ? 'Mettre hors ligne' : 'Mettre en ligne'}
                </button>
                <button onclick="deleteVideo('${videoId}')" style="background: #ff3b3b;">Supprimer Vidéo</button>
            </div>
            ${commentsHTML}
        `;
        adminList.appendChild(div);
    });
});


// ❌ Siprime yon kòmantè espesifik
function deleteComment(videoId, commKey) {
    if(confirm("Voulez-vous supprimer ce commentaire ?")) {
        db.ref(`videos/${videoId}/comments/${commKey}`).remove()
          .then(() => console.log("Commentaire supprimé"))
          .catch(err => alert("Erreur: " + err.message));
    }
}

// Rann fonksyon an disponib globalman
window.deleteComment = deleteComment;

        // ❌ Supprimer vidéo
        function deleteVideo(id) {
            if(confirm("Supprimer cette vidéo ?")) {
                db.ref("videos/" + id).remove();
            }
        }

        // Rendre les fonctions disponibles globalement
        window.toggleEnLigne = toggleEnLigne;
        window.deleteVideo = deleteVideo;