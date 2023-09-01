window.addEventListener('DOMContentLoaded', () => {

// Function to fetch JSON data and render the checklist
function renderChecklist() {
    const checklistContainer = document.getElementById('checklist');

    // Fetch the JSON data
    fetch('checklistData.json')
        .then(response => response.json())
        .then(data => {
            // Use the fetched data to render the checklist
            data.acts.forEach(act => {
                const actItem = document.createElement('li');
                actItem.textContent = act.name;

                const areasList = document.createElement('ul');
                act.areas.forEach(area => {
                    const areaItem = document.createElement('li');
                    areaItem.textContent = area.name;

                    const checklist = document.createElement('ul');
                    area.checklist.forEach(item => {
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
                checklistContainer.appendChild(actItem);
            });
        })
        .catch(error => {
            console.error('Error loading checklist data:', error);
        });
}

// Call the renderChecklist function to load and render the data
renderChecklist();
    });
