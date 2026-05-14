const root = document.querySelector('.root');
const STAR_COUNT = 150; 
const colors = ['white', 'pink', 'red']; 
const ph1btn = document.querySelector('.ripple-btn');
const ph1Card = document.querySelector('.card');
const phase1 = document.querySelector('.card');
const starCon = document.querySelector('.starCon');
const phase2 = document.querySelector('.phase2')
let animationRain; // Declare at the top of the click listener


ph1btn.addEventListener('click', () => {
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
  
  const matrixChars = "♥LOVE❤️YOU💖ALWAYSFOREVER💞01";
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
let spawnRate = 0; // Starts at 0 for a slow build-up
let isRaining = true; // Flag to control the exit
let animationID;

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold " + fontSize + "px monospace";

  // --- GRADUAL SPAWN LOGIC ---
  if (isRaining) {
    // Slowly increase spawnRate until it hits a cap (e.g., 5)
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

      // --- CLEAN EXIT LOGIC ---
      // If drop goes off screen, just remove it. 
      // Do NOT spawn a new one if isRaining is false.
      if (y > canvas.height) {
        drops.splice(j, 1);
      }
      if (isRaining && Math.random() > 0.1) {
        drops.push(createDrop(i));
      }
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
  // const countdownWords = ["3", "2", "1", "Happy", "Birthday", "Mayalu", `❤️`];
  const countdownWords = ["3", "2", "1"];
  let wordIndex = 0;
function showNextWord() {
  const currentWord = countdownWords[wordIndex];

  // EXIT LOGIC
  if (wordIndex >= countdownWords.length) {
    isRaining = false; 

    // Wait for the heart to be seen
    setTimeout(() => {
      countdownEl.classList.add('squeezed'); 

      setTimeout(() => {
        // cancelAnimationFrame(animationID);
        // canvas.remove();
        loadNewElement(); 
      }, 700); // Wait for the squeeze transition to finish
    }, 1500); 
    return;
  }

  // DARK OVERLAY LOGIC
  if (wordIndex == 6) {
    const darkOverlay = document.createElement('div');
    darkOverlay.classList.add('darkingEffect');
    phase2.appendChild(darkOverlay);
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

      // Smash Event
      candle.addEventListener('click', () => {
        candle.innerHTML = "🔥";
        instr.innerHTML = "✨ Suuuuuuu! ✨";
        
        [t1, t2, t3].forEach(t => t.classList.add('smashed'));

        // RE-ENABLE RAIN
        isRaining = true;
        spawnRate = 0; // Reset spawn rate so it builds up again
        
        // Let it rain for 2 seconds
        setTimeout(() => {
          isRaining = false; // Stop spawning new drops
          
          // Wait a bit for existing drops to clear, then drop the cake
          setTimeout(() => {
            // Apply fall-away class
            [t1, t2, t3, candle, instr].forEach(el => {
                el.classList.add('fall-away');
            });
            
            // Finally clean up everything
            setTimeout(() => {
              container.remove();
              const canvas = document.querySelector('.Mcanvas');
              if(canvas) canvas.remove();
              cancelAnimationFrame(animationRain);
            }, 1500);
          }, 1000);
        }, 2000);
      }, { once: true });
    }, 1500);
  });
}

function createStars() {
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

        // ✨ ३०% ताराहरूमा मात्र चमक (Glare) थप्ने
        if (Math.random() > 0.7) {
            star.classList.add('has-glare');
            // चमकको लम्बाइ ताराको साइज अनुसार ठुलो (१५ देखि ३५ पिक्सेल) हुने
            const glareSize = size * (Math.random() * 5 + 6);
            star.style.setProperty('--glare-size', `${glareSize}px`);
        }

        starCon.appendChild(star);
    }
}

createStars();
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