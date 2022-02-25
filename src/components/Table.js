import React, { useContext } from 'react';
import tableContext from '../contexts/tableContext';
import Planet from './Planet';

function Table() {
  const {
    data,
    inputHandler,
    currFilter: { value },
    nameFilter: { filterByName: { name } },
    numericFilter,
    filteredData,
    addFilter,
    removeFilter,
    removeAllFilters,
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
          { !filtered.population
          && <option value="population">population</option>}
          { !filtered.orbital_period
          && <option value="orbital_period">orbital_period</option>}
          { !filtered.diameter
          && <option value="diameter">diameter</option>}
          { !filtered.rotation_period
          && <option value="rotation_period">rotation_period</option>}
          { !filtered.surface_water
          && <option value="surface_water">surface_water</option>}
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
                numericFilter.filterByNumericValues.map((filter) => filter !== 'filtered'
            && (
              <button
                type="button"
                key={ filter.column }
                onClick={ removeFilter }
                value={ filter.column }
                data-testid="filter"
              >
                {`${filter.column} ${filter.comparison} ${filter.value} X`}
              </button>))
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
