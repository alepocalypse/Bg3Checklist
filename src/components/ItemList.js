import React, { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import { useTable, useFilters } from 'react-table';

const ItemList = () => {
  // Define the data state variable
  const [data, setData] = useState([]);

  console.log('ItemList component rendered'); // Log when the component renders

  useEffect(() => {
    console.log('ItemList useEffect executed'); // Log when useEffect runs

    // Fetch the CSV file
    fetch('/itemData.csv') // Assuming the CSV file is in the public directory
      .then(response => response.text())
      .then(result => {
        // Parse the CSV data using PapaParse
        Papa.parse(result, {
          header: true,
          dynamicTyping: true,
          complete: (parsedData) => {
            setData(parsedData.data);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          },
        });
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
      });
  }, []);

  // Define columns
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'Name',
      },
      {
        Header: 'Type',
        accessor: 'Type',
      },
      {
        Header: 'Properties',
        accessor: 'Properties',
      },
      {
        Header: 'Location',
        accessor: 'Location',
      },
      {
        Header: 'Description',
        accessor: 'Description',
      },
    ],
    []
  );

  // Call the useTable hook at the top level of the component
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters // For filterable columns
  );

  return (
    <div>
      <h1>Item List</h1>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;
