const players = [
  ["Bulldog", "B", 18],
  ["Dawgs4Life", "D", 15],
  ["Party Animal", "P", 13],
  ["Kirby's Kid", "K", 12],
  ["Sic 'Em", "S", 10],
  ["Red & Black", "R", 9],
  ["UGA Legend", "U", 8],
  ["Dawg Fan", "F", 7],
  ["Go Dawgs", "G", 6],
  ["The Real MVP", "M", 5],
];

const activities = [
  ["Dawgs4Life", "submitted a dance floor proof", "+15"],
  ["Party Animal", "logged a drink proof", "+10"],
  ["Kirby's Kid", "earned the badge 3 in a Row", "+20"],
  ["UGA Legend", "submitted a full squad photo", "+20"],
  ["Sic 'Em", "submitted a hydration proof", "+5"],
];

const proofIdeas = [
  ["▥", "Drink Proof", "Log what is in your cup", "+10 pts"],
  ["☷", "Duo Photo", "Take a pic with someone across the party", "+15 pts"],
  ["▣", "Dance Floor", "Get the dance floor going", "+15 pts"],
  ["♢", "Hydration", "Drink water. Be a legend.", "+5 pts"],
  ["▤", "Album Cover", "Recreate an album cover with your squad", "+15 pts"],
];

const awards = [
  ["▥", "First Sip", "Submit your first drink proof"],
  ["3", "3 in a Row", "Submit 3 proofs in a row"],
  ["♢", "Hydration Hero", "Submit a water challenge"],
  ["☷", "Social Butterfly", "Take photos with 3 different people"],
];

const galleryLabels = ["Group Cheers", "Fit Check", "Dance Floor", "Mystery Cup", "Squad Shot", "Hydration"];

const gradients = [
  "linear-gradient(135deg, #5b0d13, #111 60%, #d61d2d)",
  "linear-gradient(135deg, #222, #9d101c 58%, #0b0b0b)",
  "linear-gradient(135deg, #090909, #d71d2d 50%, #f2f2f2)",
  "linear-gradient(135deg, #c81524, #111 55%, #571014)",
  "linear-gradient(135deg, #f4f4f4, #79101a 45%, #080808)",
  "linear-gradient(135deg, #121212, #ad1521 48%, #2f2f2f)",
];

function $(selector) {
  return document.querySelector(selector);
}

function avatar(name, letter) {
  return `<span class="avatar" title="${name}">${letter}</span>`;
}

function renderLeaderboard() {
  const list = $("#rankList");
  list.innerHTML = players
    .map((player, index) => {
      const [name, letter, drinks] = player;
      return `
        <li class="rank-row ${index === 0 ? "top" : ""}">
          <span class="rank-num">${index + 1}</span>
          <span class="player-cell">${avatar(name, letter)} ${name} ${index === 0 ? "<span style='color:var(--gold)'>♕</span>" : ""}</span>
          <span class="score-cell">${drinks}<span>▥</span></span>
        </li>
      `;
    })
    .join("");
}

function renderFeed() {
  $("#liveFeed").innerHTML = activities
    .map(([name, text, points], index) => `
      <div class="activity">
        ${avatar(name, name[0])}
        <span><strong>${name}</strong><small>${text} · ${index ? `${index + 1}m ago` : "Just now"}</small></span>
        <b>${points}</b>
      </div>
    `)
    .join("");
}

function renderProofIdeas() {
  $("#questList").innerHTML = proofIdeas
    .map(([icon, title, desc, points]) => `
      <button class="quest-item" data-proof="${title}">
        <span class="quest-icon">${icon}</span>
        <span><b>${title}</b><small>${desc}</small></span>
        <em>${points}</em>
      </button>
    `)
    .join("");
}

function renderGallery() {
  const desktop = $("#questCam");
  const mobile = $("#mobileGallery");
  const shots = galleryLabels
    .map((label, index) => `<div class="cam-shot" data-label="${label}" style="--photo:${gradients[index]}"></div>`)
    .join("");
  desktop.innerHTML = shots;
  mobile.innerHTML = galleryLabels
    .map((label, index) => `<div class="gallery-shot" data-label="${label}" style="--photo:${gradients[index]}"></div>`)
    .join("");
}

function renderAwards() {
  $("#badgeRow").innerHTML = awards.map(([icon]) => `<span class="badge">${icon}</span>`).join("");
  $("#awardList").innerHTML = awards
    .map(([icon, name, desc]) => `
      <div class="award-card">
        <span class="badge">${icon}</span>
        <span><b>${name}</b><small>${desc}</small></span>
        <span>›</span>
      </div>
    `)
    .join("");
}

function readFile(input, targetSelector) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const target = $(targetSelector);
    target.src = reader.result;
    target.style.display = "block";
  };
  reader.readAsDataURL(file);
}

function updateProfile() {
  const name = $("#playerName").value.trim() || "Dawg Fan";
  const nick = $("#playerNick").value.trim() || "UGA Legend";
  localStorage.setItem("gradPartyProfile", JSON.stringify({ name, nick }));
  $("#dashName").textContent = name;
  $("#dashNick").textContent = nick;
  $("#topPlayer").textContent = players[0][0];
  $("#joinButton").textContent = "Joined!";
  setTimeout(() => ($("#joinButton").innerHTML = "Let's Go! <span>→</span>"), 1200);
}

function submitProof() {
  const caption = $("#captionInput").value.trim();
  const activity = [$("#dashName").textContent, `submitted ${$("#submitTitle").textContent}${caption ? `: ${caption}` : ""}`, "+10"];
  activities.unshift(activity);
  activities.splice(5);
  renderFeed();
  $("#dashPoints").textContent = String(Number($("#dashPoints").textContent) + 10);
  $("#submitButton").textContent = "Pending Approval";
  setTimeout(() => ($("#submitButton").textContent = "Submit"), 1500);
}

function bindEvents() {
  $("#profileUpload").addEventListener("change", event => readFile(event.target, "#profilePreview"));
  $("#proofUpload").addEventListener("change", event => readFile(event.target, "#proofPreview"));
  $("#joinButton").addEventListener("click", updateProfile);
  $("#submitButton").addEventListener("click", submitProof);

  document.querySelectorAll("[data-scroll-target]").forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  $("#questList").addEventListener("click", event => {
    const button = event.target.closest("[data-proof]");
    if (!button) return;
    $("#submitTitle").textContent = button.dataset.proof;
    document.querySelector(".submit-phone").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function restoreProfile() {
  const saved = localStorage.getItem("gradPartyProfile");
  if (!saved) return;
  const { name, nick } = JSON.parse(saved);
  $("#playerName").value = name;
  $("#playerNick").value = nick;
  $("#dashName").textContent = name;
  $("#dashNick").textContent = nick;
}

renderLeaderboard();
renderFeed();
renderProofIdeas();
renderGallery();
renderAwards();
restoreProfile();
bindEvents();
