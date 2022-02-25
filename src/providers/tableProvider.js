import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import tableContext from '../contexts/tableContext';
import fetchAPI from '../services/fetchAPI';

function TableProvider({ children }) {
  // ---------------Consts----------------
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nameFilter, setNameFilter] = useState({
    filterByName: {
      name: '',
    },
  });

  const [numericFilter, setNumericFilter] = useState({
    filterByNumericValues: [
      {
        column: 'population',
        comparison: 'maior que',
        value: 0,
      },
    ],
  });

  const [filtered, setFiltered] = useState(false);

  // ---------------Functions----------------
  const getData = async () => {
    const { results } = await fetchAPI();
    setData(results);
  };

  const inputHandler = ({ target }) => {
    const { id, value } = target;

    return target.id === 'name-filter'
      ? setNameFilter({
        filterByName: {
          name: target.value,
        },
      })
      : setNumericFilter((prevState) => ({
        filterByNumericValues: [
          {
            ...prevState.filterByNumericValues[0],
            [id]: value,
          },
        ],
      }));
  };

  const filterTable = () => {
    setFiltered(true);
    const { comparison, value, column } = numericFilter.filterByNumericValues[0];

    setFilteredData(data.filter((planet) => {
      if (comparison === 'maior que') {
        return planet[column] > Number(value);
      } if (comparison === 'menor que') {
        return planet[column] < Number(value);
      }
      return planet[column] === value;
    }));
  };

  // ---------------onMount----------------
  useEffect(() => {
    getData();
  }, []);

  // ---------onUpdate()-------------
  // useEffect(() => {

  // }, []);

  return (
    <tableContext.Provider
      value={ {
        data,
        filteredData,
        nameFilter,
        numericFilter,
        inputHandler,
        filterTable,
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
