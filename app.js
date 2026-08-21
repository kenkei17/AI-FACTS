// 1. Paste your API Key here


const petElement = document.getElementById("pet");
const factTextElement = document.getElementById("fact-text");

  const WORKER_URL = "https://quiet-sun-6869.jumpycat.workers.dev";
// Store timer so rapid clicks don't break the animation
let typewriterTimeout; 

// 3. 8-Bit Web Audio Blip
let audioCtx;
function typeWriter(text, i = 0) {
  if (i === 0) {
    clearTimeout(typewriterTimeout);
    factTextElement.textContent = "";
  }

  if (i < text.length) {
    factTextElement.textContent += text.charAt(i);

    typewriterTimeout = setTimeout(() => {
      typeWriter(text, i + 1);
    }, 30);
  }
}
function playBlipSound() {
  // Initialize audio context lazily on user interaction
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  // Resume if browser suspended it
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

// const API_KEY = "YOUR_NEW_API_KEY";

// const petElement = document.getElementById("pet");
// const factTextElement = document.getElementById("fact-text");



// Your existing typewriter code...
// Your existing sound code...
 const topics = ["space", "animals", "the ocean", "history", "the human body", "food", "language", "insects", "ancient civilizations", "physics","philippines", "japan","casino","programming","dinosaurs","students","how awesome it is to live","investments", "addiction","mob psycho", "food", "Hawaii", "ocean", "pyramid", "comedy", "crying", "letting go of someone", "connection"];

const promptTemplates = [
  "Give me 1 short, fun, mind-blowing, or obscure real-world fact about %TOPIC%. Keep it under 25 words so it fits in a small retro speech bubble.",
  "Tell me a shocking or little-known history or science secret about %TOPIC%. Keep it under 25 words.",
  "What is the single most bizarre or surprising truth about %TOPIC%? Max 25 words.",
  "Give me a weird, unheard-of trivia piece about %TOPIC%. Must be under 25 words.",
  "Share a fascinating 'did you know?' fact about %TOPIC% that most people get wrong. Under 25 words.",
  "joke about %TOPIC%, Under 25 words.",
  "say something in a bit corn about %TOPIC% Under 25 words.",
  "say something about %TOPIC% like a motivation. Under 25 words.",
  "say something nice to the(2nd person POV like people you talk to) related to %TOPIC% Under 25 words.",
  "say a life lesson related to %TOPIC% that's like related to a book about the same topic %TOPIC% Under 25 words.",
  "say something like(hugot) in english ofc that stings in a clever way to relate to %TOPIC% and love. Under 25 words.", "cheer me up in a clever way related to %TOPIC. under 25 words"
];
async function fetchPetFact() {
  playBlipSound();
  clearTimeout(typewriterTimeout);
  factTextElement.textContent = "Thinking...";
  
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const randomTemplate = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
  const finalPrompt = randomTemplate.replace("%TOPIC%", randomTopic);
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.5",
        input: finalPrompt,
        store: false
      })
    });
 
    const data = await response.json();
 
    console.log("OpenAI response:", data);
    console.log("Prompt", finalPrompt);
    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP ${response.status}`);
    }
 
    // The Responses API returns output as an array of items;
    // the text lives in output[].content[].text for the message-type item.
    const aiResponseText = data.output
      ?.find(item => item.type === "message")
      ?.content
      ?.find(c => c.type === "output_text")
      ?.text
      ?.trim();
 
    if (!aiResponseText) {
      throw new Error("No text received from OpenAI.");
    }
 
    typeWriter(aiResponseText);
 
  } catch (error) {
    console.error("OpenAI API Error:", error);
    typeWriter("Oops! My brain froze. Tap me again!");
  }
}

petElement.addEventListener("click", fetchPetFact);
// =========================
window.addEventListener('DOMContentLoaded', () => {
      const audio = document.getElementById('bgm');
      audio.volume = 0.3; // Set background volume (30%)

      const playAudio = () => {
        audio.play().then(() => {
          // Clean up event listeners once playback starts
          ['click', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
            window.removeEventListener(evt, playAudio);
          });
        }).catch(err => {
          console.log("Autoplay waiting for user interaction:", err);
        });
      };

      // Listen for the very first interaction anywhere on the screen
      ['click', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
        window.addEventListener(evt, playAudio, { once: true });
      });
    });

const audio = document.getElementById('bgm');
const muteBtn = document.getElementById('mute-btn');

const speakerOn = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 6H5L8 3V13L5 10H2V6Z" fill="#e63946"/>
  <path d="M10 6C11 7 11 9 10 10" stroke="#e63946" stroke-width="1.5" stroke-linecap="square"/>
  <path d="M12 4.5C13.5 6.5 13.5 9.5 12 11.5" stroke="#e63946" stroke-width="1.5" stroke-linecap="square"/>
</svg>`;

const speakerOff = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 6H5L8 3V13L5 10H2V6Z" fill="#e63946"/>
  <path d="M10 5L13 11M13 5L10 11" stroke="#e63946" stroke-width="1.5" stroke-linecap="square"/>
</svg>`;

muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  muteBtn.innerHTML = audio.muted ? speakerOff : speakerOn;
});

const weatherBtn = document.getElementById('weather-btn');
const weatherModal = document.getElementById('weather-modal');
const citySubmit = document.getElementById('city-submit');
const cityCancel = document.getElementById('city-cancel');
const cityInput = document.getElementById('city-input');

weatherBtn.addEventListener('click', () => {
  weatherModal.style.display = 'flex';
});

cityCancel.addEventListener('click', () => {
  weatherModal.style.display = 'none';
});

citySubmit.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) return;
  await checkWeather(city);
  weatherModal.style.display = 'none';
});

async function checkWeather(city) {
  try {
    // Step 1: geocode city name to lat/lon (Open-Meteo, no API key needed)
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      document.getElementById('fact-text').textContent = "City not found!";
      return;
    }
    const { latitude, longitude } = geoData.results[0];

    // Step 2: fetch current weather
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();
    const code = weatherData.current_weather.weathercode;

    applyWeatherTheme(code);
  } catch (err) {
    document.getElementById('fact-text').textContent = "Couldn't fetch weather :(";
  }
}

function applyWeatherTheme(code) {
  // Open-Meteo weathercodes: https://open-meteo.com/en/docs
  let theme = { bg: 'url(img/default.jfif)', label: 'Clear' };

  if (code === 0) theme = { bg: 'url(img/clearSky.jfif)', label: 'Clear Skies' };
  else if (code >= 1 && code <= 3) theme = { bg: 'url(img/cloudy.jfif)', label: 'Cloudy' };
  else if (code >= 45 && code <= 48) theme = { bg: 'url(img/foggy.jfif)', label: 'Foggy' };
  else if (code >= 51 && code <= 67) theme = { bg: 'url(img/rain.jfif)', label: 'Rainy' };
  else if (code >= 71 && code <= 77) theme = { bg: 'url(img/snowy.jfif)', label: 'Snowy' };
  else if (code >= 80 && code <= 82) theme = { bg: 'url(img/showers.jfif)', label: 'Showers' };
  else if (code >= 95) theme = { bg: 'url(img/thunderstorm.jfif)', label: 'Thunderstorm' };

  document.body.style.backgroundImage = theme.bg;
  document.getElementById('fact-text').textContent = `Weather: ${theme.label}!`;
}