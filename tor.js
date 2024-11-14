const logFeed = document.getElementById("logFeed");
const triggerButton = document.getElementById("triggerButton");

// Generate a random IP address
const generateRandomIP = () =>
    `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

// Generate a fake node
const generateFakeNode = () => {
    const countries = ["Germany", "Sweden", "France", "Netherlands", "Canada", "Norway", "United Kingdom", "United States", "Japan", "Australia"];
    const cities = ["Frankfurt", "Stockholm", "Paris", "Amsterdam", "Montreal", "Oslo", "London", "Seattle", "Tokyo", "Sydney"];
    const isps = ["Hetzner Online GmbH", "Bahnhof AB", "OVH SAS", "LeaseWeb Netherlands B.V.", "OVH Hosting Inc.", "Green Mountain AS", "M247 Ltd", "DigitalOcean, LLC", "NTT Communications", "Vocus Communications"];

    const countryIndex = Math.floor(Math.random() * countries.length);
    const latency = `${Math.floor(Math.random() * 100) + 10}ms`;
    const bandwidth = `${Math.floor(Math.random() * 200) + 50} Mbps`;

    return {
        ip: generateRandomIP(),
        country: countries[countryIndex],
        city: cities[countryIndex],
        isp: isps[countryIndex],
        as: `AS${Math.floor(Math.random() * 99999)}`,
        hostname: `${cities[countryIndex].toLowerCase()}.torproject.org`,
        latency,
        bandwidth,
    };
};

// Generate a pool of fake nodes
const generateNodePool = (size) => {
    const nodePool = [];
    for (let i = 0; i < size; i++) {
        nodePool.push(generateFakeNode());
    }
    return nodePool;
};

// Log to the UI
const appendLog = (log) => {
    const logElement = document.createElement("div");
    logElement.innerHTML = log;
    logFeed.appendChild(logElement);

    // Scroll to bottom
    logFeed.scrollTop = logFeed.scrollHeight;

    // Remove excess logs
    if (logFeed.childNodes.length > 100) {
        logFeed.removeChild(logFeed.firstChild);
    }
};

// Create a circuit
const createCircuit = (nodePool, numberOfNodes) => {
    const circuit = [];
    let attempts = 0;

    while (circuit.length < numberOfNodes && attempts < 100) {
        const node = nodePool[Math.floor(Math.random() * nodePool.length)];
        if (!circuit.includes(node)) {
            circuit.push(node);
        }
        attempts++;
    }

    if (circuit.length < numberOfNodes) {
        console.error("Failed to create a valid circuit. Check node pool or logic.");
    }

    return circuit;
};

// Generate logs for circuit building
const generateLogsForCircuit = (circuit) => {
    const logs = [];
    circuit.forEach((node, index) => {
        const connectingLog = `[${randomTime()}] Connecting to node: <span class="ip-address">${node.ip}</span> (${node.hostname}, ${node.city}, ${node.country})`;
        const connectedLog = `[${randomTime()}] Connected to node: <span class="ip-address">${node.ip}</span> (${node.hostname}, ${node.city}, ${node.country}, ISP: ${node.isp}, AS: ${node.as}, Latency: ${node.latency}, Bandwidth: ${node.bandwidth})`;

        logs.push({ log: connectingLog, delay: 200 + Math.floor(Math.random() * 100) });
        logs.push({ log: connectedLog, delay: parseInt(node.latency) + Math.floor(Math.random() * 50) });
    });
    return logs;
};

const establishCircuit = async (numberOfNodes) => {
    // Step 1: Query directory servers and update node pool
    appendLog(`[${randomTime()}] Querying directory servers for updated node pool...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate directory server query delay
    const nodePool = generateNodePool(20);
    appendLog(`[${randomTime()}] Node pool updated. ${nodePool.length} nodes available.`);

    // Step 2: Build the circuit
    const circuit = createCircuit(nodePool, numberOfNodes);
    const logs = generateLogsForCircuit(circuit);

    for (let i = 0; i < logs.length; i++) {
        await new Promise(resolve => setTimeout(resolve, logs[i].delay));
        appendLog(logs[i].log);
    }

    const exitNode = circuit[circuit.length - 1];
    appendLog(
        `[${randomTime()}] Exit node established: <span class="ip-address exit-node">${exitNode.ip}</span> (${exitNode.city}, ${exitNode.country}, ISP: ${exitNode.isp}, Bandwidth: ${exitNode.bandwidth}, Latency: ${exitNode.latency})`
    );
};

// Random time generator
const randomTime = () => new Date().toISOString().slice(11, 19);

// Event listener for button
triggerButton.addEventListener("click", () => {
    const nodeCountInput = document.getElementById("nodeCount").value;
    const numberOfNodes = Math.min(Math.max(parseInt(nodeCountInput) || 5, 5), 10); // Clamp between 5 and 10
    establishCircuit(numberOfNodes);
});
