import React from 'react';
import './style/index.css';
import Table from './components/Table';
import TableProvider from './providers/tableProvider';

function App() {
  return (
    <TableProvider>
      <Table />
    </TableProvider>
  );
}

export default App;
