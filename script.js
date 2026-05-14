const root = document.querySelector('.root');
const STAR_COUNT = 150; 
const colors = ['white', 'pink', 'red']; 
const ph1btn = document.querySelector('.ripple-btn');
const ph1Card = document.querySelector('.card');
const phase1 = document.querySelector('.card');
const starCon = document.querySelector('.starCon');
const phase2 = document.querySelector('.phase2')
let darkOverlay = document.querySelector('.darkingEffect');
let animationRain; // Declare at the top of the click listener
let isRaining = true; // Flag to control the exit
let spawnRate = 0; // Starts at 0 for a slow build-up
let animationID;

let track1 = new Audio('victim/track1.mp3');
track1.loop = true
track1.volume = 0
let track2 = new Audio('victim/siuu2.mp3');

function easeOutVolume(audioTrack, easeFactor) {
    easeFactor = easeFactor || 0.01; 
    // const easeFactor = 0.01; // Higher = faster fade, Lower = slower fade

    function step() {
        if (audioTrack.volume > 0.1) {
            // Drop volume based on a fraction of current volume
            audioTrack.volume -= audioTrack.volume * easeFactor;
            requestAnimationFrame(step);
        } else {
            audioTrack.volume = 0.1;
            // audioTrack.pause(); // Stop playback once silent
        }
    }
    requestAnimationFrame(step);
}
function easeInVolume(audioTrack, easeFactor) {
    easeFactor = easeFactor || 0.005; 
    // audioTrack.volume = 0; // Start completely silent
    audioTrack.play();     // Ensure the track is playing

    function step() {
        // Calculate how much volume is left to reach max (1.0)
        const remainingVolume = 1.0 - audioTrack.volume;

        if (remainingVolume > 0.01) {
            // Close the gap by a percentage of what is left
            audioTrack.volume += remainingVolume * easeFactor;
            requestAnimationFrame(step);
        } else {
            audioTrack.volume = 1.0; // Lock perfectly at max volume
        }
    }
    requestAnimationFrame(step);
}

ph1btn.addEventListener('click', () => {
  easeInVolume(track1)

  const allStar = document.querySelector('.star');
  ph1Card.classList.add('is-falling');
  starCon.classList.add('starUp');
  allStar.classList.add('starUp');

  starCon.addEventListener('animationend', () => {
    phase1.remove(); 
  }, { once: true }); 

  const canvas = document.createElement('canvas');
  canvas.classList.add('Mcanvas');
  canvas.width = window.innerWidth;       
  canvas.height = window.innerHeight;     
  phase2.appendChild(canvas);
  
  // === ❤️ MULTIPLE DROPS MATRIX RAIN LOGIC START ===
  const ctx = canvas.getContext('2d');
  
  const fontSize = 12;
  const columns = Math.floor(canvas.width / fontSize);
  
  const matrixChars = "♥LOVE❤️YOU💖ALWAYSFOREVER💞0123456789🎂👑🎉💋";
  const rainbowColors = ['#ffffff99', '#ff91f999', '#ff005499', '#ff69b499', '#fff0f599'];
  // const rainbowColors = ['#ffffff', '#ff91f9', '#ff0054', '#ff69b4', '#fff0f5'];
  
  // 🌟 एउटै कोलममा धेरै थोपाहरू राख्न Array of Arrays (2D Array) तयार गर्ने
  const columnsArray = new Array(columns).fill(null).map(() => []);

  // थोपा (Drop) सिर्जना गर्ने फङ्सन
  function createDrop(columnIndex) {
    return {
      y: 0, // सुरुमा माथिबाट खस्ने
      speed: Math.random() * 1.5 + 1, // प्रत्येक थोपाको छुट्टाछुट्टै गति
      color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)]
    };
  }

  // सुरुमा एउटा र्यान्डम कोलममा पहिलो थोपा थप्ने
  const firstCol = Math.floor(Math.random() * columns);
  columnsArray[firstCol].push(createDrop(firstCol));

  // 🚀 नयाँ थोपाहरू एकदम तीव्र गतिमा थप्ने (Spawn Interval)
  const spawnInterval = setInterval(() => {
    // प्रत्येक २०ms मा ३-४ वटा कोलममा नयाँ थोपाहरू थप्दै जाने
    for(let k = 0; k < 1; k++) {
      const randomColumn = Math.floor(Math.random() * columns);
      
      // एउटै कोलममा धेरै थोपाहरू हुन सक्छन्, तर माथिल्लो थोपा थोरै तल सरेपछि मात्र नयाँ थप्ने
      const currentDrops = columnsArray[randomColumn];
      if (currentDrops.length === 0 || currentDrops[currentDrops.length - 1].y > 4) {
        currentDrops.push(createDrop(randomColumn));
      }
    }
  }, 20); // धेरै वर्षा गराउन २०ms राखिएको छ
// Add these variables at the top of your phase2 logic

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold " + fontSize + "px monospace";

  if (isRaining) {
    if (spawnRate < 5) spawnRate += 0.02; 
    for(let k = 0; k < spawnRate; k++) {
      const randomColumn = Math.floor(Math.random() * columns);
      const currentDrops = columnsArray[randomColumn];
      if (currentDrops.length === 0 || currentDrops[currentDrops.length - 1].y > 4) {
        currentDrops.push(createDrop(randomColumn));
      }
    }
  }

  for (let i = 0; i < columns; i++) {
    const drops = columnsArray[i];
    const x = i * fontSize;

    for (let j = drops.length - 1; j >= 0; j--) {
      const drop = drops[j];
      const y = drop.y * fontSize;
      
      ctx.shadowBlur = 12;
      ctx.shadowColor = drop.color;
      ctx.fillStyle = drop.color;
      ctx.fillText(matrixChars[Math.floor(Math.random() * matrixChars.length)], x, y);
      ctx.shadowBlur = 0;
      
      drop.y += drop.speed;

      // --- THE FIX IS HERE ---
      if (y > canvas.height) {
        drops.splice(j, 1); // Remove the old drop

        // ONLY respawn a new one here if raining is active
        // This keeps the count stable instead of exploding
        if (isRaining && Math.random() > 0.1) {
          drops.push(createDrop(i));
        }
      }
      // ❌ DO NOT PUT EXTRA SPAWN CODE HERE
    }
  }
  animationRain = requestAnimationFrame(drawMatrix);
}  
  drawMatrix();

  // === ❤️ MULTIPLE DROPS MATRIX RAIN LOGIC END ===


  // === ⏱️ BIRTHDAY COUNTDOWN LOGIC START ===
  
  // १. काउन्टडाउन देखाउनका लागि एउटा नयाँ DIV एलिमेन्ट बनाउने
  const countdownEl = document.createElement('div');
  countdownEl.classList.add('countdown-overlay');
  // countdownEl.style.height = window.innerHeight
  // countdownEl.style.width = window.innerWidth
  phase2.appendChild(countdownEl);

  // २. पालैपालो देखाउनुपर्ने शब्दहरूको सूची (Array)
  const countdownWords = ["3", "2", "1", "Happy", "Birthday", "Mayalu", `❤️`];
  // const countdownWords = ["3", "2", "1"];
  let wordIndex = 0;
function showNextWord() {
  const currentWord = countdownWords[wordIndex];

  // EXIT LOGIC
  if (wordIndex >= countdownWords.length) {
    isRaining = false; 
    easeOutVolume(track1)
    // track1.volume = 0.1

      const darkOverlay = document.createElement('div');
      darkOverlay.classList.add('darkingEffect');;
      phase2.appendChild(darkOverlay);
      darkOverlay.offsetWidth; 
      darkOverlay.classList.add('fadeIn')
      console.log(darkOverlay)
      countdownEl.classList.add('squeezed'); 

    // Wait for the heart to be seen
    setTimeout(() => {
  // DARK OVERLAY LOGIC
    // if (wordIndex == 6) {
    // }
      setTimeout(() => {
        // cancelAnimationFrame(animationID);
        // canvas.remove();
        loadNewElement(); 
      }, 700); // Wait for the squeeze transition to finish
    }, 1500); 
    return;
  }

  // TEXT RESET: Clean all animation classes before adding new ones
  countdownEl.classList.remove('pop-text', 'final-wish', 'squeezed');
  countdownEl.innerHTML = currentWord;

  // Trigger reflow
  void countdownEl.offsetWidth; 
  
  // if (currentWord === "❤️") {
    // countdownEl.classList.add('final-wish');
  // } else {
    countdownEl.classList.add('pop-text');
  // }

  wordIndex++;
  setTimeout(showNextWord, 1000);
}

  // म्याट्रिक्स रेन सुरु भएको १ सेकेन्डपछि काउन्टडाउन सुरु गर्ने
  setTimeout(showNextWord, 1000);

  


  // === ⏱️ BIRTHDAY COUNTDOWN LOGIC END ===
  
}, { once: true });
function loadNewElement() {
  const container = document.createElement('div');
  container.classList.add('unsqueezed');
  
  container.innerHTML = `
    <div class="cake-container">
      <button class="candle-btn" id="candle">🕯️</button>
      <div class="tier" id="t1">HAPPY</div>
      <div class="tier" id="t2">BIRTHDAY</div>
      <div class="tier" id="t3">MAYALU</div>
      <div class="instruction" id="instr">Smash the candle!</div>
    </div>
  `;
  
  phase2.appendChild(container);

  requestAnimationFrame(() => {
    container.classList.add('show');
    
    setTimeout(() => {
      const t1 = document.getElementById('t1');
      const t2 = document.getElementById('t2');
      const t3 = document.getElementById('t3');
      const candle = document.getElementById('candle');
      const instr = document.getElementById('instr');

      // Stacking
      t1.style.transform = 'translateY(-50px)';
      t2.style.transform = 'translateY(0px)';
      t3.style.transform = 'translateY(50px)';
      instr.style.transform = 'translateY(120px)';
      candle.style.transform = 'translateY(-100px)';
      
      setTimeout(() => { instr.style.opacity = '1'; }, 800);

      // Smash Event// Inside your loadNewElement function, where the candle click is:

candle.addEventListener('click', () => {
    track2.play()
    // 1. Change Candle look
    candle.innerHTML = "🔥";
    instr.innerHTML = "✨ Suuuuuuu! ✨";
    
    // 2. Reveal the rain by fading out the black overlay
    darkOverlay = document.querySelector('.darkingEffect');
    if (darkOverlay) {
        darkOverlay.classList.add('fade-out');
        darkOverlay.classList.remove('fade-in');
    }

    // 3. Crank up the rain intensity
    isRaining = true;
    spawnRate = 15; // Mega burst!

    // 4. Reveal the tiers
    [t1, t2, t3].forEach(t => t.classList.add('smashed'));

    // 5. Let it rain, then everything falls away
    setTimeout(() => {
      easeInVolume(track1)
        isRaining = false; // Stop spawning new rain

        setTimeout(() => {
            // Apply fall-away
            [t1, t2, t3, candle, instr].forEach(el => {
                el.style.transform = ""; // Important: clear the stack position
                el.classList.add('fall-away');
            });

            // Final Clean up after cake is gone
            setTimeout(() => {
              console.log(darkOverlay);
              darkOverlay.classList.remove('fade-out');
              darkOverlay.classList.add('fade-in');
              
              setTimeout(() => {
                  const canvas = document.querySelector('.Mcanvas');
                  if(canvas) canvas.remove();
                  cancelAnimationFrame(animationRain);
                  phase3Start()
                  // YOUR NEXT STEP: Start the photo gallery or stars here
                  console.log("Cake phase finished. Loading next...");
              }, 1500);
            }, 1500);
        }, 1000);
    }, 2500); // How long the rain "celebration" lasts
}, { once: true });
    }, 1500);
  });
}
function phase3Start() {
  const starCon2 = document.createElement('div');
  starCon2.classList.add('fixedFull');
  phase2.appendChild(starCon2);
  
  // Keep stars low for performance
  createStars(starCon2, 100); 

  // Cursive Text
  const h1 = document.createElement('div');
  h1.className = 'bday-text';
  h1.innerText = "Happy Birthday";
  starCon2.appendChild(h1);

  const h2 = document.createElement('div');
  h2.className = 'mylove-text';
  h2.innerText = "My Budiya";
  starCon2.appendChild(h2);

  const totalPhotos = 6; 
  const messages = ["✨", "My Budiya", "💖", "Beautiful", "Always you", "Mine"];

  // Shuffle the indices
  let photoIndices = Array.from({length: totalPhotos}, (_, i) => i + 1);
  photoIndices.sort(() => Math.random() - 0.5);

  const centerX = window.innerWidth / 2 - 140;
  const centerY = window.innerHeight / 2 - 190;

  photoIndices.forEach((num, index) => {
    const card = document.createElement('div');
    card.className = 'polaroid';
    
    // Random message
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    card.innerHTML = `
      <img src="victim/${num}.jpg" loading="lazy">
      <div class="caption">${randomMsg}</div>
    `;

    // --- OPTIMIZED LOADING ---
    // Only scatter the first 4 photos to save the CPU/GPU
    if (index < 4) {
      card.classList.add('scattered');
      const rx = Math.random() * (window.innerWidth - 300);
      const ry = Math.random() * (window.innerHeight - 400);
      const rr = (Math.random() - 0.5) * 50;
      
      card.style.left = `${rx}px`;
      card.style.top = `${ry}px`;
      card.style.transform = `rotate(${rr}deg)`;

      // Fly to center after a short delay
      setTimeout(() => {
        card.classList.remove('scattered');
        card.style.left = `${centerX}px`;
        card.style.top = `${centerY}px`;
        const stackRot = (Math.random() - 0.5) * 10;
        card.style.transform = `rotate(${stackRot}deg) translateZ(${-index * 2}px)`;
      }, 2000);

    } else {
      // The rest of the photos start directly at the center stack 
      // but are hidden/transparent initially to prevent lag
      card.style.opacity = "0";
      card.style.left = `${centerX}px`;
      card.style.top = `${centerY}px`;
      const stackRot = (Math.random() - 0.5) * 10;
      card.style.transform = `rotate(${stackRot}deg) translateZ(${-index * 2}px)`;
      
      // Fade them in slowly after the scatter animation is done
      setTimeout(() => { card.style.opacity = "1"; }, 2500);
    }

    card.style.zIndex = 100 + (totalPhotos - index);

    // Interaction
    card.addEventListener('click', () => {
      card.classList.add('drift-out');
      
      // Trigger the Heart/Letter at the end
      if (index === totalPhotos - 1) {
        setTimeout(() => showLetterButton(starCon2), 1000);
      }
    });

    starCon2.appendChild(card);
  });
}

function showLetterButton(container) {
  const btn = document.createElement('button');
  btn.className = 'letter-btn';
  btn.innerText = 'OPEN LOVE LETTER';
  container.appendChild(btn);

  btn.onclick = () => {
    btn.style.display = 'none'; // Hide button after click
    createImageHeart(container);
  };
}
function createImageHeart(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'heart-wrapper';
  container.appendChild(wrapper);

  const totalNodes = 40; // More circles = smoother connection
  const scaleFactor = 15; // Lower scale + more nodes = no gaps
  let currentNode = 0;

  function spawnBatch() {
    const batchSize = 5; 
    
    for (let i = 0; i < batchSize && currentNode < totalNodes; i++) {
      // Calculate position
      const t = (currentNode / totalNodes) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const node = document.createElement('div');
      node.className = 'heart-node';
      
      // Cycle through your photos (1-6.jpg)
      const imgNum = (currentNode % 6) + 1;
      node.innerHTML = `<img src="victim/${imgNum}.jpg">`;

      wrapper.appendChild(node);

      // Position with a slight delay for that "drawing" effect
      setTimeout(() => {
        node.style.opacity = '1';
        // We use 50% as the origin and add the x/y offsets
        node.style.left = `calc(50% + ${x * scaleFactor}px)`;
        node.style.top = `calc(50% + ${y * scaleFactor}px)`;
      }, 50);

      currentNode++;
    }

    if (currentNode < totalNodes) {
      setTimeout(spawnBatch, 100); 
    } else {
      showFinalMessage(wrapper);
    }
  }

  spawnBatch();
}
function showFinalMessage(wrapper) {
  const msgBox = document.createElement('div');
  msgBox.className = 'message-box';
  msgBox.innerHTML = `
    <h2 style="color: #ff69b4; font-family: 'Birthstone', cursive; font-size: 50px; margin-bottom: 10px;">Happy Birthday Mero Mutu!</h2>
    <div style="font-size: 20px; color: #eee;">
      <p>Aaja ko din mero lagi pani dherai special cha, kina bhane aaja timi janmeko din ho. Timro aagaman le yo sansar sundar bhayo, ra mero jindagi pani timile rangin banaidiyau. Timi mero hasi ko karan hau, mero khusi ko thau hau, ra mero jindagiko sabse pyaro manche hau.</p>
      <p>Timro ek muskan le mero din ramailo bancha, timro ek kura le mero mutu shanta huncha. Ma prarthana garchu ki timro jindagi sadai khusi, safalta, swasthya ra maya le bharipurna hos.</p>
      <p>Ma timilai dherai maya garchu, words le bujhauna sakdina kati maya garchu bhanera. Timi mero aaja ho, mero bholi ho, ra mero forever hau ❤️</p>
      <p style="color: #ff69b4; font-size: 24px; margin-top: 20px;">Janmadin ko dherai dherai subhakamana mero Budiya 👑🎉</p>
      <p>Love You So Much Budiya 💋❤️</p>
    </div>
  `;
  wrapper.appendChild(msgBox);

  // Smooth fade in
  setTimeout(() => {
    msgBox.classList.add('show');
  }, 500);
}

function createStars(starContain,zIn) {
    for (let i = 0; i < STAR_COUNT; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        star.classList.add(randomColor);
        star.classList.add('starDown');
        // box.appendChild(star);


        // अलि ठुला ताराहरू (१.५ देखि ४ पिक्सेल)
        const size = Math.random() * 2.5 + 1.5; 
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 1;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.zIndex =zIn || 0;

        // ✨ ३०% ताराहरूमा मात्र चमक (Glare) थप्ने
        if (Math.random() > 0.7) {
            star.classList.add('has-glare');
            // चमकको लम्बाइ ताराको साइज अनुसार ठुलो (१५ देखि ३५ पिक्सेल) हुने
            const glareSize = size * (Math.random() * 5 + 6);
            star.style.setProperty('--glare-size', `${glareSize}px`);
        }

        starContain.appendChild(star);
    }
}

createStars(starCon);
document.querySelector('.ripple-btn').addEventListener('click', function (e) {
  const button = e.currentTarget;
  
  // Create a span element for the ripple
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  // Size the ripple span
  circle.style.width = circle.style.height = `${diameter}px`;
  
  // Position the ripple span relative to the click coordinates
  const rect = button.getBoundingClientRect();
  circle.style.left = `${e.clientX - rect.left - radius}px`;
  circle.style.top = `${e.clientY - rect.top - radius}px`;
  
  // Add the ripple class
  circle.classList.add('ripple');
  
  // Remove existing ripples if any, then append the new one
  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) {
    ripple.remove();
  }
  
  button.appendChild(circle);
});