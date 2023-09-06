// App.js

import React, { useState } from 'react';
import './App.css';
import Checklist from './components/Checklist';
import ItemList from './components/ItemList';

function App() {
  const [activeTab, setActiveTab] = useState('checklist');

  return (
    <div className="container">
      <h1>Baldur's Gate 3 Checklists</h1>
      <div className="tabs">
        <button
          className={activeTab === 'checklist' ? 'active' : ''}
          onClick={() => setActiveTab('checklist')}
        >
          Checklist
        </button>
        <button
          className={activeTab === 'itemlist' ? 'active' : ''}
          onClick={() => setActiveTab('itemlist')}
        >
          Act 1 Item List
        </button>
      </div>

      {activeTab === 'checklist' ? <Checklist /> : <ItemList />}
    </div>
  );
}

export default App;
