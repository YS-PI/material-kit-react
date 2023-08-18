import { useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card, Toolbar, Typography, Autocomplete, TextField, TablePagination, IconButton } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import Scrollbar from '../components/scrollbar';
import Label from '../components/label/Label';
import Portal from '../components/portal/Portal';

export default function TableSemestre({ newData }) {
  const [labelSemestre, setLabelSemestre] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [openPortal, setOpenPortal] = useState(false);

  const warningData = useRef(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const labels = structuredClone(newData).map((data) => data.Semestre);
  const options = new Set(labels);
  const newOptions = Array.from(options);

  const conversionToGB = (size) => {
    if (size >= 1024) {
      return `${parseFloat(size / 1024).toFixed(1)} GB`;
    }
    return `${parseFloat(size).toFixed(1)} MB`;
  };

  const filterSemestre =
    labelSemestre !== null && labelSemestre?.length > 0
      ? newData.filter((data) => {
          return data?.Semestre === labelSemestre;
        })
      : newData;

  return (
    <>
      <Card>
        <Scrollbar>
          <TableContainer component={Paper}>
            <Toolbar sx={{ py: 2 }}>
              <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                Migración de Moodle a AWS
              </Typography>

              <Autocomplete
                disablePortal
                inputValue={labelSemestre}
                onInputChange={(event, newInputValue) => {
                  setLabelSemestre(newInputValue);
                }}
                id="combo-box-demo"
                options={newOptions}
                size="small"
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Filtro por semestre" />}
              />
            </Toolbar>
            <Table sx={{ minWidth: 650 }} size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Semestre</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Archivos</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>{''}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterSemestre.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.Semestre}
                    </TableCell>
                    <TableCell>{conversionToGB(row.Size)}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>
                      <Label
                        color={row.total === 0 ? 'primary' : (row.mensaje === 'INCOMPLETO' && 'error') || 'success'}
                      >
                        {row.total === 0 ? 'SIN ERRORES' : row.mensaje}
                      </Label>
                    </TableCell>
                    <TableCell>
                      {row.mensaje === 'INCOMPLETO' && row.total !== 0 ? (
                        <IconButton
                          onClick={() => {
                            warningData.current = row;
                            setOpenPortal(true);
                          }}
                        >
                          <WarningIcon color="warning" />
                        </IconButton>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[6, 10, 25]}
            component="div"
            count={filterSemestre.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Scrollbar>
      </Card>
      {openPortal && <Portal openPortal={openPortal} setOpenPortal={setOpenPortal} warningData={warningData.current} />}
    </>
  );
}
