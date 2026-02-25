var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b;
// --- Configuration Firebase ---
var firebaseConfig = {
    apiKey: "AIzaSyAQeHWr_vUiQmVVgJJ_cOF9qrCCLd7IJNc",
    authDomain: "ayiweb.firebaseapp.com",
    databaseURL: "https://ayiweb-default-rtdb.firebaseio.com",
    projectId: "ayiweb",
    storageBucket: "ayiweb.appspot.com",
    messagingSenderId: "115054504556",
    appId: "1:115054504556:web:ccd713ba01dd8f02830649"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
var db = firebase.database();
// --- DOM Elements ---
var lessonForm = document.getElementById("lessonForm");
var selectCours = document.getElementById("coursId");
var displayList = document.getElementById("displayList");
var courseForm = document.getElementById("courseForm");
var numeroInput = document.getElementById("numeroInput");
var lessonTitle = document.getElementById("lessonTitle");
var lessonUrl = document.getElementById("lessonUrl");
var submitLesson = document.getElementById("submitLesson");
var courseIdInput = document.getElementById("adfCoursId");
var courseNameInput = document.getElementById("courseName");
var courseDescInput = document.getElementById("courseDesc");
var courseCreditsInput = document.getElementById('courseCredit');
var submitCourseBtn = courseForm.querySelector('.btn-publish');
var cancelEditBtn = document.getElementById("cancelEditBtn");
// Nouveaux éléments pour TipTap
var tiptapEditor = document.getElementById("tiptap-editor");
var currentLessonKey = null;
var currentCourseId = null;
var editingCourseId = null;
var lessonContent = '';
// --- Fonctions pour TipTap ---
function updateLessonContent() {
    if (tiptapEditor) {
        lessonContent = tiptapEditor.innerHTML;
        // Sovgade otomatik nan localStorage
        localStorage.setItem('draftLesson', lessonContent);
    }
}
function formatText(command, options) {
    if (options === void 0) { options = null; }
    if (tiptapEditor) {
        document.execCommand(command, false, options);
        tiptapEditor.focus();
        updateLessonContent();
    }
}
function clearFormatting() {
    if (tiptapEditor) {
        document.execCommand('removeFormat');
        tiptapEditor.focus();
        updateLessonContent();
    }
}
function insertLink() {
    if (!tiptapEditor)
        return;
    var url = prompt('Antre URL la:', 'https://');
    if (url) {
        document.execCommand('createLink', false, url);
        tiptapEditor.focus();
        updateLessonContent();
    }
}
function getLessonContent() {
    return tiptapEditor ? tiptapEditor.innerHTML : '';
}
function setLessonContent(content) {
    if (tiptapEditor) {
        tiptapEditor.innerHTML = content;
        lessonContent = content;
    }
}
function clearEditor() {
    if (tiptapEditor) {
        tiptapEditor.innerHTML = '';
        lessonContent = '';
        localStorage.removeItem('draftLesson');
    }
}
function initTipTap() {
    if (!tiptapEditor)
        return;
    // Mete placeholder
    tiptapEditor.setAttribute('data-placeholder', 'Ekri leson an la...');
    // Gere placeholder
    tiptapEditor.addEventListener('focus', function () {
        if (this.innerHTML === '') {
            this.innerHTML = '';
        }
    });
    tiptapEditor.addEventListener('blur', function () {
        if (this.innerHTML === '') {
            this.innerHTML = '';
        }
    });
    // Mete kontni an chanjman
    tiptapEditor.addEventListener('input', updateLessonContent);
    // Gere shortcut klavye
    tiptapEditor.addEventListener('keydown', function (e) {
        // Ctrl+B pou gras
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            formatText('bold');
        }
        // Ctrl+I pou italik
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            formatText('italic');
        }
        // Ctrl+U pou souligne
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            formatText('underline');
        }
    });
    // Rekipere kontni depi localStorage (si egziste)
    var savedContent = localStorage.getItem('draftLesson');
    if (savedContent) {
        tiptapEditor.innerHTML = savedContent;
        lessonContent = savedContent;
    }
}
// --- Charger données ---
function chargerDonneesAdmin() {
    db.ref("RJFORDROID/COURE").on("value", function (snap) {
        var cours = snap.val() || {};
        // Mettre à jour la liste déroulante
        selectCours.innerHTML = '<option value="">Choisir un cours</option>';
        Object.keys(cours).forEach(function (courseId) {
            var course = cours[courseId];
            var opt = document.createElement("option");
            opt.value = courseId;
            opt.textContent = course.NomCours || courseId;
            selectCours.appendChild(opt);
        });
        // Mettre à jour l'affichage de la liste
        afficherListeCoursEtLecons(cours);
        // Mettre à jour le numéro automatique
        actualiserNumeroLecon(cours);
    });
}
// --- Afficher la liste des cours et leçons ---
function afficherListeCoursEtLecons(cours) {
    displayList.innerHTML = '';
    if (Object.keys(cours).length === 0) {
        displayList.innerHTML = '<div class="empty-message">Aucun cours disponible</div>';
        return;
    }
    Object.keys(cours).forEach(function (courseId) {
        var course = cours[courseId];
        var courseDiv = document.createElement("div");
        courseDiv.className = "course-item";
        // En-tête du cours avec boutons d'action
        var courseHeader = document.createElement("div");
        courseHeader.style.display = "flex";
        courseHeader.style.justifyContent = "space-between";
        courseHeader.style.alignItems = "center";
        courseHeader.style.marginBottom = "10px";
        var courseTitle = document.createElement("div");
        courseTitle.className = "course-title";
        courseTitle.textContent = course.NomCours || courseId;
        var courseActions = document.createElement("div");
        courseActions.className = "lesson-actions";
        var editCourseBtn = document.createElement("button");
        editCourseBtn.className = "btn-edit";
        editCourseBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editCourseBtn.style.marginRight = "5px";
        var deleteCourseBtn = document.createElement("button");
        deleteCourseBtn.className = "btn-delete";
        deleteCourseBtn.innerHTML = '<i class="fas fa-trash"></i>';
        editCourseBtn.addEventListener("click", function () {
            prepareEditCourse(courseId, course.NomCours || "", course.DesCours || "");
        });
        deleteCourseBtn.addEventListener("click", function () {
            deleteCourse(courseId);
        });
        courseActions.appendChild(editCourseBtn);
        courseActions.appendChild(deleteCourseBtn);
        courseHeader.appendChild(courseTitle);
        courseHeader.appendChild(courseActions);
        var lessonList = document.createElement("ul");
        lessonList.className = "lesson-list";
        if (course.lessons) {
            var lessons = Object.keys(course.lessons);
            if (lessons.length === 0) {
                var emptyLi = document.createElement("li");
                emptyLi.className = "empty-message";
                emptyLi.textContent = "Aucune leçon disponible";
                lessonList.appendChild(emptyLi);
            }
            else {
                // Trier les leçons par numéro
                var sortedLessons = lessons.sort(function (a, b) {
                    var numA = course.lessons[a].numero || 0;
                    var numB = course.lessons[b].numero || 0;
                    return numA - numB;
                });
                sortedLessons.forEach(function (lessonKey) {
                    var l = course.lessons[lessonKey];
                    var li = document.createElement("li");
                    li.className = "lesson-item";
                    var lessonInfo = document.createElement("div");
                    lessonInfo.className = "lesson-info";
                    var lessonNum = document.createElement("div");
                    lessonNum.className = "lesson-num";
                    lessonNum.textContent = l.numero ? l.numero.toString() : "0";
                    var lessonTitle = document.createElement("div");
                    lessonTitle.className = "lesson-title";
                    lessonTitle.textContent = l.titre || "Sans titre";
                    lessonInfo.appendChild(lessonNum);
                    lessonInfo.appendChild(lessonTitle);
                    var lessonActions = document.createElement("div");
                    lessonActions.className = "lesson-actions";
                    var editBtn = document.createElement("button");
                    editBtn.className = "btn-edit";
                    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
                    var deleteBtn = document.createElement("button");
                    deleteBtn.className = "btn-delete";
                    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    editBtn.addEventListener("click", function () {
                        prepareEditLesson(courseId, lessonKey, l.titre || "", l.url || "", l.contenuHtml || "", l.numero || 0);
                    });
                    deleteBtn.addEventListener("click", function () {
                        if (confirm("Voulez-vous vraiment supprimer \"".concat(l.titre, "\" ?"))) {
                            deleteLesson(courseId, lessonKey);
                        }
                    });
                    lessonActions.appendChild(editBtn);
                    lessonActions.appendChild(deleteBtn);
                    li.appendChild(lessonInfo);
                    li.appendChild(lessonActions);
                    lessonList.appendChild(li);
                });
            }
        }
        else {
            var emptyLi = document.createElement("li");
            emptyLi.className = "empty-message";
            emptyLi.textContent = "Aucune leçon disponible";
            lessonList.appendChild(emptyLi);
        }
        courseDiv.appendChild(courseHeader);
        courseDiv.appendChild(lessonList);
        displayList.appendChild(courseDiv);
    });
}
// --- Numéro auto (1-100) ---
function actualiserNumeroLecon(cours) {
    var id = selectCours.value;
    if (!id || !cours[id] || !cours[id].lessons) {
        numeroInput.value = "1";
        return;
    }
    // Récupérer tous les numéros existants
    var nums = Object.values(cours[id].lessons)
        .map(function (l) { return Number(l.numero); })
        .filter(function (n) { return !isNaN(n) && n >= 1 && n <= 100; });
    // Trouver le prochain numéro disponible entre 1 et 100
    var nextNum = 1;
    while (nums.includes(nextNum) && nextNum <= 100) {
        nextNum++;
    }
    // Si on dépasse 100, trouver le premier trou
    if (nextNum > 100) {
        for (var i = 1; i <= 100; i++) {
            if (!nums.includes(i)) {
                nextNum = i;
                break;
            }
        }
        // Si tous les numéros 1-100 sont utilisés
        if (nextNum > 100) {
            alert("Tous les numéros de 1 à 100 sont déjà utilisés pour ce cours!");
            nextNum = 101; // On met un numéro hors limite
        }
    }
    numeroInput.value = nextNum.toString();
}
// --- Préparer l'édition d'un cours ---
function prepareEditCourse(courseId, courseName, courseDesc) {
    editingCourseId = courseId;
    // Remplir le formulaire
    courseIdInput.value = courseId;
    courseIdInput.disabled = true; // On ne peut pas modifier l'ID
    courseNameInput.value = courseName;
    // Pou DIV contenteditable la, nou itilize innerHTML
    if (courseDescInput) {
        courseDescInput.innerHTML = courseDesc || "";
    }
    submitCourseBtn.textContent = "Modifier le cours";
    // Montre bouton Annuler
    if (cancelEditBtn) {
        cancelEditBtn.style.display = "block";
    }
    // Basculer vers l'onglet Cours
    var tabButtons = document.querySelectorAll(".tab-buttons button");
    if (tabButtons.length >= 1) {
        openTab('courseForm', tabButtons[0]);
    }
}
// --- Réinitialiser le formulaire cours ---
function resetCourseForm() {
    courseForm.reset();
    courseIdInput.disabled = false;
    editingCourseId = null;
    submitCourseBtn.textContent = "Ajouter le cours";
    // Vide DIV la
    if (courseDescInput) {
        courseDescInput.innerHTML = "";
    }
    // Kache bouton Annuler
    if (cancelEditBtn) {
        cancelEditBtn.style.display = "none";
    }
}
// --- Gestion du formulaire de cours ---
if (courseForm) {
    courseForm.addEventListener("submit", function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var courseId, courseName, credits, courseDesc, data, snapshot, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    courseId = courseIdInput.value;
                    courseName = courseNameInput.value;
                    credits = courseCreditsInput ? Number(courseCreditsInput.value) : 0;
                    courseDesc = courseDescInput ? courseDescInput.innerHTML : "";
                    if (!courseId || !courseName) {
                        alert("ID et Nom du cours sont obligatoires");
                        return [2 /*return*/];
                    }
                    data = {
                        NomCours: courseName,
                        DesCours: courseDesc,
                        credits: credits,
                        dateModification: new Date().toISOString()
                    };
                    // Si c'est une création, ajouter la date de création
                    if (!editingCourseId) {
                        data.dateCreation = new Date().toISOString();
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    if (!editingCourseId) return [3 /*break*/, 3];
                    // Mode édition
                    return [4 /*yield*/, db.ref("RJFORDROID/COURE/".concat(editingCourseId)).update(data)];
                case 2:
                    // Mode édition
                    _a.sent();
                    alert("Cours modifié avec succès!");
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, db.ref("RJFORDROID/COURE/".concat(courseId)).once("value")];
                case 4:
                    snapshot = _a.sent();
                    if (snapshot.exists()) {
                        alert("L'ID \"".concat(courseId, "\" est d\u00E9j\u00E0 utilis\u00E9! Veuillez choisir un autre ID."));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db.ref("RJFORDROID/COURE/".concat(courseId)).set(data)];
                case 5:
                    _a.sent();
                    alert("Cours ajouté avec succès!");
                    _a.label = 6;
                case 6:
                    resetCourseForm();
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error("Erreur sauvegarde cours:", error_1);
                    alert("Erreur lors de la sauvegarde du cours");
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
}
// --- Gestion du formulaire de leçon ---
lessonForm.addEventListener("submit", function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var courseId, titre, numero, data, ref, snapshot, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                courseId = selectCours.value;
                titre = lessonTitle.value;
                numero = parseInt(numeroInput.value);
                if (!courseId) {
                    alert("Veuillez choisir un cours");
                    return [2 /*return*/];
                }
                if (!titre) {
                    alert("Titre de la leçon obligatoire");
                    return [2 /*return*/];
                }
                if (numero < 1 || numero > 100) {
                    alert("Le numéro doit être entre 1 et 100");
                    return [2 /*return*/];
                }
                data = {
                    numero: numero,
                    titre: titre,
                    url: lessonUrl.value,
                    contenuHtml: getLessonContent(),
                    dateModification: new Date().toISOString()
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                ref = db.ref("RJFORDROID/COURE/".concat(courseId, "/lessons"));
                if (!currentLessonKey) return [3 /*break*/, 3];
                // Mode édition
                return [4 /*yield*/, ref.child(currentLessonKey).update(data)];
            case 2:
                // Mode édition
                _a.sent();
                alert("Leçon modifiée avec succès!");
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, ref.orderByChild("numero").equalTo(numero).once("value")];
            case 4:
                snapshot = _a.sent();
                if (snapshot.exists()) {
                    alert("Le num\u00E9ro ".concat(numero, " est d\u00E9j\u00E0 utilis\u00E9 dans ce cours!"));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, ref.push(data)];
            case 5:
                _a.sent();
                alert("Leçon ajoutée avec succès!");
                _a.label = 6;
            case 6:
                // Réinitialiser le formulaire
                resetLessonForm();
                return [3 /*break*/, 8];
            case 7:
                error_2 = _a.sent();
                console.error("Erreur sauvegarde leçon:", error_2);
                alert("Erreur lors de la sauvegarde de la leçon");
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// --- Réinitialiser le formulaire leçon ---
function resetLessonForm() {
    lessonForm.reset();
    clearEditor(); // Chanje sa - itilize clearEditor()
    currentLessonKey = null;
    currentCourseId = null;
    selectCours.disabled = false;
    submitLesson.textContent = "Publier sur RJFORDROID";
    // Recharger les données pour mettre à jour le numéro
    db.ref("RJFORDROID/COURE").once("value").then(function (snap) {
        var cours = snap.val() || {};
        actualiserNumeroLecon(cours);
    });
}
// --- Édition d'une leçon ---
function prepareEditLesson(courseId, lessonKey, titre, url, html, numero) {
    currentLessonKey = lessonKey;
    currentCourseId = courseId;
    // Remplir le formulaire
    selectCours.value = courseId;
    selectCours.disabled = true;
    lessonTitle.value = titre;
    lessonUrl.value = url;
    setLessonContent(html); // Chanje sa - itilize setLessonContent()
    numeroInput.value = numero.toString();
    submitLesson.textContent = "Modifier la leçon";
    // Basculer vers l'onglet Leçon
    var tabButtons = document.querySelectorAll(".tab-buttons button");
    if (tabButtons.length >= 2) {
        openTab('lessonForm', tabButtons[1]);
    }
}
// --- Supprimer une leçon ---
function deleteLesson(courseId, lessonKey) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Êtes-vous sûr de vouloir supprimer cette leçon ?")) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.ref("RJFORDROID/COURE/".concat(courseId, "/lessons/").concat(lessonKey)).remove()];
                case 2:
                    _a.sent();
                    alert("Leçon supprimée avec succès!");
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Erreur suppression:", error_3);
                    alert("Erreur lors de la suppression de la leçon");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// --- Supprimer un cours ---
function deleteCourse(courseId) {
    return __awaiter(this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("ATTENTION: Voulez-vous vraiment supprimer ce cours et TOUTES ses leçons ?")) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.ref("RJFORDROID/COURE/".concat(courseId)).remove()];
                case 2:
                    _a.sent();
                    alert("Cours supprimé avec succès!");
                    // Si on édite ce cours, réinitialiser le formulaire
                    if (editingCourseId === courseId) {
                        resetCourseForm();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error("Erreur suppression cours:", error_4);
                    alert("Erreur lors de la suppression du cours");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// --- Écouter les changements de sélection de cours ---
selectCours.addEventListener("change", function () {
    // Recharger les données pour mettre à jour le numéro
    db.ref("RJFORDROID/COURE").once("value").then(function (snap) {
        var cours = snap.val() || {};
        actualiserNumeroLecon(cours);
        // Si on était en mode édition et qu'on change de cours, annuler l'édition
        if (currentLessonKey && selectCours.value !== currentCourseId) {
            resetLessonForm();
        }
    });
});
// --- Fonction openTab (exposée globalement) ---
function openTab(id, btn) {
    var _a, _b, _c, _d;
    (_a = document.getElementById('courseForm')) === null || _a === void 0 ? void 0 : _a.classList.remove('active-content');
    (_b = document.getElementById('lessonForm')) === null || _b === void 0 ? void 0 : _b.classList.remove('active-content');
    (_c = document.getElementById('listSection')) === null || _c === void 0 ? void 0 : _c.classList.remove('active-content');
    document.querySelectorAll('.tab-buttons button').forEach(function (b) { return b.classList.remove('active'); });
    (_d = document.getElementById(id)) === null || _d === void 0 ? void 0 : _d.classList.add('active-content');
    btn.classList.add('active');
}
// Ekspoze fonksyon modal yo pou HTML la ka jwenn yo
window.showImageModal = function () {
    var modal = document.getElementById('imageModal');
    var input = document.getElementById('imageUrl');
    if (modal) {
        modal.style.display = 'flex';
        if (input)
            input.focus();
    }
};
window.hideImageModal = function () {
    var modal = document.getElementById('imageModal');
    if (modal)
        modal.style.display = 'none';
    // Netwaye input yo
    document.getElementById('imageUrl').value = '';
    document.getElementById('imageAlt').value = '';
};
// Ekspoze fonksyon yo globalman nan window
window.showImageModal = function () {
    var selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0); // Nou sove pozisyon an isit la
    }
    var modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'flex';
        var input = document.getElementById('imageUrl');
        if (input)
            input.focus();
    }
};
window.hideImageModal = function () {
    var modal = document.getElementById('imageModal');
    if (modal)
        modal.style.display = 'none';
};
window.updateLessonContent = updateLessonContent; // EKSPOZE SA A OBLIGATWA
var savedRange = null;
window.insertImage = function () {
    // ... (menm kòd rekipere URL la)
    var img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.className = 'resizable-img'; // Ajoute sa
    img.style.width = '100%'; // Default se lajè nèt
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '10px 0';
    img.style.borderRadius = '5px';
    img.style.cursor = 'pointer'; // Pou itilizatè a konnen li ka klike l
    if (savedRange) {
        savedRange.insertNode(img);
        // ... (rès kòd savedRange la)
    }
    else {
        editor.appendChild(img);
    }
    // ... (fèmen modal ak updateContent)
};
function changeFontSize(size) {
    if (!size)
        return;
    var editor = document.getElementById('tiptap-editor');
    if (!editor)
        return;
    var selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return;
    var range = selection.getRangeAt(0);
    if (!range.collapsed) {
        // 1. Nou ekstrè kontni an
        var content = range.extractContents();
        // 2. Nou kreye yon div tanporè pou nou netwaye tout ansyen baliz font-size
        var tempDiv = document.createElement('div');
        tempDiv.appendChild(content);
        // Retire tout SPAN ki gen fontSize oswa FONT tags ki te egziste deja anndan seleksyon an
        var oldElements = tempDiv.querySelectorAll('span[style*="font-size"], font');
        oldElements.forEach(function (el) {
            var htmlElement = el;
            // Si el la gen lòt estil (tankou koulè), nou jis retire fontSize la
            if (htmlElement.style.length > 1) {
                htmlElement.style.fontSize = '';
            }
            else {
                // Si li te la sèlman pou gwosè, nou "unwrap" li (retire baliz la, kite tèks la)
                var parent = htmlElement.parentNode;
                while (htmlElement.firstChild) {
                    parent === null || parent === void 0 ? void 0 : parent.insertBefore(htmlElement.firstChild, htmlElement);
                }
                parent === null || parent === void 0 ? void 0 : parent.removeChild(htmlElement);
            }
        });
        // 3. Kreye SÈLMAN yon sèl SPAN nèf ak nouvo gwosè a
        var newSpan = document.createElement('span');
        newSpan.style.fontSize = size;
        newSpan.appendChild(tempDiv.firstChild || tempDiv); // Remete kontni netwaye a
        // 4. Insere l tounen nan edite a
        range.insertNode(newSpan);
        // Rekreyé seleksyon an sou nouvo span an pou itilizatè a ka kontinye travay
        var newRange = document.createRange();
        newRange.selectNodeContents(newSpan);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    else {
        // Si se kousè a sèlman (pa gen tèks chwazi)
        var span = document.createElement('span');
        span.style.fontSize = size;
        span.innerHTML = '&#8203;'; // Zero-width space pou kousè a ka kanpe ladan l
        range.insertNode(span);
        var newRange = document.createRange();
        newRange.setStart(span, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    editor.focus();
    if (window.updateLessonContent)
        window.updateLessonContent();
}
window.changeFontSize = changeFontSize;
function changeTextColor(color) {
    if (!color)
        return;
    var editor = document.getElementById('tiptap-editor');
    if (!editor)
        return;
    if (window.saveState)
        window.saveState();
    var selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return;
    var range = selection.getRangeAt(0);
    if (!range.collapsed) {
        // 1. Nou ekstrè tout kontni ki chwazi a
        var content = range.extractContents();
        // 2. Kreye yon div tanporè pou nou travay sou li
        var tempDiv = document.createElement('div');
        tempDiv.appendChild(content);
        // 3. Netwayaj: Retire tout ansyen koulè (span style color ak font tags)
        var oldElements = tempDiv.querySelectorAll('span[style*="color"], font');
        oldElements.forEach(function (el) {
            var htmlElement = el;
            if (htmlElement.style.length > 1) {
                htmlElement.style.color = ''; // Si li gen lòt stil, retire koulè sèlman
            }
            else {
                // Si se te sèlman pou koulè, retire baliz la nèt
                var parent = htmlElement.parentNode;
                while (htmlElement.firstChild) {
                    parent === null || parent === void 0 ? void 0 : parent.insertBefore(htmlElement.firstChild, htmlElement);
                }
                parent === null || parent === void 0 ? void 0 : parent.removeChild(htmlElement);
            }
        });
        // 4. Kreye nouvo Span koulè a
        var newSpan = document.createElement('span');
        newSpan.style.color = color;
        // TRANSFERE TOUT KONTNI AN: Sa a se pati ki te manke a
        // Nou boukle tout nodes ki nan tempDiv la pou nou mete yo nan newSpan
        while (tempDiv.firstChild) {
            newSpan.appendChild(tempDiv.firstChild);
        }
        // 5. Mete l tounen nan edite a
        range.insertNode(newSpan);
        // Reyajiste seleksyon an
        var newRange = document.createRange();
        newRange.selectNodeContents(newSpan);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    else {
        // Si se kousè a sèlman
        var span = document.createElement('span');
        span.style.color = color;
        span.innerHTML = '&#8203;';
        range.insertNode(span);
        var newRange = document.createRange();
        newRange.setStart(span, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    editor.focus();
    if (window.updateLessonContent)
        window.updateLessonContent();
}
window.changeTextColor = changeTextColor;
// Ekspoze l globalman pou HTML la ka jwenn li
window.changeTextColor = changeTextColor;
// Sèvi ak yon interface pou evite erè "any" si ou vle, 
// oswa jis itilize window kòm any konsa:
function insertTable() {
    var editor = document.getElementById('tiptap-editor');
    if (!editor)
        return;
    // 1. Sove pozisyon kousè a (Range)
    var selection = window.getSelection();
    var savedRange = null;
    if (selection && selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0).cloneRange();
    }
    var rowsStr = prompt('Kantite ranje (1-10):', '3');
    var colsStr = prompt('Kantite kolòn (1-8):', '3');
    if (!rowsStr || !colsStr)
        return;
    var rows = parseInt(rowsStr);
    var cols = parseInt(colsStr);
    if (!isNaN(rows) && !isNaN(cols) && rows > 0 && cols > 0) {
        // Sove eta a pou "Undo"
        if (typeof window.saveState === 'function') {
            window.saveState();
        }
        var table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.margin = '15px 0';
        table.setAttribute('border', '1');
        var tbody = document.createElement('tbody');
        for (var r = 0; r < rows; r++) {
            var tr = document.createElement('tr');
            for (var c = 0; c < cols; c++) {
                var td = document.createElement('td');
                td.innerHTML = '&#8203;'; // Zero-width space pou konsève focus la
                td.style.border = '1px solid #cbd5e1';
                td.style.padding = '12px';
                td.style.minWidth = '50px';
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        // 2. Enserasyon nan edite a
        if (savedRange) {
            savedRange.deleteContents();
            savedRange.insertNode(table);
            // Mete kousè a nan premye selil la otomatikman
            var firstCell = table.querySelector('td');
            if (firstCell && selection) {
                var newRange = document.createRange();
                newRange.setStart(firstCell, 0);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
        else {
            editor.appendChild(table);
        }
        editor.focus();
        // Mizajou kontni pou Firebase
        if (typeof window.updateLessonContent === 'function') {
            window.updateLessonContent();
        }
    }
}
// 3. Ekspoze fonksyon an globalman pou HTML a ka wè li
window.insertTable = insertTable;
(_a = document.getElementById('tiptap-editor')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    updateFontSizeSelect();
});
(_b = document.getElementById('tiptap-editor')) === null || _b === void 0 ? void 0 : _b.addEventListener('keyup', function () {
    updateFontSizeSelect();
});
function updateFontSizeSelect() {
    var _a;
    var selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return;
    var element = (_a = selection.anchorNode) === null || _a === void 0 ? void 0 : _a.parentElement;
    var select = document.getElementById('fontSizeSelect');
    if (!select)
        return;
    // Nou remoute nan branch HTML la jiskaske nou jwenn yon fontSize oswa nou rive nan editor
    var foundSize = "";
    while (element && element.id !== 'tiptap-editor') {
        if (element.style.fontSize) {
            foundSize = element.style.fontSize;
            break;
        }
        element = element.parentElement;
    }
    // Si nou jwenn yon gwosè, nou mete select la sou li, sinon nou mete l sou "Normal"
    if (foundSize) {
        select.value = foundSize;
    }
    else {
        select.value = "16px"; // Gwosè default ou a
    }
}
// Initialiser l'application
document.addEventListener("DOMContentLoaded", function () {
    var _a;
    chargerDonneesAdmin();
    initTipTap(); // Chanje sa - inisyalize TipTap
    // Ajouter gestionnaire pour bouton Annuler
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", resetCourseForm);
        (_a = document.getElementById('tiptap-editor')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
            var target = e.target;
            if (target.tagName === 'IMG') {
                var newWidth = prompt("Chanje gwosè imaj la (an % oswa px). Eg: 50%, 200px, 100%", target.style.width);
                if (newWidth !== null) {
                    target.style.width = newWidth;
                    // Si se 100%, nou mete l an blòk, si li piti nou ka vle l bò kote tèks
                    if (newWidth !== '100%') {
                        target.style.display = 'inline-block';
                        target.style.margin = '5px';
                    }
                    else {
                        target.style.display = 'block';
                        target.style.margin = '10px 0';
                    }
                    updateLessonContent(); // Sove chanjman an
                }
            }
        });
    }
});
// Exposer les fonctions globalement
window.openTab = openTab;
window.formatText = formatText;
window.clearFormatting = clearFormatting;
window.insertLink = insertLink;
window.getLessonContent = getLessonContent;
window.setLessonContent = setLessonContent;
