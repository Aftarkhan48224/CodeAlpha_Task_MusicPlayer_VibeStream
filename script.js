const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const themeToggle = document.getElementById("theme-toggle");
const fileUpload = document.getElementById("file-upload");

let songs = [];
let songIndex = 0;

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸️";
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶️";
}

playBtn.addEventListener("click", () => {
  audio.paused ? playSong() : pauseSong();
});

prevBtn.addEventListener("click", () => {
  if (songs.length === 0) return;
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
  updatePlaylistHighlight();
});

nextBtn.addEventListener("click", () => {
  if (songs.length === 0) return;
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
  updatePlaylistHighlight();
});

audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  progress.value = (currentTime / duration) * 100 || 0;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

progress.addEventListener("input", () => {
  const { duration } = audio;
  audio.currentTime = (progress.value / 100) * duration;
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function createPlaylist() {
  playlist.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    if (index === songIndex) li.classList.add("active");
    li.addEventListener("click", () => {
      songIndex = index;
      loadSong(song);
      playSong();
      updatePlaylistHighlight();
    });
    playlist.appendChild(li);
  });
}

function updatePlaylistHighlight() {
  document.querySelectorAll("#playlist li").forEach((li, index) => {
    li.classList.toggle("active", index === songIndex);
  });
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

fileUpload.addEventListener("change", (e) => {
  const files = Array.from(e.target.files).filter(file =>
    file.type.startsWith("audio/")
  );

  if (files.length === 0) return;

  files.forEach((file) => {
    const objectURL = URL.createObjectURL(file);
    songs.push({
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Uploaded",
      src: objectURL
    });
  });

  songIndex = songs.length - files.length;
  loadSong(songs[songIndex]);
  playSong();
  createPlaylist();
  updatePlaylistHighlight();

  fileUpload.value = "";
});
