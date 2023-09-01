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

                // Create a header element for the act
                const actHeader = document.createElement('h1');
                actHeader.textContent = act.name;
                actHeader.classList.add('act-header'); // Add a class for styling

                // Create a div to contain the area lists
                const areasListDiv = document.createElement('div');
                areasListDiv.classList.add('area-lists');

                actHeader.addEventListener('click', () => {
                    // Toggle the visibility of the area lists when the act header is clicked
                    if (areasListDiv.style.display === 'none') {
                        areasListDiv.style.display = 'block';
                    } else {
                        areasListDiv.style.display = 'none';
                    }
                });

                // Create a ul element to contain the area lists
                const areasList = document.createElement('ul');

                act.areas.forEach((area) => {
                    const areaItem = document.createElement('li');

                    // Create a header element for the area
                    const areaHeader = document.createElement('h2');
                    areaHeader.textContent = area.header || area.name; // Use the header if available, otherwise use the name
                    areaHeader.classList.add('area-header'); // Add a class for styling

                    // Create a div to contain the checklist items
                    const checklistDiv = document.createElement('div');
                    checklistDiv.classList.add('area-checklist'); // Add a class for styling
                    checklistDiv.style.display = 'none'; // Initially hide the checklist

                    areaHeader.addEventListener('click', () => {
                        // Toggle the checklist visibility when the area header is clicked
                        if (checklistDiv.style.display === 'none') {
                            checklistDiv.style.display = 'block';
                        } else {
                            checklistDiv.style.display = 'none';
                        }
                    });

                    areaItem.appendChild(areaHeader);
                    areaItem.appendChild(checklistDiv);

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

                        // Check if the item has a URL
                        if (item.url) {
                            const urlIcon = document.createElement('a');
                            urlIcon.href = item.url;
                            urlIcon.target = '_blank'; // Open the link in a new tab
                            urlIcon.textContent = '\u127760'; // Unicode for the globe icon
                            urlIcon.style.paddingLeft = '5px'; // Add some space between text and icon
                            label.appendChild(urlIcon);
                        }

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
                            label.innerHTML = labelText; // Use innerHTML to render HTML
                        }

                        checklistItem.appendChild(checkbox);
                        checklistItem.appendChild(label);
                        checklistDiv.appendChild(checklistItem);
                    });

                    areasList.appendChild(areaItem);
                });

                areasListDiv.appendChild(areasList);
                actItem.appendChild(actHeader);
                actItem.appendChild(areasListDiv);
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

// Add event listeners to the area and act headers for collapsing/expanding
const headers = document.querySelectorAll('.area-header, .act-header');
headers.forEach((header) => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling; // Get the content associated with the header
        content.style.display = content.style.display === 'none' ? 'block' : 'none'; // Toggle visibility
    });
});

// Event listener for the "Save Checklist" button
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', () => {
    saveChecklist();
    alert('Checklist saved locally.');
});

// Event listener for clearing local data
const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', () => {
    const confirmed = window.confirm('Are you sure you want to clear your local data? This action cannot be undone.');

    if (confirmed) {
        // User confirmed, clear local data
        localStorage.removeItem('checklistItems');
        alert('Local data cleared.');
        // Reload the checklist to reflect the changes
        location.reload();
    }
});
// Call the renderChecklist function to load and render the data
renderChecklist();
