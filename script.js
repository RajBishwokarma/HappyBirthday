const root = document.querySelector('.root');
const STAR_COUNT = 150; 
const colors = ['white', 'pink', 'red']; 
const ph1btn = document.querySelector('.ripple-btn');
const ph1Card = document.querySelector('.card');
const phase1 = document.querySelector('.card');
const starCon = document.querySelector('.starCon');
const phase2 = document.querySelector('.phase2')


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
  const rainbowColors = ['#ffffff', '#ff91f9', '#ff0054', '#ff69b4', '#fff0f5'];
  
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
    for(let k = 0; k < 4; k++) {
      const randomColumn = Math.floor(Math.random() * columns);
      
      // एउटै कोलममा धेरै थोपाहरू हुन सक्छन्, तर माथिल्लो थोपा थोरै तल सरेपछि मात्र नयाँ थप्ने
      const currentDrops = columnsArray[randomColumn];
      if (currentDrops.length === 0 || currentDrops[currentDrops.length - 1].y > 4) {
        currentDrops.push(createDrop(randomColumn));
      }
    }
  }, 20); // धेरै वर्षा गराउन २०ms राखिएको छ

  function drawMatrix() {
    // ट्रेल इफेक्टका लागि हल्का कालो ब्याकग्राउन्ड पोत्ने
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "bold " + fontSize + "px monospace";
    
    // प्रत्येक कोलम र त्यहाँभित्रका सबै थोपाहरू लुप गर्ने
    for (let i = 0; i < columns; i++) {
      const drops = columnsArray[i];
      const x = i * fontSize;

      for (let j = drops.length - 1; j >= 0; j--) {
        const drop = drops[j];
        const y = drop.y * fontSize;
        
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        // 🌟 चमक (Glow Effect)
        ctx.shadowBlur = 12;
        ctx.shadowColor = drop.color;
        ctx.fillStyle = drop.color;
        
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0; // ग्लो रिसेट
        
        // थोपालाई त्यसको आफ्नै गति (speed) अनुसार तल सार्ने
        drop.y += drop.speed;
        
        // यदि थोपो स्क्रिनभन्दा बाहिर गयो भने त्यसलाई हटाउने (Memory बचाउन)
        if (y > canvas.height) {
          drops.splice(j, 1);
          
          // थोपो सकिएपछि सोही कोलममा ९०% सम्भावनाका साथ तुरुन्तै नयाँ थोपो माथिबाट खसाउने
          if (Math.random() > 0.1) {
            drops.push(createDrop(i));
          }
        }
      }
    }
    
    requestAnimationFrame(drawMatrix);
  }
  
  drawMatrix();
  // === ❤️ MULTIPLE DROPS MATRIX RAIN LOGIC END ===
}, { once: true });


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