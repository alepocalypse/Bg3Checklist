import React, { useEffect, useState } from 'react';
import './Checklist.css'; // Import your CSS file

const Checklist = () => {
  const [checklistData, setChecklistData] = useState([]);
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedItems = localStorage.getItem('selectedItems');
    return savedItems ? new Set(JSON.parse(savedItems)) : new Set();
  });

  const handleCheckboxChange = (itemId, isSelected) => {
    setSelectedItems(prevSelectedItems => {
      const newSelectedItems = new Set(prevSelectedItems);

      if (isSelected) {
        newSelectedItems.add(itemId);
      } else {
        newSelectedItems.delete(itemId);
      }

      return newSelectedItems;
    });
  };

  useEffect(() => {
    const savedItems = localStorage.getItem('selectedItems');
    console.log('Loaded items from local storage:', savedItems);
    if (savedItems) {
      setSelectedItems(new Set(JSON.parse(savedItems)));
    }
  }, []);
  
  useEffect(() => {
    const itemsToSave = JSON.stringify(Array.from(selectedItems));
    console.log('Saving items to local storage:', itemsToSave);
    localStorage.setItem('selectedItems', itemsToSave);
}, [selectedItems]);

  useEffect(() => {
    fetch('./checklistData.json')
      .then(response => response.json())
      .then(data => setChecklistData(data.acts))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <h1>Quests and Stuff to do checklist</h1>
      <ul>
        {checklistData.map((act, index) => (
          <li key={index}>
            <h1>{act.name}</h1>
            <ul>
              {act.areas.map((area, i) => (
                <li key={i}>
                  <h2>{area.name}</h2>
                  <ul>
                    {area.checklist.map((item, j) => {
                      const itemId = `${index}-${i}-${j}`;
                      return (
                        <li key={j}>
                          <input
                            type="checkbox"
                            checked={selectedItems.has(itemId)}
                            onChange={(e) => handleCheckboxChange(itemId, e.target.checked)}
                          />
                          {item.text}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checklist;