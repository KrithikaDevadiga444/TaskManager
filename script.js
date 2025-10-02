// ================== TASK MANAGER ==================
const taskName = document.getElementById('taskName');
const taskDesc = document.getElementById('taskDesc');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = "";

    tasks.forEach(task => {
        let li = document.createElement("li");
        li.className = task.completed ? "completed" : "";

        li.innerHTML = `
            <span>${task.name} - ${task.desc}</span>
            <div class="actions">
                <button onclick="toggleComplete(${task.id})">✔️</button>
                <button onclick="editTask(${task.id})">✏️</button>
                <button onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateProgress();
}

// Smooth progress + full green glow
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    if (progressBar && progressText) {
        progressBar.style.width = percent + "%";
        progressText.textContent = `${percent}% completed (${completed}/${total})`;

        // add glow when 100%
        if(percent === 100) {
            progressBar.classList.add('full');
        } else {
            progressBar.classList.remove('full');
        }
    }
}

function toggleComplete(id) {
    tasks = tasks.map(t => { if (t.id === id) t.completed = !t.completed; return t; });
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newName = prompt("Edit Task Name:", task.name);
        const newDesc = prompt("Edit Task Description:", task.desc);
        if (newName !== null && newName.trim() !== "") task.name = newName;
        if (newDesc !== null) task.desc = newDesc;
        saveTasks();
        renderTasks();
    }
}

// Add new task
if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
        if (taskName.value.trim() === '') return alert('Enter task name');
        const task = { 
            id: Date.now(), 
            name: taskName.value, 
            desc: taskDesc.value, 
            completed: false 
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskName.value = '';
        taskDesc.value = '';
    });
}

renderTasks();




// ================== DIARY ==================
const diaryList = document.getElementById('diaryList');
const newDiaryBtn = document.getElementById('newDiaryBtn');
const diaryForm = document.getElementById('diaryForm');
const diaryTitle = document.getElementById('diaryTitle');
const diaryDesc = document.getElementById('diaryDesc');
const addDiaryBtn = document.getElementById('addDiaryBtn');
const cancelDiaryBtn = document.getElementById('cancelDiaryBtn');

let diary = JSON.parse(localStorage.getItem('diary')) || [];

// Render diary as cards
function renderDiary() {
    if (!diaryList) return;
    diaryList.innerHTML = '';

    diary.forEach(entry => {
        const li = document.createElement('li');
        li.classList.add('diary-item');

        li.innerHTML = `
            <div class="diary-preview-wrapper">
                <a href="diary_detail.html?id=${entry.id}" class="diary-preview">
                    <strong>📌 ${entry.title}</strong><br>
                    <span>${entry.desc}</span>
                </a>
                <div class="diary-actions">
                    <button class="edit-btn" data-id="${entry.id}">✏️</button>
                    <button class="delete-btn" data-id="${entry.id}">🗑️</button>
                </div>
            </div>
        `;
        diaryList.appendChild(li);
    });

    // Add event listeners for edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const entry = diary.find(e => e.id == id);
            if (entry) {
                diaryForm.style.display = 'block';
                diaryTitle.value = entry.title;
                diaryDesc.value = entry.desc;
                addDiaryBtn.textContent = 'Update Entry';

                addDiaryBtn.onclick = () => {
                    entry.title = diaryTitle.value;
                    entry.desc = diaryDesc.value;
                    localStorage.setItem('diary', JSON.stringify(diary));
                    diaryTitle.value = '';
                    diaryDesc.value = '';
                    diaryForm.style.display = 'none';
                    addDiaryBtn.textContent = 'Add Entry';
                    renderDiary();
                };
            }
        });
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this entry?')) {
                diary = diary.filter(e => e.id != id);
                localStorage.setItem('diary', JSON.stringify(diary));
                renderDiary();
            }
        });
    });
}

// Show form
if (newDiaryBtn) newDiaryBtn.addEventListener('click', () => diaryForm.style.display = 'block');
if (cancelDiaryBtn) cancelDiaryBtn.addEventListener('click', () => diaryForm.style.display = 'none');

// Add diary entry
if (addDiaryBtn) {
    addDiaryBtn.addEventListener('click', () => {
        if (diaryTitle.value.trim() === '' || diaryDesc.value.trim() === '') {
            return alert('Please write both Title and Description 📝');
        }

        const entry = { 
            id: Date.now(), 
            title: diaryTitle.value, 
            desc: diaryDesc.value, 
            date: new Date().toLocaleDateString() 
        };

        diary.push(entry);
        localStorage.setItem('diary', JSON.stringify(diary));

        diaryTitle.value = '';
        diaryDesc.value = '';
        diaryForm.style.display = 'none';

        renderDiary();
    });
}

renderDiary();
