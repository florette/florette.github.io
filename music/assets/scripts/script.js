// register ServiceWorker, remember to use absolute path!
if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/music/sw.js", { scope: "/music/" });
}

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
  {
    title: "Mon petit lapin",
    coverPath: "assets/images/petit-lapin.jpg",
    discPath: "assets/music/petit-lapin.mp3",
    duration: "1:10",
    href: "petit-lapin",
  },
];

// Find song index
for (const [i, song] of songs.entries()) {
  if (songID === song.href) {
    songIndex = i;
  }
}

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

// Animals sounds

// Animals variables
const animalList = document.getElementById("animal-list");
const animalBtnList = document.getElementsByClassName("animal__item");
const animalDisc = document.getElementById("animal-disc");

// Animals
const animals = [
  {
    id: "vache",
    coverPath: "assets/images/animaux/vache.png",
    soundStart: 6,
    soundEnd: 12,
  },
  {
    id: "cheval",
    coverPath: "assets/images/animaux/cheval.png",
    soundStart: 13.5,
    soundEnd: 18,
  },
  {
    id: "chat",
    coverPath: "assets/images/animaux/chat.png",
    soundStart: 21.5,
    soundEnd: 26,
  },
  {
    id: "gorille",
    coverPath: "assets/images/animaux/gorille.png",
    soundStart: 29,
    soundEnd: 35,
  },
  {
    id: "canard",
    coverPath: "assets/images/animaux/canard.png",
    soundStart: 37,
    soundEnd: 43,
  },
  {
    id: "coq",
    coverPath: "assets/images/animaux/coq.png",
    soundStart: 45,
    soundEnd: 50,
  },
  {
    id: "elephant",
    coverPath: "assets/images/animaux/elephant.png",
    soundStart: 52.5,
    soundEnd: 58,
  },
  {
    id: "girafe",
    coverPath: "assets/images/animaux/girafe.png",
    soundStart: 61,
    soundEnd: 64,
  },
  {
    id: "perroquet",
    coverPath: "assets/images/animaux/perroquet.png",
    soundStart: 68,
    soundEnd: 75,
  },
  {
    id: "cigogne",
    coverPath: "assets/images/animaux/cigogne.png",
    soundStart: 76,
    soundEnd: 82,
  },
  {
    id: "chien",
    coverPath: "assets/images/animaux/chien.png",
    soundStart: 84,
    soundEnd: 90,
  },
  {
    id: "lion",
    coverPath: "assets/images/animaux/lion.png",
    soundStart: 92,
    soundEnd: 98,
  },
  {
    id: "mouton",
    coverPath: "assets/images/animaux/mouton.png",
    soundStart: 100,
    soundEnd: 106,
  },
  {
    id: "poule",
    coverPath: "assets/images/animaux/poule.png",
    soundStart: 108,
    soundEnd: 114,
  },
  {
    id: "lapin",
    coverPath: "assets/images/animaux/lapin.png",
    soundStart: 115,
    soundEnd: 122,
  },
  {
    id: "zebre",
    coverPath: "assets/images/animaux/zebre.png",
    soundStart: 123,
    soundEnd: 128,
  },
  {
    id: "tigre",
    coverPath: "assets/images/animaux/tigre.png",
    soundStart: 130,
    soundEnd: 137,
  },
  {
    id: "chevre",
    coverPath: "assets/images/animaux/chevre.png",
    soundStart: 138,
    soundEnd: 145,
  },
  {
    id: "moustique",
    coverPath: "assets/images/animaux/moustique.png",
    soundStart: 146,
    soundEnd: 151,
  },
  {
    id: "cochon",
    coverPath: "assets/images/animaux/cochon.png",
    soundStart: 154,
    soundEnd: 161,
  },
  {
    id: "abeille",
    coverPath: "assets/images/animaux/abeille.png",
    soundStart: 162,
    soundEnd: 168,
  },
  {
    id: "ecureuil",
    coverPath: "assets/images/animaux/ecureuil.png",
    soundStart: 171,
    soundEnd: 177,
  },
  {
    id: "antilope",
    coverPath: "assets/images/animaux/antilope.png",
    soundStart: 178,
    soundEnd: 183,
  },
  {
    id: "kangourou",
    coverPath: "assets/images/animaux/kangourou.png",
    soundStart: 186,
    soundEnd: 192,
  },
  {
    id: "loup",
    coverPath: "assets/images/animaux/loup.png",
    soundStart: 193,
    soundEnd: 200,
  },
  {
    id: "ours",
    coverPath: "assets/images/animaux/ours.png",
    soundStart: 201,
    soundEnd: 207,
  },
  {
    id: "chameau",
    coverPath: "assets/images/animaux/chameau.png",
    soundStart: 209,
    soundEnd: 216,
  },
  {
    id: "cacatoes",
    coverPath: "assets/images/animaux/cacatoes.png",
    soundStart: 217,
    soundEnd: 224,
  },
  {
    id: "renard",
    coverPath: "assets/images/animaux/renard.png",
    soundStart: 225,
    soundEnd: 230,
  },
  {
    id: "aigle",
    coverPath: "assets/images/animaux/aigle.png",
    soundStart: 232,
    soundEnd: 238,
  },
  {
    id: "moineau",
    coverPath: "assets/images/animaux/moineau.png",
    soundStart: 241,
    soundEnd: 246,
  },
  {
    id: "hibou",
    coverPath: "assets/images/animaux/hibou.png",
    soundStart: 248,
    soundEnd: 255,
  },
  {
    id: "panda",
    coverPath: "assets/images/animaux/panda.png",
    soundStart: 256,
    soundEnd: 263,
  },
  {
    id: "sanglier",
    coverPath: "assets/images/animaux/sanglier.png",
    soundStart: 264,
    soundEnd: 269,
  },
  {
    id: "ane",
    coverPath: "assets/images/animaux/ane.png",
    soundStart: 271,
    soundEnd: 278,
  },
];

function getAnimals() {
  for (const animal of animals) {
    animalList.innerHTML += `<button class="animal__item" id="${animal.id}"><img src="${animal.coverPath}"></button>`;
  }
}

function playAnimal() {
  animalDisc.src = "assets/music/animaux/animaux.mp3";
  let soundDuration;
  let play = false;
  let timer;

  for (const btn of animalBtnList) {
    btn.addEventListener(
      document.ontouchend !== null ? "click" : "touchend",
      function (e) {
        const thisAnimal = this.id;

        for (const btn of animalBtnList) {
          btn.classList.remove("active");
        }

        if (play) {
          console.log("clear");
          clearTimeout(timer);
        }

        for (const animal of animals) {
          if (thisAnimal === animal.id) {
            animalDisc.currentTime = animal.soundStart;
            soundDuration = (animal.soundEnd - animal.soundStart) * 1000;

            animalDisc.play();
            play = true;
            this.classList.add("active");
          }
        }

        timer = setTimeout(() => {
          animalDisc.pause();
          console.log("finished");
          play = false;
          this.classList.remove("active");
        }, soundDuration);
      }
    );
  }
}
