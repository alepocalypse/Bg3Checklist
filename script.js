const checklist = document.getElementById('checklist');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

import checklistData from './checklistData.js';

function saveChecklist() {
    // Save checklist items to local storage
    const items = Array.from(checklist.children).map((item) => ({
        text: item.querySelector('span').textContent,
        completed: item.querySelector('input').checked,
    }));

    localStorage.setItem('checklistItems', JSON.stringify(items));
}
