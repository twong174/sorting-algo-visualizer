// Initialize comparison and swap counters
let comparisons = 0;
let swaps = 0;

// Add event listener to the sort button
document.getElementById("sortBtn").addEventListener("click", async () => {
    const input = document.getElementById("numbersInput").value;
    const errorMessage = document.getElementById("errorMessage");
    const barsContainer = document.getElementById("bars");
    errorMessage.style.display = "none"; // Hide error message

    // Clear previous data
    comparisons = 0;
    swaps = 0;
    updateStats(); // Update displayed stats
    barsContainer.innerHTML = ""; // Clear previous bars

    // Process input
    const numbers = input.split(",").map(Number);
    if (numbers.some(isNaN)) {
        errorMessage.innerText = "Please enter valid numbers.";
        errorMessage.style.display = "block"; // Show error message
        return;
    }

    // Create visualization bars
    createBars(numbers);

    // Get selected algorithm and initiate sorting
    const algorithm = document.getElementById("algorithmSelect").value;
    switch (algorithm) {
        case "bubble":
            await bubbleSort(numbers);
            break;
        case "quick":
            await quickSort(numbers, 0, numbers.length - 1);
            break;
        case "selection":
            await selectionSort(numbers);
            break;
        case "insertion":
            await insertionSort(numbers);
            break;
    }
});

// Create bars for visualization
function createBars(numbers) {
    const barsContainer = document.getElementById("bars");
    numbers.forEach(num => {
        const bar = document.createElement("li");
        bar.className = "bar";
        bar.style.height = `${num * 3}px`; // Scale for visualization
        bar.innerHTML = `<div class="number-label">${num}</div>`;
        barsContainer.appendChild(bar);
    });
}

// Bubble Sort algorithm
async function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            comparisons++;
            updateStats();
            updateBarClass(j, j + 1, 'comparing');
            await waitForAnimation();

            if (arr[j] > arr[j + 1]) {
                swaps++;
                updateStats();
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                updateBars(arr);
                updateBarClass(j, j + 1, 'swapping');
                await waitForAnimation();
            }
            updateBarClass(j, j + 1); // Reset classes
        }
    }
    markSorted(arr); // Mark bars as sorted
}

// Quick Sort algorithm
async function quickSort(arr, left, right) {
    if (left < right) {
        const pivotIndex = await partition(arr, left, right);
        await quickSort(arr, left, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, right);
    } else if (left === right) {
        markSorted(arr);
    }
}

// Partition function for Quick Sort
async function partition(arr, left, right) {
    const pivotValue = arr[right];
    let pivotIndex = left;

    for (let i = left; i < right; i++) {
        comparisons++;
        updateStats();
        updateBarClass(i, right, 'comparing');
        await waitForAnimation();

        if (arr[i] < pivotValue) {
            swaps++;
            updateStats();
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            updateBars(arr);
            pivotIndex++;
            updateBarClass(i, pivotIndex - 1, 'swapping');
            await waitForAnimation();
        }
        updateBarClass(i, right); // Reset class
    }

    // Place pivot in correct position
    [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
    updateBars(arr);
    markSorted(arr);
    return pivotIndex; // Return pivot index
}

// Selection Sort algorithm
async function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < arr.length; j++) {
            comparisons++;
            updateStats();
            updateBarClass(j, minIndex, 'comparing');
            await waitForAnimation();

            if (arr[j] < arr[minIndex]) {
                minIndex = j; // Update minIndex if a smaller element is found
            }
            updateBarClass(j, minIndex); // Reset class
        }

        if (minIndex !== i) {
            swaps++;
            updateStats();
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            updateBars(arr);
            updateBarClass(i, minIndex, 'swapping');
            await waitForAnimation();
        }
    }
    markSorted(arr); // Mark bars as sorted
}

// Insertion Sort algorithm
async function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;

        // Move elements greater than key to one position ahead
        while (j >= 0 && arr[j] > key) {
            comparisons++;
            updateStats();
            updateBarClass(j, j + 1, 'comparing');
            await waitForAnimation();

            arr[j + 1] = arr[j];
            j--;
            updateBars(arr);
            updateBarClass(j + 1, j + 2, 'swapping');
            await waitForAnimation();
        }
        arr[j + 1] = key;
        updateBars(arr);
    }
    markSorted(arr); // Mark bars as sorted
}

// Update visualization bars
function updateBars(arr) {
    const barsContainer = document.getElementById("bars");
    barsContainer.innerHTML = ''; // Clear existing bars
    arr.forEach((num, index) => {
        const bar = document.createElement("li");
        bar.className = "bar";
        bar.style.height = `${num * 3}px`; // Scale for visualization
        bar.innerHTML = `
            <div class="number-label">${num}</div>
            <div class="index-label">${index}</div>`; // Include index label
        barsContainer.appendChild(bar);
    });
}

// Update bar classes for highlighting comparisons/swaps
function updateBarClass(index1, index2, className) {
    const barsContainer = document.getElementById("bars");
    const bar1 = barsContainer.children[index1];
    const bar2 = barsContainer.children[index2];

    if (bar1) bar1.classList.toggle(className, true);
    if (bar2) bar2.classList.toggle(className, true);

    if (className) {
        setTimeout(() => {
            if (bar1) bar1.classList.toggle(className, false);
            if (bar2) bar2.classList.toggle(className, false);
        }, 500);
    }
}

// Wait for animation based on user-selected speed
function waitForAnimation() {
    const speed = document.getElementById("speedRange").value;
    return new Promise(resolve => setTimeout(resolve, speed));
}

// Update statistics display
function updateStats() {
    document.getElementById("comparisons").innerText = comparisons;
    document.getElementById("swaps").innerText = swaps;
}

// Mark bars as sorted visually
function markSorted(arr) {
    const barsContainer = document.getElementById("bars");
    for (let i = 0; i < arr.length; i++) {
        const bar = barsContainer.children[i];
        bar.classList.add('sorted'); // Add 'sorted' class for completed bars
    }
}

// Reset functionality for clearing inputs and stats
document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("numbersInput").value = "";
    document.getElementById("bars").innerHTML = "";
    comparisons = 0;
    swaps = 0;
    updateStats(); // Reset displayed stats
    document.getElementById("errorMessage").style.display = "none"; // Hide error message
});
