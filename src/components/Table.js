import React, { useContext } from 'react';
import tableContext from '../contexts/tableContext';
import Planet from './Planet';
import '../style/table.css';

function Table() {
  const COMPARISONS = ['maior que', 'menor que', 'igual a'];

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
      <header className="header">
        <section>
          <h1 className="header__h1">Star Wars Planets</h1>
        </section>
        <section className="filters">
          <label htmlFor="name">
            Name:
            <input
              type="text"
              onChange={ inputHandler }
              data-testid="name-filter"
              id="name"
              name="name-filter"
              className="input-button"
            />
          </label>
          <label htmlFor="clumn">
            Column:
            <select
              data-testid="column-filter"
              onChange={ inputHandler }
              id="column"
              value={ column }
              className="input-button"
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
          </label>
          <label htmlFor="comparison">
            Comparison:
            <select
              data-testid="comparison-filter"
              onChange={ inputHandler }
              id="comparison"
              value={ comparison }
              className="input-button"
            >
              {COMPARISONS.map((currComparison) => (
                <option
                  value={ currComparison }
                  key={ currComparison }
                >
                  {currComparison}
                </option>))}
            </select>
          </label>
          <label htmlFor="value">
            Value:
            <input
              type="number"
              data-testid="value-filter"
              onChange={ inputHandler }
              id="value"
              value={ value }
              className="input-button"
            />
          </label>
          <button
            type="button"
            onClick={ addFilter }
            data-testid="button-filter"
            className="input-button"
          >
            Filter
          </button>
        </section>
        <section className="active-filters">
          {activeFilters.isDataFiltered
          && (
            <>
              <button
                type="button"
                data-testid="button-remove-filters"
                onClick={ removeAllFilters }
                className="input-button"
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
                        className="input-button"
                      >
                        X
                      </button>
                    </span>))
              }
            </>
          )}
        </section>
        <section>
          <select
            data-testid="column-sort"
            name="select-column"
            onChange={ inputHandler }
            className="input-button"
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
            className="input-button"
          >
            Order
          </button>
        </section>
      </header>
      <table className="table">
        <thead>
          <tr className="table__thead__tr">
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
