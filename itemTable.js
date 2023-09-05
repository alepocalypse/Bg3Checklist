document.addEventListener('DOMContentLoaded', () => {
  // Initialize or load item table state
  renderItemTable();

  // Add change listener to checkboxes
  document.getElementById('itemTable').addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
      saveItemTable();
    }
  });
});

function renderItemTable() {
  const itemTableContainer = document.getElementById('itemTableContainer');
  const savedItems = JSON.parse(localStorage.getItem('itemTableItems')) || [];
  fetch('itemsData.json')
    .then(response => response.json())
    .then(data => {
      let tableHTML = "<thead><tr><th>Check</th><th>Name</th><th>Type</th><th>Rarity</th></tr></thead><tbody>";
      data.forEach((item, index) => {
        const savedItem = savedItems.find((saved) => saved.name === item.name);
        const isChecked = savedItem ? savedItem.checked : false;
        tableHTML += `
          <tr>
            <td><input type="checkbox" id="item-${index}" ${isChecked ? 'checked' : ''}></td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.rarity}</td>
          </tr>
        `;
      });
      tableHTML += "</tbody>";
      document.getElementById('itemTable').innerHTML = tableHTML;
    });
}

function saveItemTable() {
  const checkboxes = document.querySelectorAll('#itemTable input[type="checkbox"]');
  const savedItems = Array.from(checkboxes).map((checkbox, index) => {
    const row = checkbox.closest('tr');
    return {
      name: row.cells[1].textContent,
      checked: checkbox.checked,
    };
  });
  localStorage.setItem('itemTableItems', JSON.stringify(savedItems));
}
