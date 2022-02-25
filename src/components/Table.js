import React, { useContext } from 'react';
import tableContext from '../contexts/tableContext';
import Planet from './Planet';

function Table() {
  const {
    data,
    filteredData,
    nameFilter: { filterByName: { name } },
    numericFilter: { filterByNumericValues: [{ value }] },
    inputHandler,
    filterTable,
    filtered,
  } = useContext(tableContext);

  return (
    <>
      <section>
        <input
          type="text"
          onChange={ inputHandler }
          data-testid="name-filter"
          id="name-filter"
        />
        <select
          data-testid="column-filter"
          onChange={ inputHandler }
          id="column"
        >
          <option value="population">population</option>
          <option value="orbital_period">orbital_period</option>
          <option value="diameter">diameter</option>
          <option value="rotation_period">rotation_period</option>
          <option value="surface_water">surface_water</option>
        </select>
        <select
          data-testid="comparison-filter"
          onChange={ inputHandler }
          id="comparison"
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
        <input
          type="number"
          data-testid="value-filter"
          onChange={ inputHandler }
          id="value"
          value={ value }
        />
        <button
          type="button"
          onClick={ filterTable }
          data-testid="button-filter"
        >
          Filter
        </button>
      </section>
      <table>
        <thead>
          <tr>
            {data.length > 0
            && Object.keys(data[0]).map((key) => (
              key !== 'residents'
              && <th key={ key }>{ key }</th>
            ))}
          </tr>
        </thead>
        <tbody>
          { filtered && filteredData.length > 0
            ? <Planet data={ filteredData } name={ name } />
            : <Planet data={ data } name={ name } />}
        </tbody>
      </table>
    </>
  );
}

export default Table;
