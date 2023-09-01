window.addEventListener('DOMContentLoaded', () => {

import checklistData from './ChecklistData.js';

function saveChecklist() {
    // Save checklist items to local storage
    const items = Array.from(checklist.children).map((item) => ({
        text: item.querySelector('span').textContent,
        completed: item.querySelector('input').checked,
    }));

    localStorage.setItem('checklistItems', JSON.stringify(items));
}

const actsContainer = document.getElementById('acts');

// Function to render the checklist
function renderChecklist() {
    actsContainer.innerHTML = '';

    checklistData.acts.forEach((act) => {
        const actItem = document.createElement('li');
        actItem.textContent = act.name;

        const areasList = document.createElement('ul');
        act.areas.forEach((area) => {
            const areaItem = document.createElement('li');
            areaItem.textContent = area.name;

            const checklist = document.createElement('ul');
            area.checklist.forEach((item) => {
                const checklistItem = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.completed;
                checklistItem.appendChild(checkbox);
                checklistItem.appendChild(document.createTextNode(item.text));
                checklist.appendChild(checklistItem);
            });

            areaItem.appendChild(checklist);
            areasList.appendChild(areaItem);
        });

        actItem.appendChild(areasList);
        actsContainer.appendChild(actItem);
    });
}

// Event listener for marking items as completed
actsContainer.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        // Find the corresponding checklist item and update its completion status
        const text = event.target.nextElementSibling.textContent;
        checklistData.acts.forEach((act) => {
            act.areas.forEach((area) => {
                area.checklist.forEach((item) => {
                    if (item.text === text) {
                        item.completed = event.target.checked;
                        saveChecklist();
                    }
                });
            });
        });
    }
});

// Initial rendering
renderChecklist();
});
