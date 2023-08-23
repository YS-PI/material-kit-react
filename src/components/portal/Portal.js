import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import TablePortal from './TablePortal';
import { Loading } from '../loading/Loading';

export default function Portal({ openPortal, setOpenPortal, warningData }) {
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpenPortal(false);
  };

  const getDetail = async () => {
    setLoading(true);
    await axios(`${process.env.REACT_APP_URL}/get_data/detalle/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        semestre: warningData?.Semestre,
        estado: warningData?.upload_aws,
      }),
    })
      .then(({ data }) => {
        setDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  console.log(warningData);
  console.log(loading);

  useEffect(() => {
    getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Dialog
        open={openPortal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={Boolean(true)}
      >
        <DialogTitle id="alert-dialog-title">{`Semestre ${warningData?.Semestre}`}</DialogTitle>
        <DialogContent sx={loading ? { position: 'relative', height: '400px' } : null}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Loading />
            </div>
          ) : (
            <TablePortal detail={detail} />
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
