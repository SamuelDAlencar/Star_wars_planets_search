import React, { useContext } from 'react';
import tableContext from '../contexts/tableContext';
import Planet from './Planet';

function Table() {
  const {
    data,
    filteredData,
    COLUMNS,
    currFilter: { value, column, comparison },
    nameFilter: { filterByName: { name } },
    filters: { filterByNumericValues },
    activeFilters,
    inputHandler,
    addFilter,
    removeFilter,
    removeAllFilters,
    sortPlanets,
  } = useContext(tableContext);

  return (
    <>
      <section>
        <input
          type="text"
          onChange={ inputHandler }
          data-testid="name-filter"
          name="name-filter"
        />
        <select
          data-testid="column-filter"
          onChange={ inputHandler }
          id="column"
          value={ column }
        >
          {COLUMNS.map((currColumn) => !activeFilters[currColumn]
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
          value={ comparison }
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
        {activeFilters.isDataFiltered
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
                filterByNumericValues
                  .map((filter, i) => (
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
            </>
          )}
        <select
          data-testid="column-sort"
          name="select-column"
          onChange={ inputHandler }
        >
          {COLUMNS.map((currColumn) => (
            <option
              key={ currColumn }
              value={ currColumn }
            >
              { currColumn }
            </option>))}
        </select>
        <label htmlFor="asc">
          Ascendent
          <input
            type="radio"
            name="select-sort"
            value="ASC"
            data-testid="column-sort-input-asc"
            onChange={ inputHandler }
          />
        </label>
        <label htmlFor="desc">
          Descendent
          <input
            type="radio"
            name="select-sort"
            value="DESC"
            data-testid="column-sort-input-desc"
            onChange={ inputHandler }
          />
        </label>
        <button
          type="button"
          data-testid="column-sort-button"
          onClick={ sortPlanets }
        >
          Order
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
          { activeFilters.isDataFiltered
            ? <Planet data={ filteredData } name={ name } />
            : <Planet data={ data } name={ name } />}
        </tbody>
      </table>
    </>
  );
}

export default Table;
