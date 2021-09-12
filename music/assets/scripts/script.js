const cover = document.getElementById("cover");
const disc = document.getElementById("disc");
const title = document.getElementById("title");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const timer = document.getElementById("timer");
const duration = document.getElementById("duration");
const prev = document.getElementById("prev");
const play = document.getElementById("play");
const next = document.getElementById("next");
const songID = window.location.hash.substring(1);
const songList = document.getElementById("song-list");
let songIndex;

// Songs info
const songs = [
  {
    title: "Une souris verte",
    coverPath: "assets/images/souris-verte.jpg",
    discPath: "assets/music/souris-verte.mp3",
    duration: "0.44",
    href: "souris-verte",
  },
  {
    title: "Ah les crocodiles",
    coverPath: "assets/images/crocodiles.jpg",
    discPath: "assets/music/crocodiles.mp3",
    duration: "2:36",
    href: "crocodiles",
  },
  {
    title: "Promenons-nous dans les bois",
    coverPath: "assets/images/promenons-nous.png",
    discPath: "assets/music/promenons-nous.mp3",
    duration: "1:42",
    href: "promenons-nous",
  },
  {
    title: "Il était un petit navire",
    coverPath: "assets/images/petit-navire.jpg",
    discPath: "assets/music/petit-navire.mp3",
    duration: "4:28",
    href: "petit-navire",
  },
  {
    title: "Ainsi font font font",
    coverPath: "assets/images/ainsi-font.jpg",
    discPath: "assets/music/ainsi-font.mp3",
    duration: "1:33",
    href: "ainsi-font",
  },
  {
    title: "Tourne petit moulin",
    coverPath: "assets/images/petit-moulin.jpg",
    discPath: "assets/music/petit-moulin.mp3",
    duration: "1:44",
    href: "petit-moulin",
  },
  {
    title: "Un éléphant qui se balançait",
    coverPath: "assets/images/elephant.jpg",
    discPath: "assets/music/elephant.mp3",
    duration: "2:15",
    href: "elephant",
  },
  {
    title: "Un grand cerf",
    coverPath: "assets/images/grand-cerf.jpg",
    discPath: "assets/music/grand-cerf.mp3",
    duration: "1:17",
    href: "grand-cerf",
  },
  {
    title: "L'araignée Gipsy",
    coverPath: "assets/images/araignee.jpg",
    discPath: "assets/music/araignee.mp3",
    duration: "0:52",
    href: "araignee",
  },
  {
    title: "Sur le pont d'Avignon",
    coverPath: "assets/images/pont-avignon.jpg",
    discPath: "assets/music/pont-avignon.mp3",
    duration: "1:46",
    href: "pont-avignon",
  },
  {
    title: "Mon âne",
    coverPath: "assets/images/mon-ane.jpg",
    discPath: "assets/music/mon-ane.mp3",
    duration: "1:35",
    href: "mon-ane",
  },
];

// Find song index
for (const [i, song] of songs.entries()) {
  if (songID === song.href) {
    songIndex = i;
  }
}
console.log(songIndex);

// Load the given song
function loadSong(song) {
  cover.src = song.coverPath;
  disc.src = song.discPath;
  title.textContent = song.title;
  duration.textContent = song.duration;
}

// Toggle play and pause
function playPauseMedia() {
  if (disc.paused) {
    disc.play();
  } else {
    disc.pause();
  }
}

// Update icon
function updatePlayPauseIcon() {
  if (disc.paused) {
    play.classList.remove("fa-pause");
    play.classList.add("fa-play");
  } else {
    play.classList.remove("fa-play");
    play.classList.add("fa-pause");
  }
}

// Update progress bar
function updateProgress() {
  progress.style.width = (disc.currentTime / disc.duration) * 100 + "%";

  let minutes = Math.floor(disc.currentTime / 60);
  let seconds = Math.floor(disc.currentTime % 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  timer.textContent = `${minutes}:${seconds}`;
}

// Reset the progress
function resetProgress() {
  progress.style.width = 0 + "%";
  timer.textContent = "0:00";
}

// Go to previous song
function gotoPreviousSong() {
  if (songIndex === 0) {
    songIndex = songs.length - 1;
  } else {
    songIndex = songIndex - 1;
  }

  const isDiscPlayingNow = !disc.paused;
  loadSong(songs[songIndex]);
  resetProgress();
  if (isDiscPlayingNow) {
    playPauseMedia();
  }
}

// Go to next song
function gotoNextSong(playImmediately) {
  if (songIndex === songs.length - 1) {
    songIndex = 0;
  } else {
    songIndex = songIndex + 1;
  }

  const isDiscPlayingNow = !disc.paused;
  loadSong(songs[songIndex]);
  resetProgress();
  if (isDiscPlayingNow || playImmediately) {
    playPauseMedia();
  }
}

// Change song progress when clicked on progress bar
function setProgress(ev) {
  const totalWidth = this.clientWidth;
  const clickWidth = ev.offsetX;
  const clickWidthRatio = clickWidth / totalWidth;
  disc.currentTime = clickWidthRatio * disc.duration;
}

// Load song list
function getSongs() {
  for (const song of songs) {
    songList.innerHTML += `<a class="song" href="player.html#${song.href}"><img class="song_img" src="${song.coverPath}"><h4>${song.title}</h4></a>`;
  }
}

function playFromList() {
  for (const song of songs) {
    if (songID === song.href) {
      loadSong(song);
    }
  }
}
