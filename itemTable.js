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
  
  // Create the table header
  let tableHTML = `
    <thead>
      <tr>
        <th>Check</th>
        <th class="sortable">Name</th>
        <th class="sortable">Type</th>
        <th class="sortable">Rarity</th>
      </tr>
      <tr>
        <th></th>
        <th><input type="text" id="filter-name"></th>
        <th><input type="text" id="filter-type"></th>
        <th><input type="text" id="filter-rarity"></th>
      </tr>
    </thead>
    <tbody>
  `;
  
  fetch('itemsData.json')
    .then(response => response.json())
    .then(data => {
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
