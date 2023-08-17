import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, Card, IconButton, Popover, MenuItem } from '@mui/material';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Label from '../components/label/Label';
import { Loading } from '../components/loading/Loading';
import Page404 from './Page404';
import Portal from '../components/portal/Portal';






export default function UserPage() {

  const [detail, setDetail] = useState([])
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(false)
  const [handleError, setHandleError] = useState(false)
  const [openPortal, setOpenPortal] = useState(false)

  const getData = async () => {
    setLoading(true)
    const header = {
      "Content-Type": "application/json",
    }
    await axios(`${process.env.REACT_APP_URL}/get_data/total/`, {
      method: "POST",
      headers: header,
      data: JSON.stringify({
        "semestre": ""
      })
    }).then(({ data }) => {
      setDetail(data?.lstextensiones)
      setLoading(false)
    }).catch((err) => {
      console.log(err)
      setLoading(false)
      setHandleError(true)
    })
  }

  const getDetail = async (semestre) => {
    const header = {
      "Content-Type": "application/json",
    }
    await axios(`${process.env.REACT_APP_URL}/get_data/total/`, {
      method: "POST",
      headers: header,
      data: JSON.stringify({
        "semestre": ""
      })
    }).then(({ data }) => {
      setDetail(data?.lstextensiones)
      setLoading(false)
    }).catch((err) => {
      console.log(err)
      setLoading(false)
      setHandleError(true)
    })
  }

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };


  useEffect(() => {
    getData()
  }, [])



  return handleError ?
    <Page404 />
    : loading ?
      <Loading />
      : (
        <>
          <Helmet>
            <title> User | Minimal UI </title>
          </Helmet>
          <Container>
            <Card>
              <Scrollbar>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell >Semestre</TableCell>
                        <TableCell >Size</TableCell>
                        <TableCell  >Archivos</TableCell>
                        <TableCell  >Status</TableCell>
                        <TableCell>{""}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detail.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" >
                            {row.Semestre}
                          </TableCell>
                          <TableCell >{row.Size}</TableCell>
                          <TableCell >{row.total}</TableCell>
                          <TableCell ><Label color={(row.mensaje === 'INCOMPLETO' && 'error') || 'success'}>{row.mensaje}</Label></TableCell>
                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Container>

          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                p: 1,
                width: 140,
                '& .MuiMenuItem-root': {
                  px: 1,
                  typography: 'body2',
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <MenuItem onClick={() => {
              setOpenPortal(true)
              setOpen(false)
            }}>
              <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} />
              Edit
            </MenuItem>

            {/* <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem> */}
          </Popover>
          {openPortal && <Portal openPortal={openPortal} setOpenPortal={setOpenPortal} setOpen={setOpen} />}
        </>
      );
}