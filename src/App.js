import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/menu');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Image',
        accessor: 'image',
        Cell: ({ value }) => <img src={value} alt="Food" style={{ width: '50px' }} />,
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Label',
        accessor: 'label',
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ row }) => (
          <input
            type="number"
            value={row.original.price}
            onChange={(e) => handlePriceChange(row.original.id, e.target.value)}
          />
        ),
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
    ],
    []
  );

  const handlePriceChange = async (id, newPrice) => {
    try {
      await axios.put(`/api/menu/${id}`, { price: newPrice });
      console.log('Price updated successfully');
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <div>
      <h1>Menu</h1>
      <table {...getTableProps()} className="menu-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="header-row">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="body">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="data-row">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}




export default App;
