import React from 'react';
import './style/index.css';
import Table from './components/Table';
import TableProvider from './providers/tableProvider';

function App() {
  return (
    <>
      <header>
        <h1 className="header__h1">Star Wars Planets</h1>
      </header>
      <TableProvider>
        <Table />
      </TableProvider>
    </>
  );
}

export default App;
