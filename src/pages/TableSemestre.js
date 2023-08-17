import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, Card, IconButton, Toolbar, Typography } from '@mui/material';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Label from '../components/label/Label';

export default function TableSemestre({ newData }) {
  return (
    <>
      <Container>
        <Card>
          <Scrollbar>
            <TableContainer component={Paper}>
              <Toolbar>
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                  Nutrition
                </Typography>
              </Toolbar>
              <Table sx={{ minWidth: 650 }} size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Semestre</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Archivos</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newData.map((row, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {row.Semestre}
                      </TableCell>
                      <TableCell>{`${parseFloat(row.Size).toFixed(1)} MB`}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell>
                        <Label color={(row.mensaje === 'INCOMPLETO' && 'error') || 'success'}>{row.mensaje}</Label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}
