const progressBar = document.getElementById('progress-bar');

function updateProgressBar(progress, isTracing) {
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute('aria-valuenow', progress);

  if (isTracing) {
    // Gradient for red trace (reverse direction)
    progressBar.style.background = `linear-gradient(90deg, #ff0000, #ff7700)`;
    progressBar.style.transition = 'width 0.5s ease, background 0.5s ease'; // Smooth transition
  } else {
    // Gradient for green route building (normal direction)
    progressBar.style.background = `linear-gradient(90deg, #00ff00, #0077ff)`;
    progressBar.style.transition = 'width 0.5s ease, background 0.5s ease'; // Smooth transition
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

// Set to track completed hashes
const completedHashes = new Set();

async function submitAnswer() {
  const answer = document.getElementById('answer').value.trim();
  const challengeHeader = document.getElementById("challenge-header");

  try {
    // Fetch the hash-to-image mapping from the JSON file
    const response = await fetch('assets/imageHashes.json');
    const data = await response.json();

    // Hash the user's input
    const answerHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(answer)
    );
    const hexHash = Array.from(new Uint8Array(answerHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Check if the hash is already completed
    if (completedHashes.has(hexHash)) {
      alert('Incorrect answer! Try again.');
      return;
    }

    // Use the hash as a key to find the next image
    const nextImage = data[hexHash];

    if (nextImage) {
      // Mark the current hash as completed
      completedHashes.add(hexHash);

      // Decrypt the next image
      decryptImage(answer, `http://localhost:8080/images/${nextImage}.enc`);

      // Increment the challenge number in the header
      const currentChallenge = parseInt(challengeHeader.textContent.match(/\d+/), 10);
      if (!isNaN(currentChallenge)) {
        challengeHeader.textContent = `Challenge ${currentChallenge + 1}`;
      }
    } else {
      alert('Incorrect answer! Try again.');
    }
  } catch (err) {
    console.error('Error submitting answer:', err);
    alert('An error occurred while processing your answer. Please try again.');
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
  


let logs = []; // Store logs
let currentLogIndex = 0; // Track the current log being displayed

// Function to load logs from the JSON file
async function loadLogs() {
  try {
    const response = await fetch('assets/logs.json'); // Adjust the path to your file
    logs = await response.json(); // Parse JSON directly
    console.log('Logs loaded:', logs);
    generateFakeLogs(); // Start generating logs after loading
  } catch (error) {
    console.error('Error loading logs:', error);
  }
}

// Function to generate fake logs
function generateFakeLogs() {
  const networkInfo = document.getElementById('network-info');

  if (currentLogIndex < logs.length) {
    const log = logs[currentLogIndex];
    const logElement = document.createElement('li');
    networkInfo.appendChild(logElement);

    // Display the prompt and type the command
    const promptHtml = `<span class="prefix">${log.prompt} </span>`;
    const commandHtml = `<span class="command"></span>`;
    logElement.innerHTML = promptHtml + commandHtml;
    const commandElement = logElement.querySelector('.command');

    // Auto-scroll and simulate typing for the command
    autoScroll(networkInfo);
    simulateTyping(log.command, commandElement, () => {
      // Display the output after typing
      log.output.forEach((line) => {
        const outputElement = document.createElement('li');
        outputElement.className = 'output';
        outputElement.textContent = line;
        networkInfo.appendChild(outputElement);
        autoScroll(networkInfo);
      });

      currentLogIndex++;
      setTimeout(generateFakeLogs, 3000); // Add delay between logs
    });
  } else {
    // Restart logs after a delay
    currentLogIndex = 0;
    setTimeout(generateFakeLogs, 8000); // Delay before restarting logs
  }
}

// Function to simulate typing
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

// Function to auto-scroll the container
function autoScroll(container) {
  container.scrollTop = container.scrollHeight; // Scroll to the bottom of the container
}

// Call the function to load logs
loadLogs();
  
  

  
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
  


