import React, { useContext } from 'react';
import tableContext from '../contexts/tableContext';
import Planet from './Planet';

function Table() {
  const {
    data,
    inputHandler,
    currFilter: { value, column },
    nameFilter: { filterByName: { name } },
    numericFilter,
    filteredData,
    addFilter,
    removeFilter,
    removeAllFilters,
    filtered,
  } = useContext(tableContext);

  const columns = [
    'population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water',
  ];

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
          value={ column }
        >
          {columns.map((currColumn) => !filtered[currColumn]
            && (
              <option
                key={ currColumn }
                value={ currColumn }
              >
                { currColumn }
              </option>))}
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
          onClick={ addFilter }
          data-testid="button-filter"
        >
          Filter
        </button>
      </section>
      <section>
        {filtered.filtered
          && (
            <>
              <button
                type="button"
                data-testid="button-remove-filters"
                onClick={ removeAllFilters }
              >
                Remove All Filters
              </button>
              {
                numericFilter.filterByNumericValues
                  .map((filter, i) => filter !== 'filtered'
            && (
              <span
                data-testid="filter"
                key={ `${filter.column} - ${i}` }
              >
                {`${filter.column} ${filter.comparison} ${filter.value}`}
                <button
                  type="button"
                  onClick={ removeFilter }
                  value={ filter.column }
                >
                  X
                </button>
              </span>))
              }
            </>)}
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
          { filtered.filtered
            ? <Planet data={ filteredData } name={ name } />
            : <Planet data={ data } name={ name } />}
        </tbody>
      </table>
    </>
  );
}

export default Table;
