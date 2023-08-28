import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useContext } from 'react';
import axios from 'axios';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Container, Typography, Card, CardHeader, Divider } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CircleIcon from '@mui/icons-material/Circle';

// components
import { Loading } from '../components/loading/Loading';
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import Page404 from './Page404';
import TableSemestre from './TableSemestre';
import TableTypes from './TableTypes';
import ApiContext from '../context/ApiProvider';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 172;
const LEGEND_HEIGHT = 72;

const StyledChartWrapper = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

export default function DashboardAppPage() {
  const { data, extension, dataBase, loading, handleError } = useContext(ApiContext);

  console.log(dataBase);

  const newData = structuredClone(data);
  const semestresWithUpload1 = new Set();
  // Identificar los semestres que ya tienen "upload_aws": "1"
  newData.forEach((entry) => {
    if (entry.upload_aws === '1') {
      semestresWithUpload1.add(entry.Semestre);
    }
  });

  // Agregar entradas para los semestres que tienen "upload_aws": "1" pero no "upload_aws": "0"
  semestresWithUpload1.forEach((semestre) => {
    const hasUpload0 = newData.some((entry) => entry.Semestre === semestre && entry.upload_aws === '0');

    if (!hasUpload0) {
      newData.push({
        Semestre: semestre,
        upload_aws: '0',
        total: 0,
        Size: '0',
        mensaje: 'INCOMPLETO',
      });
    }
  });

  newData.sort((a, b) => (a.Semestre > b.Semestre ? 1 : -1));

  const sumBySemester = {};

  newData?.forEach((item) => {
    const semestre = item.Semestre;
    const total = item.total;

    if (sumBySemester[semestre]) {
      sumBySemester[semestre] += total;
    } else {
      sumBySemester[semestre] = total;
    }
  });

  const result = Object.keys(sumBySemester).map((semestre) => {
    return { Semestre: semestre, total_sum: sumBySemester[semestre] };
  });

  const dataMonth = newData?.filter((data) => data.upload_aws === '1');
  const dataIncomplete = newData?.filter((data) => data.upload_aws === '0');

  const dataTable = dataMonth?.map((data) => data.total);
  const dataTableIncomplete = dataIncomplete?.map((data) => data.total);

  const newStringLabel = [...result].map((key) => key.Semestre);
  const newSDataTotal = [...result].map((key) => key.total_sum);

  const dataBarr = [...dataIncomplete].map((data) => {
    return {
      label: data.Semestre,
      value: data.total,
    };
  });

  const dataBarrComplete = [...dataMonth].map((data) => {
    return {
      label: data.Semestre,
      value: data.total,
    };
  });

  const totalSum = dataBarr.reduce((sum, item) => sum + item.value, 0);
  dataBarr.forEach((item) => {
    item.percentage = ((item.value / totalSum) * 100).toFixed(3);
  });

  const totalSumComplete = dataBarrComplete.reduce((sum, item) => sum + item.value, 0);
  dataBarrComplete.forEach((item) => {
    item.percentage = ((item.value / totalSumComplete) * 100).toFixed(3);
  });

  const newDataPie = dataBarr.map((data) => {
    return {
      label: data.label,
      value: parseFloat(data.percentage),
    };
  });

  const newDataPieBarr = dataBarrComplete.map((data) => {
    return {
      label: data.label,
      value: parseFloat(data.percentage),
    };
  });

  const theme = useTheme();

  return handleError ? (
    <Page404 />
  ) : loading ? (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loading />
    </div>
  ) : (
    <>
      <Helmet>
        <title> Dashboard | Scholar URP </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>

        {/*  <Grid container spacing={3} sx={{ mb: 3 }}>
          {
            data.map((data, index) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <AppWidgetSummary title={`ARCHIVOS ${data.mensaje}S - ${data.Semestre}`} total={data.total} color={data.upload_aws === "1" ? "info" : "error"} icon={`ant-design:${data.upload_aws === "1" ? "file-filled" : "bug-filled"}`} />
              </Grid>
            ))
          }
        </Grid> */}

        <Grid container spacing={3}>
          {/*  <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid> */}

          <Grid item xs={12} md={12} lg={8}>
            <AppWebsiteVisits
              title="Subida de archivos"
              subheader=""
              chartLabels={newStringLabel}
              chartData={[
                {
                  name: 'Archivos Procesados',
                  type: 'column',
                  fill: 'solid',
                  data: dataTable,
                },
                {
                  name: 'Archivos Incompletos',
                  type: 'column',
                  fill: 'solid',
                  data: dataTableIncomplete,
                },
                {
                  name: 'Total Moodle',
                  type: 'column',
                  fill: 'solid',
                  data: newSDataTotal,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader title="Espacio de la base de datos" />
              <StyledChartWrapper dir="ltr">
                <Container>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <StorageIcon sx={{ fontSize: '50px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CircleIcon sx={{ fontSize: '10px' }} color="primary" />
                    </div>
                  </div>
                </Container>
                <Divider />
                <Typography variant="subtitle1">{dataBase[0]?.BD}</Typography>
              </StyledChartWrapper>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppWebsiteVisits
              title="Archivos Procesados"
              subheader=""
              chartLabels={newStringLabel}
              chartData={[
                {
                  name: 'Archivos Procesados',
                  type: 'column',
                  fill: 'solid',
                  data: dataTable,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppWebsiteVisits
              title="Archivos Incompletos"
              subheader=""
              chartLabels={newStringLabel}
              chartData={[
                {
                  name: 'Archivos Totales',
                  type: 'column',
                  fill: 'solid',
                  data: dataTableIncomplete,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppWebsiteVisits
              title="Archivos Totales"
              subheader=""
              chartLabels={newStringLabel}
              chartData={[
                {
                  name: 'Total Moodle',
                  type: 'column',
                  fill: 'solid',
                  data: newSDataTotal,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates title="Archivos Subidos Porcentajes" subheader="" chartData={newDataPieBarr} />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates title="Archivos Incompletos Porcentajes" subheader="" chartData={newDataPie} />
          </Grid>

          <Grid item xs={12} md={12} lg={12} xl={6}>
            <TableSemestre newData={newData} />
          </Grid>

          <Grid item xs={12} md={12} lg={12} xl={6}>
            <TableTypes extension={extension} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="Archivos Procesados Porcentajes"
              chartData={dataPie}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>



           */}

          {/* 
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={newStringLabel}
              chartData={[
                { name: 'Series 1', data: [806565, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
