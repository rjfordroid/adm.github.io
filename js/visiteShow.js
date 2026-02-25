  var visitesRef = firebase.database().ref("RJFORDROID/VISITES");

  // Lis vizit
  function loadVisits() {
    visitesRef.on("value", function(snapshot) {
      const visitList = document.getElementById("visitList");
      visitList.innerHTML = "";

      let total = 0;
      const statsPays = {};
      const statsPages = {};
      const statsBrowsers = {};
      const onlineUsers = {};

      snapshot.forEach(childSnap => {
        const data = childSnap.val();
        total++;

        // Liste vizit
        const div = document.createElement("div");
        div.style.padding = "8px";
        div.style.borderBottom = "1px solid #ccc";
        div.innerHTML = `
          <input type="checkbox" data-key="${childSnap.key}" style="margin-right:5px;">
          <strong>${data.Visit}</strong> - ${data.Path} - ${data.Pays} - ${data.Date_visite}
        `;
        visitList.appendChild(div);

        // Stats Pays
        statsPays[data.Pays] = (statsPays[data.Pays] || 0) + 1;
        // Stats Pages
        statsPages[data.Path] = (statsPages[data.Path] || 0) + 1;
        // Stats Browser
        statsBrowsers[data.Usernavigater] = (statsBrowsers[data.Usernavigater] || 0) + 1;

        // Online Users (dènye 5 min)
        const visitTime = new Date(data.Date_visite).getTime();
        if(Date.now() - visitTime < 5*60*1000) {
          onlineUsers[data.BrowserID] = data.Visit;
        }
      });

      // Total
      document.getElementById("totalVisites").innerText = "Total: " + total;

      // Pays
      const statsListPays = document.getElementById("statsListPays");
      statsListPays.innerHTML = "";
      for(const p in statsPays) {
        const li = document.createElement("li");
        li.textContent = `${p} : ${statsPays[p]}`;
        statsListPays.appendChild(li);
      }

      // Pages
      const statsListPages = document.getElementById("statsListPages");
      statsListPages.innerHTML = "";
      for(const p in statsPages) {
        const li = document.createElement("li");
        li.textContent = `${p} : ${statsPages[p]}`;
        statsListPages.appendChild(li);
      }

      // Browsers
      const statsListBrowsers = document.getElementById("statsListBrowsers");
      statsListBrowsers.innerHTML = "";
      for(const b in statsBrowsers) {
        const li = document.createElement("li");
        li.textContent = `${b} : ${statsBrowsers[b]}`;
        statsListBrowsers.appendChild(li);
      }

      // Online
      const statsListUserOnline = document.getElementById("statsListUserOnline");
      statsListUserOnline.innerHTML = "";
      for(const u in onlineUsers) {
        const li = document.createElement("li");
        li.textContent = `${u} : ${onlineUsers[u]}`;
        statsListUserOnline.appendChild(li);
      }
    });
  }

  loadVisits();

  // Seleksyone tout
  function toggleSelectAll(el) {
    const checkboxes = document.querySelectorAll("#visitList input[type=checkbox]");
    checkboxes.forEach(cb => cb.checked = el.checked);
    document.getElementById("btnDeleteSelected").style.display = el.checked ? "block" : "none";
  }

  // Delete seleksyon
  function deleteSelectedVisits() {
    const selected = document.querySelectorAll("#visitList input[type=checkbox]:checked");
    selected.forEach(cb => {
      visitesRef.child(cb.dataset.key).remove();
    });
  }

