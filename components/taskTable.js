import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Table() {
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
      hide: true,
      headerAlign: 'center',
    },
    {
      field: 'what',
      headerName: 'Hva',
      flex: 2,
      type: 'string',
      align: 'left',
    },
    {
      field: 'where',
      headerName: 'Hvor',
      flex: 1,
    },
    {
      field: 'start',
      headerName: 'Start',
      flex: 1,
      valueGetter: (params) => {
        if (params.row.start && params.row.start !== null)
          return moment(params.row.start).format('YYYY-MM-DD HH:mm');
        return 'Snarest';
      },
    },
    {
      field: 'doneby',
      headerName: 'Frist',
      flex: 1,
      valueGetter: (params) => {
        if (params.row.start && params.row.start !== null)
          return moment(params.row.start).format('YYYY-MM-DD HH:mm');
        return '-';
      },
    },
    {
      field: 'done',
      headerName: 'Ferdig',
      flex: 1,
      hide: true,
      valueGetter: (params) => {
        if (params.row.done && params.row.done !== null)
          return moment(params.row.done).format('YYYY-MM-DD HH:mm');
        return '';
      },
    },

    {
      field: 'action',
      headerName: 'Ferdig',
      sortable: false,
      renderCell: (params) => {
        const onClick = async (e) => {
          e.stopPropagation();

          const api = params.api;
          const thisRow = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
            );
          let res = await fetch('/api/task/' + params.id, {
            method: 'PUT',
            body: JSON.stringify({ ...thisRow, done: new Date() }),
          });
          res = await res.json();
          console.log(thisRow);
          return alert(JSON.stringify(res, null, 4));
        };
        if (params.row.done) {
          return <Button onClick={onClick}>✔️</Button>;
        } else {
          return <Button onClick={onClick}>❌</Button>;
        }
      },
    },
    {
      field: 'action2',
      headerName: 'Endre',
      sortable: false,
      renderCell: (params) => {
        const onClick = async (e) => {
          e.stopPropagation();

          const api = params.api;
          const thisRow = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
            );

          return alert(JSON.stringify(thisRow));
        };

        return <Button onClick={onClick}>🖊️</Button>;
      },
    },
  ].map((d) => {
    if (!d.headerAlign) d.headerAlign = 'center';
    if (!d.align) d.align = 'center';
    if (!d.headerClassName) d.headerClassName = 'tableHeader';
    return d;
  });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch('api/task')
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <DataGrid
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  columnField: 'done',
                  operatorValue: 'isEmpty',
                  value: undefined,
                },
              ],
            },
          },
        }}
        pageSize={100}
        rowsPerPageOptions={[100]}
        getRowId={(row) => row._id}
        loading={loading}
        rows={rows}
        columns={columns}
      />
    </Box>
  );
}
