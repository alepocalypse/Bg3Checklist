// Function to fetch JSON data and render the checklist
function renderChecklist() {
    const checklistContainer = document.getElementById('checklist');

    // Fetch the JSON data
    fetch('checklistData.json')
        .then((response) => response.json())
        .then((data) => {
            // Load the saved checklist items from local storage
            const savedItems = JSON.parse(localStorage.getItem('checklistItems')) || [];

            // Use the fetched data to render the checklist
            data.acts.forEach((act) => {
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

                        // Find the saved state for this checklist item
                        const savedItem = savedItems.find((saved) => saved.text === item.text);
                        if (savedItem) {
                            checkbox.checked = savedItem.completed;
                        } else {
                            checkbox.checked = item.completed;
                        }

                        const label = document.createElement('label');
                        let labelText = item.text;

                        // Check if the item has spoiler tags
                        if (labelText.includes('<span class=\'spoiler\'>')) {
                            const spoilerText = document.createElement('span');
                            spoilerText.innerHTML = labelText;
                            const spoilerSpan = spoilerText.querySelector('.spoiler');
                            spoilerSpan.classList.add('spoiler');

                            if (savedItem && savedItem.spoilerRevealed) {
                                spoilerSpan.classList.remove('spoiler');
                            } else {
                                // Add a click event listener to reveal the spoiler
                                spoilerSpan.addEventListener('click', () => {
                                    spoilerSpan.classList.remove('spoiler');
                                    if (savedItem) {
                                        savedItem.spoilerRevealed = true;
                                    } else {
                                        item.spoilerRevealed = true;
                                    }
                                    saveChecklist();
                                });
                            }

                            label.appendChild(spoilerText);
                        } else {
                            label.textContent = labelText;
                        }

                        checklistItem.appendChild(checkbox);
                        checklistItem.appendChild(label);
                        checklist.appendChild(checklistItem);
                    });

                    areaItem.appendChild(checklist);
                    areasList.appendChild(areaItem);
                });

                actItem.appendChild(areasList);
                checklistContainer.appendChild(actItem);
            });
        })
        .catch((error) => {
            console.error('Error loading checklist data:', error);
        });
}

// The saveChecklist function remains the same

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
