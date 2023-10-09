const times = [];
for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
        times.push({ hour: i, minute: j });
    }
}

const grid = document.getElementById('timeGrid');
const progressBar = document.getElementById('progressBar');

times.forEach((time, index) => {
    const cell = document.createElement('div');
    cell.className = 'timeCell';
    cell.textContent = time.minute === 0 ? String(time.hour).padStart(2, '0') : `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
    if (time.minute === 0) cell.classList.add('bold-text');

    if (localStorage.getItem(`cell-${index}`) === 'red') {
        cell.classList.add('red-highlight');
    }

    cell.addEventListener('click', function () {
        const isRed = cell.classList.toggle('red-highlight');
        localStorage.setItem(`cell-${index}`, isRed ? 'red' : 'not-red');

        // If it's the first cell in a row, toggle the entire row.
        if (time.minute === 0) {
            for (let k = 1; k < 4; k++) { // Assuming there are 4 cells in a row.
                const siblingIndex = index + k;
                const siblingCell = grid.children[siblingIndex];
                siblingCell.classList.toggle('red-highlight', isRed);
                localStorage.setItem(`cell-${siblingIndex}`, isRed ? 'red' : 'not-red');
            }
        }
    });
    grid.appendChild(cell);
});

function updateTableAndProgressBar() {
    const now = new Date();
    const pacificTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    let exceededCount = 0;

    for (let i = 0; i < grid.children.length; i++) {
        const cell = grid.children[i];
        const [hour, minute] = cell.textContent.split(':').map(Number);
        const cellTime = new Date(pacificTime.toLocaleDateString());
        cellTime.setHours(minute ? hour : +hour);
        cellTime.setMinutes(minute || 0);

        if (pacificTime > cellTime) {
            exceededCount++;
            const proportion = i / grid.children.length;
            const red = Math.floor(255 * proportion);
            const green = Math.floor(255 * (1 - proportion));
            const color = `rgb(${red}, ${green}, 0)`;
            cell.style.backgroundColor = color;
        }
    }

    const progressPercentage = (exceededCount / times.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `${exceededCount} / ${times.length}`;
}

updateTableAndProgressBar();
setInterval(updateTableAndProgressBar, 60000);
