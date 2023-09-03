function renderChecklist() {
    console.log('Rendering checklist...'); // Added for logging
    const checklistContainer = document.getElementById('checklist');

    // Fetch the JSON data
    fetch('checklistData.json')
        .then((response) => response.json())
        .then((data) => {
            console.log('Fetched JSON data:', data); // Added for logging
            // Load the saved checklist items from local storage
            const savedItems = JSON.parse(localStorage.getItem('checklistItems')) || [];
            console.log('Loaded saved checklist items:', savedItems); // Added for logging

            // Iterate through the acts in the JSON data
            data.acts.forEach((act) => {
                // Create an act header element
                const actItem = document.createElement('li');

                // Create a header element for the act
                const actHeader = document.createElement('h1');
                actHeader.textContent = act.name;
                actHeader.classList.add('act-header'); // Add a class for styling
                actHeader.dataset.act = act.name; // Add the data-act attribute

                // Create a div to contain the area lists
                const areasListDiv = document.createElement('div');
                areasListDiv.classList.add('area-lists');

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

                    areaItem.appendChild(areaHeader);
                    areaItem.appendChild(checklistDiv);

                    area.checklist.forEach((item) => {
                        const checklistItem = createChecklistItem(item, savedItems);
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

function createChecklistItem(item, savedItems) {
    const checklistItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    // Find the saved state for this checklist item
    const savedItem = savedItems.find((saved) => saved.text === item.text);
    if (savedItem) {
        // Update the checkbox state based on the saved data
        checkbox.checked = savedItem.completed;
    } else {
        checkbox.checked = item.completed;
    }

    // Create a label element
    const label = document.createElement('label');

    // Create a span for the text
    const textSpan = document.createElement('span');
    textSpan.innerHTML = item.text;

    if (item.url) {
        // Create a clickable Font Awesome icon
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-external-link-alt'); // Font Awesome classes for an external link icon

        // Create a span to contain the icon
        const iconSpan = document.createElement('span');
        iconSpan.appendChild(icon);

        // Add the text span first
        label.appendChild(textSpan);

        // Create an anchor element to wrap the icon
        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank'; // Open the link in a new tab

        // Append the icon span to the anchor element
        link.appendChild(iconSpan);

        // Append the anchor element to the label
        label.appendChild(link);

        // Add a click event listener to the icon
        icon.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the default link behavior (opening in a new tab)
            window.open(item.url, '_blank'); // Open the link in a new tab
        });
    } else {
        // If there's no URL, just add the text span
        label.appendChild(textSpan);
    }

    // Add the checkbox before the label
    checklistItem.appendChild(checkbox);

    // Add the label to the checklist item
    checklistItem.appendChild(label);

    return checklistItem;
}


function saveChecklist() {
    console.log('Saving checklist...'); // Added for logging
    const checklistItems = [...document.querySelectorAll('input[type="checkbox"]')].map((checkbox) => {
        const text = checkbox.nextElementSibling.textContent;
        const spoilerRevealed = checkbox.nextElementSibling.querySelector('.spoiler:not(.spoiler)') === null;

        return {
            text: text,
            completed: checkbox.checked,
            spoilerRevealed: spoilerRevealed,
        };
    });

    localStorage.setItem('checklistItems', JSON.stringify(checklistItems));
    console.log('Checklist saved:', checklistItems); // Added for logging
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
        console.log('Updated checklist:', storedItems); // Added for logging
    }
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

document.addEventListener('DOMContentLoaded', () => {
    // Call renderChecklist to load and render the checklist
    renderChecklist();
});
