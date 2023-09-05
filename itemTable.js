ocument.addEventListener('DOMContentLoaded', () => {
  // Initialize or load item table state
  renderItemTable();

  // Add change listener to checkboxes
  document.getElementById('itemTable').addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
      saveItemTable();
    }
  });

  // Add sort listener to sortable columns
  document.querySelectorAll('.sortable').forEach(header => {
    header.addEventListener('click', handleSort);
  });

  // Add filter listeners to filter inputs
  document.querySelectorAll('#itemTable thead input[type="text"]').forEach(input => {
    input.addEventListener('input', handleFilter);
  });
});

let currentSort = { column: null, ascending: true };

function handleSort(event) {
  const column = event.target.textContent.toLowerCase();
  currentSort.ascending = currentSort.column === column ? !currentSort.ascending : true;
  currentSort.column = column;

  renderItemTable();
}

function handleFilter() {
  renderItemTable();
}

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
      // Sort based on current column and direction
      if (currentSort.column) {
        data.sort((a, b) => {
          const valA = a[currentSort.column];
          const valB = b[currentSort.column];
          return currentSort.ascending ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
        });
      }

      // Filtering
      const filterName = document.getElementById('filter-name')?.value.toLowerCase() || '';
      const filterType = document.getElementById('filter-type')?.value.toLowerCase() || '';
      const filterRarity = document.getElementById('filter-rarity')?.value.toLowerCase() || '';

      const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(filterName) &&
        item.type.toLowerCase().includes(filterType) &&
        item.rarity.toLowerCase().includes(filterRarity)
      );

      // Populate the table
      filteredData.forEach((item, index) => {
        const savedItem = savedItems.find(saved => saved.name === item.name);
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

      // Close the table body
      tableHTML += '</tbody>';

      // Update the table's HTML
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
