import React from 'react';
import './App.css';
import Table from './components/Table';
import TableProvider from './providers/tableProvider';

function App() {
  return (
    <>
      <header>
        <h1>Star Wars Project</h1>
      </header>
      <TableProvider>
        <Table />
      </TableProvider>
    </>
  );
}

export default App;
