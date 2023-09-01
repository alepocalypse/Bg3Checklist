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
    
function saveChecklist() {
    const checklistContainer = document.getElementById('checklist');
    const items = Array.from(checklistContainer.children).map((item) => ({
        text: item.querySelector('input[type="checkbox"] + label').textContent,
        completed: item.querySelector('input[type="checkbox"]').checked,
    }));

    // Store the checklist items in local storage
    localStorage.setItem('checklistItems', JSON.stringify(items));
}

const actsContainer = document.getElementById('acts');
actsContainer.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        // Rest of your event listener code...
    }
});

const areaContainer = document.getElementById('area');
// Event listener for some interaction with areaContainer
areaContainer.addEventListener('click', (event) => {
    // Handle interactions with the area container, if needed...
});

// Event listener for marking items as completed
const checklistContainer = document.getElementById('checklist');
checklistContainer.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        // Find the corresponding checklist item and update its completion status
        const text = event.target.nextElementSibling.textContent;
        const storedItems = JSON.parse(localStorage.getItem('checklistItems')) || [];

        storedItems.forEach((storedItem) => {
            if (storedItem.text === text) {
                storedItem.completed = event.target.checked;
            }
        });

        // Save the updated checklist
        localStorage.setItem('checklistItems', JSON.stringify(storedItems));
    }
});
                             
// Event listener for the "Save Checklist" button
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', () => {
    saveChecklist();
    alert('Checklist saved locally.');
});
    
// Call the renderChecklist function to load and render the data
renderChecklist();
