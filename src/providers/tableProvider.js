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
  const BIGGER_THAN = 'maior que';
  const LESS_THAN = 'menor que';
  const ZERO = 0;
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
    setData(results);
    setFilteredData(results);
  };

  // ---------------onMount----------------
  useEffect(() => {
    getData();
  }, []);

  // ---------------Functions----------------
  const inputHandler = ({ target }) => {
    const { id, value } = target;

    return target.id === NAME_FILTER
      ? setNameFilter({
        filterByName: {
          name: target.value,
        },
      })
      : setCurrFilter((prevState) => ({
        ...prevState,
        [id]: value,
      }));
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
