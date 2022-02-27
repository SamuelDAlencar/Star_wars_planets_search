import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import tableContext from '../contexts/tableContext';
import fetchAPI from '../services/fetchAPI';

function TableProvider({ children }) {
  // ---------------Consts----------------
  const COLUMNS = [
    'population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water',
  ];
  const NAME_FILTER = 'name-filter';
  const SELECT_COLUMN = 'select-column';
  const SELECT_SORT = 'select-sort';
  const ASC = 'ASC';
  const BIGGER_THAN = 'maior que';
  const LESS_THAN = 'menor que';
  const ZERO = 0;
  const MINUS_1 = -1;
  // ---------------States----------------
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nameFilter, setNameFilter] = useState({
    filterByName: {
      name: '',
    },
  });
  const [filters, setFilters] = useState({
    filterByNumericValues: [],
  });
  const [sort, setSort] = useState({
    column: COLUMNS[0],
    sort: ASC,
  });
  const [activeFilters, setActiveFilters] = useState({
    isDataFiltered: false,
  });
  const [currFilter, setCurrFilter] = useState({
    column: COLUMNS[0],
    comparison: BIGGER_THAN,
    value: ZERO,
  });

  // ---------------Functions----------------
  const getData = async () => {
    const { results } = await fetchAPI();
    setData(results.sort((a, b) => a.name.localeCompare(b.name)));
    setFilteredData(results.sort((a, b) => a.name.localeCompare(b.name)));
  };

  // ---------------onMount----------------
  useEffect(() => {
    getData();
  }, []);

  // ---------------Functions----------------
  const inputHandler = ({ target }) => {
    const { name, id, value } = target;

    switch (name) {
    case NAME_FILTER:
      return setNameFilter({
        filterByName: {
          name: value,
        },
      });
    case SELECT_COLUMN:
      return setSort((prevState) => ({
        ...prevState,
        column: value,
      }));
    case SELECT_SORT:
      return setSort((prevState) => ({
        ...prevState,
        sort: value,
      }));
    default:
      return setCurrFilter((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const addFilter = async () => {
    setFilters((prevState) => ({
      filterByNumericValues: [
        ...prevState.filterByNumericValues,
        currFilter,
      ],
    }));

    setActiveFilters((prevState) => ({
      ...prevState,
      isDataFiltered: true,
      [currFilter.column]: true,
    }));
  };

  const removeFilter = ({ target: { value } }) => {
    const { filterByNumericValues } = filters;
    setFilteredData(data);

    setFilters({
      filterByNumericValues: [
        ...filterByNumericValues
          .filter(({ column }) => column !== value),
      ],
    });

    setActiveFilters((prevState) => ({
      ...prevState,
      [value]: false,
    }));
  };

  const removeAllFilters = () => {
    setFilters({ filterByNumericValues: [] });
  };

  const sortPlanets = () => {
    setFilteredData(
      filteredData.sort((a, b) => {
        if (sort.sort === ASC) {
          if (a[sort.column] === 'unknown') {
            return MINUS_1;
          } if (b[sort.column] === 'unknown') {
            return 1;
          }
          return a[sort.column] - b[sort.column];
        }

        if (a[sort.column] === 'unknown') {
          return 1;
        } if (b[sort.column] === 'unknown') {
          return MINUS_1;
        }
        return b[sort.column] - a[sort.column];
      }),
    );

    setActiveFilters({
      sort: true,
    });
  };

  // ---------onUpdate(filters)-------------
  useEffect(() => {
    const { filterByNumericValues } = filters;

    // Re-filtering based on the new updated filters array
    filterByNumericValues
      .map(({
        comparison: typeOfComparison,
        value: comparedValue,
        column: comparedColumn,
      }) => setFilteredData(
        filteredData
          .filter((planet) => {
            switch (typeOfComparison) {
            case BIGGER_THAN:
              return planet[comparedColumn] > Number(comparedValue);
            case LESS_THAN:
              return planet[comparedColumn] < Number(comparedValue);
            default:
              return planet[comparedColumn] === comparedValue;
            }
          }),
      ));

    if (activeFilters.sort) {
      sortPlanets();
    }

    if (filters.filterByNumericValues.length === ZERO) {
      setActiveFilters({
        isDataFiltered: false,
      });
    }

    setCurrFilter((prevState) => ({
      ...prevState,
      column: COLUMNS.find((currColumn) => !activeFilters[currColumn]),
      comparison: BIGGER_THAN,
      value: ZERO,
    }));
  }, [filters]);

  return (
    <tableContext.Provider
      value={ {
        data,
        inputHandler,
        COLUMNS,
        currFilter,
        nameFilter,
        filters,
        filteredData,
        addFilter,
        removeFilter,
        removeAllFilters,
        sortPlanets,
        activeFilters,
      } }
    >
      { children }
    </tableContext.Provider>
  );
}

TableProvider.propTypes = {
  children: propTypes.object,
}.isRequired;

export default TableProvider;
