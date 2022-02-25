import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import tableContext from '../contexts/tableContext';
import fetchAPI from '../services/fetchAPI';

function TableProvider({ children }) {
  // ---------------States----------------
  const [data, setData] = useState([]);
  const [nameFilter, setNameFilter] = useState({
    filterByName: {
      name: '',
    },
  });
  const [numericFilter, setNumericFilter] = useState({
    filterByNumericValues: [],
  });
  const [currFilter, setCurrFilter] = useState({
    column: 'population',
    comparison: 'maior que',
    value: 0,
  });
  const [filtered, setFiltered] = useState({
    filtered: false,
  });
  const [filteredData, setFilteredData] = useState([]);

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

    return target.id === 'name-filter'
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
    setNumericFilter((prevState) => ({
      filterByNumericValues: [
        ...prevState.filterByNumericValues,
        currFilter,
      ],
    }));

    setFiltered((prevState) => ({
      ...prevState,
      filtered: true,
      [currFilter.column]: true,
    }));
  };

  const removeFilter = ({ target: { value } }) => {
    setNumericFilter({
      filterByNumericValues: [
        ...numericFilter.filterByNumericValues
          .filter((filter) => filter.column !== value),
      ],
    });
  };

  const removeAllFilters = () => {
    setNumericFilter({ filterByNumericValues: [] });
  };

  // ---------onUpdate()-------------
  useEffect(() => {
    numericFilter.filterByNumericValues
      .map(({ comparison, value, column }) => setFilteredData(filteredData
        .filter((planet) => {
          if (comparison === 'maior que') {
            return planet[column] > Number(value);
          } if (comparison === 'menor que') {
            return planet[column] < Number(value);
          }
          return planet[column] === value;
        })));
    if (numericFilter.filterByNumericValues.length === 0) {
      setFiltered({
        filtered: false,
      });
    }
  }, [numericFilter]);

  return (
    <tableContext.Provider
      value={ {
        data,
        inputHandler,
        currFilter,
        nameFilter,
        numericFilter,
        filteredData,
        addFilter,
        removeFilter,
        removeAllFilters,
        filtered,
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
