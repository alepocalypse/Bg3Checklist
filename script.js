const checklist = document.getElementById('checklist');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

addTaskBtn.addEventListener('click', addTask);

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <input type="checkbox">
            <span>${taskText}</span>
            <button class="delete">Delete</button>
        `;
        checklist.appendChild(listItem);
        taskInput.value = '';
        saveChecklist();
    }
}

checklist.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        e.target.parentElement.remove();
        saveChecklist();
    }
});

function saveChecklist() {
    // Save checklist items to local storage
    const items = Array.from(checklist.children).map((item) => ({
        text: item.querySelector('span').textContent,
        completed: item.querySelector('input').checked,
    }));

    localStorage.setItem('checklistItems', JSON.stringify(items));
}
