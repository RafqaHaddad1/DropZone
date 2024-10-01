const dropArea = document.querySelector('.drop-section');
const listSection = document.querySelector('.list-section');
const listContainer = document.querySelector('.list');
const fileSelector = document.querySelector('.file-selector');
const fileSelectorInput = document.querySelector('.file-selector-input');

// Upload files with browse button
fileSelector.onclick = () => fileSelectorInput.click();
fileSelectorInput.onchange = () => {
    [...fileSelectorInput.files].forEach((file) => {
        if (typeValidation(file.type)) {
            console.log(file);
            handleFile(file);
        }
    });
};

// Check the file type
function typeValidation(type) {
    const splitType = type.split('/')[0];
    return type === 'application/pdf' || splitType === 'image' || splitType === 'video';
}

// When file is over the drag area
dropArea.ondragover = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
        if (typeValidation(item.type)) {
            dropArea.classList.add('drag-over-effect');
        }
    });
};

// When file leaves the drag area
dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect');
};

// When file drops on the drag area
dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over-effect');
    if (e.dataTransfer.items) {
        [...e.dataTransfer.items].forEach((item) => {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (typeValidation(file.type)) {
                    handleFile(file);
                }
            }
        });
    } else {
        [...e.dataTransfer.files].forEach((file) => {
            if (typeValidation(file.type)) {
                handleFile(file);
            }
        });
    }
};

// Handle file function
function handleFile(file) {
    listSection.style.display = 'block';
    const li = document.createElement('li');
    li.classList.add('in-prog');
    li.innerHTML = `
        <div class="col">
            <img src="icons/${iconSelector(file.type)}" alt="">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${file.name}</div>
                <span>0%</span>
            </div>
            <div class="file-progress">
                <span></span>
            </div>
            <div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
        </div>
        <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg>
        </div>
    `;
    listContainer.prepend(li);

    // Simulate file upload progress
    simulateUploadProgress(file, li);

    // Add event listener to cancel file upload
    li.querySelector('.cross').onclick = () => li.remove();
}

// Simulate file upload progress
function simulateUploadProgress(file, li) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10; // Simulate progress increment
        if (progress >= 100) {
            clearInterval(interval);
            li.classList.add('complete');
            li.classList.remove('in-prog');
        }
        li.querySelectorAll('span')[0].innerHTML = progress + '%';
        li.querySelectorAll('span')[1].style.width = progress + '%';
    }, 500); // Update every 500ms
}

// Find icon for file
function iconSelector(type) {
    const splitType = (type.split('/')[0] === 'application') ? type.split('/')[1] : type.split('/')[0];
    return splitType + '.png';
}
