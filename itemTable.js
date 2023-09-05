document.addEventListener('DOMContentLoaded', () => {
  // Initialize or load item table state
  renderItemTable();
});

function attachEventListeners() {
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

  // Add filter listeners to filter inputs and selects
  document.querySelectorAll('#itemTable thead input[type="text"], #itemTable thead select').forEach(input => {
    input.addEventListener('input', handleFilter);
  });
}

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
  const savedItems = JSON.parse(localStorage.getItem('itemTableItems')) || [];

  fetch('itemsData.json')
    .then(response => response.json())
    .then(data => {
      const distinctTypes = Array.from(new Set(data.map(item => item.type)));
      const distinctRarities = Array.from(new Set(data.map(item => item.rarity)));
      const typeOptions = distinctTypes.map(type => `<option value="${type}">${type}</option>`).join('');
      const rarityOptions = distinctRarities.map(rarity => `<option value="${rarity}">${rarity}</option>`).join('');

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
            <th><select id="filter-type" multiple>${typeOptions}</select></th>
            <th><select id="filter-rarity" multiple>${rarityOptions}</select></th>
          </tr>
        </thead>
        <tbody>
      `;

      if (currentSort.column) {
        data.sort((a, b) => {
          const valA = a[currentSort.column];
          const valB = b[currentSort.column];
          return currentSort.ascending ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
        });
      }

      const filterName = document.getElementById('filter-name')?.value.toLowerCase() || '';
      const filterType = document.getElementById('filter-type')?.value || '';
      const filterRarity = document.getElementById('filter-rarity')?.value || '';

      const filteredData = data.filter(item => {
        return item.name.toLowerCase().includes(filterName) &&
               (filterType ? filterType.includes(item.type) : true) &&
               (filterRarity ? filterRarity.includes(item.rarity) : true);
      });

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

      tableHTML += '</tbody>';
      document.getElementById('itemTable').innerHTML = tableHTML;

      // Re-attach event listeners
      attachEventListeners();
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
