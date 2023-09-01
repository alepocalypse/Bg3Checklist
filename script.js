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

                        if (item.url) {
                            // Create a div to contain the label text and the link icon
                            const labelContainer = document.createElement('div');

                            // Create an <i> element for the Font Awesome icon
                            const linkIcon = document.createElement('i');
                            linkIcon.classList.add('fas', 'fa-link'); // Add Font Awesome classes for the link icon
                            linkIcon.style.marginRight = '5px'; // Adjust the margin to control the position
                            linkIcon.style.cursor = 'pointer'; // Change cursor to pointer to indicate it's clickable

                            // Create a link element for the label text
                            const linkText = document.createElement('a');
                            linkText.href = item.url;
                            linkText.target = '_blank'; // Open the link in a new tab
                            linkText.textContent = labelText.replace(/<[^>]*>/g, ''); // Remove HTML tags

                            // Append the link icon and link text to the label container
                            labelContainer.appendChild(linkIcon);
                            labelContainer.appendChild(linkText);

                            // Append the label container to the label
                            label.appendChild(labelContainer);
                        } else {
                            // If no URL, display the label text as it is
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
                                // If no URL and no spoiler, display the label text as it is
                                label.textContent = labelText;
                            }
                        }

                        // Add the checkbox before the label
                        checklistItem.appendChild(checkbox);

                        // Add the label to the checklist item
                        checklistItem.appendChild(label);

                        // Add the checklist item to the checklist div
                        checklistDiv.appendChild(checklistItem);
                    });

                    // Add the area item to the areas list
                    areasList.appendChild(areaItem);
                });

                // Add the areas list to the areas list div
                areasListDiv.appendChild(areasList);

                // Add the act header and areas list div to the act item
                actItem.appendChild(actHeader);
                actItem.appendChild(areasListDiv);

                // Add the act item to the checklist container
                checklistContainer.appendChild(actItem);
            });
        })
        .catch((error) => {
            console.error('Error loading checklist data:', error);
        });
}

function saveChecklist() {
    const checklistItems = [...document.querySelectorAll('input[type="checkbox"]')].map((checkbox) => ({
        text: checkbox.nextElementSibling.textContent,
        completed: checkbox.checked,
        spoilerRevealed: checkbox.nextElementSibling.classList.contains('spoiler-revealed'),
    }));

    localStorage.setItem('checklistItems', JSON.stringify(checklistItems));
}

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
