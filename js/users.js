
// Chaje Itilizatè yo (USERS)
// 1. Fonksyon pou chanje ròl la nan Firebase
function toggleAdmin(userId, currentStatus) {
    const newStatus = !currentStatus; // Si l te true l vin false, si l te false l vin true
    const confirmMsg = newStatus ? "Èske ou vle rann itilizatè sa a ADMIN?" : "Èske ou vle retire itilizatè sa a nan ròl ADMIN?";
    
    if (confirm(confirmMsg)) {
        db.ref('RJFORDROID/USERS/' + userId).update({
            isAdmin: newStatus
        }).then(() => {
            alert("Ròl la chanje ak siksè!");
        }).catch((error) => {
            alert("Erè: " + error.message);
        });
    }
}

// 2. Kòd ou a ak bouton an ajoute
// Fonksyon pou aktive mod edit la
function enableEdit(userId) {
    const card = document.getElementById('info-' + userId);
    const fields = card.querySelectorAll('.editable');
    const editBtn = document.getElementById('btn-edit-' + userId);
    const saveBtn = document.getElementById('btn-save-' + userId);

    fields.forEach(f => {
        f.contentEditable = "true";
        f.style.background = "#fff9c4"; // Ti koulè jòn pou konnen l ap edite
        f.style.padding = "2px 5px";
    });

    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
}

// Fonksyon pou sove modifikasyon yo
function saveUser(userId) {
    const card = document.getElementById('info-' + userId);
    const username = card.querySelector('.u-username').innerText;
    const phone = card.querySelector('.u-phone').innerText;
    const credits = card.querySelector('.u-credits').innerText;
    const password = card.querySelector('.u-pass').innerText;

    db.ref('RJFORDROID/USERS/' + userId).update({
        username: username,
        phone: phone,
        credits: parseInt(credits) || 0,
        password: password
    }).then(() => {
        // 1. Nou sispann mod edisyon an
        const fields = card.querySelectorAll('.editable');
        fields.forEach(f => {
            f.contentEditable = "false"; // Li pa editable ankò
            f.style.background = "transparent"; // Retire koulè jòn lan
            f.style.padding = "0"; // Remete padding la nòmal
        });

        // 2. Nou kache bouton Save la epi remontre bouton Edit la
        document.getElementById('btn-save-' + userId).style.display = "none";
        document.getElementById('btn-edit-' + userId).style.display = "inline-block";

        alert("Done yo sove ak siksè!");
    }).catch((error) => {
        alert("Erè nan sovgad: " + error.message);
    });
}


db.ref('RJFORDROID/USERS')
.limitToLast(200)
.on('value', (snapshot) => {

    const users = snapshot.val();
    const container = document.getElementById('userList');
    container.innerHTML = '';

    if (!users) return;

    const adminIDs = ['id-9xr24eisc-mk1z6b1a', 'id-r87druy2'];

    let html = '';

    for (let id in users) {
        const user = users[id];
        if (!user.email || !user.fullName) continue;

        const cleanID = id.trim().toLowerCase();
        const eskeSeAdmin = user.isAdmin === true || adminIDs.includes(cleanID);

        let progresyon = 0;
        if (user.mes_cours && user.mes_cours["Android-01"]) {
            progresyon = user.mes_cours["Android-01"].progression || 0;
        }

        const datKreyasyon = user.createdAt
            ? new Date(user.createdAt).toLocaleString('fr-FR')
            : 'Pa disponib';

        html += `
        <div class="user-card" data-user-id="card-${id}" style="border-left:5px solid ${eskeSeAdmin ? '#ef4444' : '#2563eb'};border-radius:8px;margin-bottom:20px;background:#fff;padding:15px;box-shadow:0 2px 5px rgba(0,0,0,0.1);position:relative;">
            <span style="background:${eskeSeAdmin ? '#fee2e2' : (progresyon === 100 ? '#dcfce7' : '#fef9c3')};color:${eskeSeAdmin ? '#991b1b' : '#166534'};padding:4px 8px;border-radius:12px;font-size:11px;font-weight:bold;float:right;">
                ${eskeSeAdmin ? '👑 ADMIN' : (progresyon === 100 ? '✅ FINI' : '📖 AN KOU')}
            </span>

            <div style="font-size:1.2em;font-weight:bold;color:#1e293b;">${user.fullName}</div>

            <div id="info-${id}" style="margin-top:10px;font-size:0.9em;line-height:1.6;">
                <p><strong>Username:</strong> <span class="editable u-username">${user.username}</span></p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Telefòn:</strong> <span class="editable u-phone">${user.phone || 'N/A'}</span></p>
                <hr>
                <p><strong>Modpas:</strong> <code class="editable u-pass">${user.password}</code></p>
                <p><strong>Kredi:</strong> <span class="editable u-credits">${user.credits || 0}</span> pts</p>
                <p><strong>Kreyasyon:</strong> ${datKreyasyon}</p>
                <p style="font-size:0.7rem;">ID: ${id}</p>
            </div>

            <div style="margin-top:15px;display:flex;justify-content:space-between;">
                <button onclick="deleteUser('${id}')">Efase</button>
                <div>
                    <button onclick="toggleAdmin('${id}', ${eskeSeAdmin})">
                        ${eskeSeAdmin ? 'Retire Admin' : 'Fè Admin'}
                    </button>
                    <button id="btn-edit-${id}" onclick="enableEdit('${id}')">Edit</button>
                    <button id="btn-save-${id}" onclick="saveUser('${id}')" style="display:none;">Save</button>
                </div>
            </div>
        </div>
        `;
    }

    container.innerHTML = html;
});

function deleteUser(userId) {
    // 1. Toujou mande konfimasyon anvan ou efase pou evite erè
    const konfimasyon = confirm("Èske ou sèten ou vle efase itilizatè sa a nèt?");
    
    if (konfimasyon) {
        console.log("Ap efase itilizatè:", userId);

        // 2. Aksyon pou efase nan Firebase
        db.ref('RJFORDROID/USERS/' + userId)
          .remove()
          .then(() => {
              // Sa ap parèt si tout bagay pase byen
              alert("Itilizatè a efase ak siksè!");
              console.log("SUPPRESSION OK:", userId);
          })
          .catch(err => {
              // Sa ap parèt si gen yon pwoblèm (pa egzanp: pèmisyon)
              alert("Erè: Ou pa gen dwa efase itilizatè sa a oswa gen yon pwoblèm rezo.");
              console.error("ERREUR DELETE:", err);
          });
    } else {
        console.log("Anile efasman an.");
    }
}