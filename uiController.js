document.addEventListener('DOMContentLoaded', function() {
    const toggleViewButton = document.getElementById('toggleView');
    const checklistContainer = document.getElementById('checklistContainer');
    const itemTableContainer = document.getElementById('itemTableContainer');

    toggleViewButton.addEventListener('click', function() {
        if (checklistContainer.classList.contains('hidden')) {
            checklistContainer.classList.remove('hidden');
            itemTableContainer.classList.add('hidden');
        } else {
            checklistContainer.classList.add('hidden');
            itemTableContainer.classList.remove('hidden');
        }
    });
});
