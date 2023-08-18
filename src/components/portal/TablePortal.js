import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card, Toolbar, Typography, Autocomplete, TextField, TablePagination } from '@mui/material';
import Scrollbar from '../scrollbar';

const TablePortal = ({ detail }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(detail);

  return (
    <>
      <Card>
        <Scrollbar>
          <TableContainer component={Paper}>
            <Toolbar sx={{ py: 2 }}>
              <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                Archivos Incompletos
              </Typography>

              {/*  <Autocomplete
                disablePortal
                inputValue={labelExtension}
                onInputChange={(event, newInputValue) => {
                  setLabelExtension(newInputValue);
                }}
                id="combo-box-demo"
                options={newOptions}
                size="small"
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Filtro por extensiones" />}
              /> */}
            </Toolbar>
            <Table sx={{ minWidth: 650 }} size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Archivo</TableCell>
                  <TableCell>Path</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detail.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.Archivo}
                    </TableCell>
                    <TableCell>{row.RutaPath}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[6, 10, 25]}
            component="div"
            count={detail.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Scrollbar>
      </Card>
    </>
  );
};

export default TablePortal;
