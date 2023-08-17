import { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card, Toolbar, Typography, Autocomplete, TextField, TablePagination } from '@mui/material';
import Scrollbar from '../components/scrollbar';

const TableTypes = ({ extension }) => {
    const [labelExtension, setLabelExtension] = useState("")
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const labels = (structuredClone(extension).map(data => data.extension))
    const options = new Set(labels)
    const newOptions = Array.from(options)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filterExtension = labelExtension !== null && labelExtension?.length > 0 ? extension.filter(data => {
        return data?.extension === labelExtension
    }
    ) : extension




    return (
        <>
            <Card>
                <Scrollbar>
                    <TableContainer component={Paper}>
                        <Toolbar sx={{ py: 2 }}>
                            <Typography sx={{ flex: '1 1 100%' }}
                                variant="h6"
                                id="tableTitle"
                                component="div">Total de achivos en AWS</Typography>

                            <Autocomplete
                                disablePortal
                                inputValue={labelExtension}
                                onInputChange={(event, newInputValue) => {
                                    setLabelExtension(newInputValue);
                                }}
                                id="combo-box-demo"
                                options={newOptions}
                                size='small'
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Filtro por extensiones" />}
                            />
                        </Toolbar>
                        <Table sx={{ minWidth: 650 }} size="medium">
                            <TableHead >
                                <TableRow>
                                    <TableCell>Extensiones</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filterExtension.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" >
                                            {row.extension}
                                        </TableCell>
                                        <TableCell >{row.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[6, 10, 25]}
                        component="div"
                        count={filterExtension.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Scrollbar>
            </Card>
        </>
    )
}

export default TableTypes
