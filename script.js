// Audio Control
let audioPlaying = false;
const audio = new Audio('mixkit-games-music-706.mp3');

function toggleAudio() {
  const audioControlButton = document.querySelector('.audio-control button i');
  if (audioPlaying) {
    audio.pause();
    audioControlButton.classList.remove('fa-pause');
    audioControlButton.classList.add('fa-play');
  } else {
    audio.play();
    audioControlButton.classList.remove('fa-play');
    audioControlButton.classList.add('fa-pause');
  }
  audioPlaying = !audioPlaying;
}

// Decrypt Image and Check Answer
async function submitAnswer() {
  const answer = document.getElementById('answer').value.trim();
  const storedHash = '9251f129e36d22db1b07c86a83bc9268948d98bd80be3b9c6eb8c48ed0ef22ac';
  
  // Hash the user's input
  const answerHash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(answer)
  );
  const hexHash = Array.from(new Uint8Array(answerHash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (hexHash === storedHash) {
    decryptImage(answer, 'http://localhost:8080/images/challenge2.png.enc');
  } else {
    alert('Incorrect answer! Try again.');
  }
}

// Decrypt Image Function
async function decryptImage(password, imagePath) {
try {
    // Fetch the encrypted image data
    const response = await fetch(imagePath);
    const encryptedBase64 = await response.text(); // Assuming the encrypted data is Base64 encoded
    const encryptedBlob = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

    // Extract the IV and encrypted content
    const iv = encryptedBlob.slice(0, 16); // First 16 bytes are the IV
    const encryptedContent = encryptedBlob.slice(16); // Remaining bytes are the encrypted data

    // Derive the cryptographic key from the password
    const passwordKey = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)); // SHA-256 hash of the password
    const key = await crypto.subtle.importKey(
        "raw",
        passwordKey,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    key,
    encryptedContent
    );

    // Remove PKCS#7 padding
    const decryptedArray = new Uint8Array(decryptedData);
    const paddingLength = decryptedArray[decryptedArray.length - 1];
    const unpaddedData = decryptedArray.slice(0, decryptedArray.length - paddingLength);

    // Convert decrypted data to Base64 and display the image
    const base64Image = btoa(
    String.fromCharCode(...unpaddedData)
    );
    document.getElementById('challenge-image').src = 'data:image/png;base64,' + base64Image;
} catch (err) {
    alert('Error decrypting the image. Make sure your answer is correct.');
    console.error(err);
}
}
  

// Matrix Effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const fontSize = 16; // Size of each character
const columns = Math.floor(canvas.width / fontSize); // Number of columns
const drops = Array(columns).fill(0); // Array to track Y position for each column

function drawMatrix() {
  // Clear the canvas with a transparent black overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set text properties
  ctx.fillStyle = '#0f0'; // Green text
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    // Generate a random character from Katakana Unicode range
    const text = String.fromCharCode(0x30A0 + Math.random() * 96);

    // Draw the character at the current position
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Move the character down the screen
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      // Reset the drop to the top randomly
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Animate the matrix effect
setInterval(drawMatrix, 50);

function showWhiteRabbit() {
    const rabbit = document.getElementById('white-rabbit');
    const container = document.getElementById('rabbit-container');
  
    // Generate random position within the container
    const randomX = Math.random() * (window.innerWidth - 50); // Ensure the rabbit stays within screen bounds
    const randomY = Math.random() * (window.innerHeight - 50);
  
    // Position the rabbit
    rabbit.style.left = `${randomX}px`;
    rabbit.style.top = `${randomY}px`;
  
    // Fade in the rabbit
    rabbit.style.opacity = 1;
  
    // Fade out after a delay
    setTimeout(() => {
      rabbit.style.opacity = 0;
    }, 4000); // Rabbit stays visible for 2 seconds
  }
  
  // Repeatedly show the rabbit at random intervals
  setInterval(() => {
    showWhiteRabbit();
  }, 60000); // Adjust interval (5000ms = 5 seconds)
  