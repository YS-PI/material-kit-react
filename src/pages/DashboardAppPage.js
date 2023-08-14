import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
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




// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  const [data, setData] = useState([])

  const getData = async () => {
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
      setData(data)
    }).catch((err) => {
      console.log(err)
    })
  }


  const dataMonth = [...data].filter(data => data.upload_aws === "1")
  console.log(dataMonth)

  const dataIncomplete = [...data].filter(data => data.upload_aws === "0")
  console.log(dataIncomplete)

  const dataPie = [...dataMonth].map(data => {
    return {
      label: data.Semestre,
      value: data.total,
    }
  })

  const dataBarr = [...dataIncomplete].map(data => {
    return {
      label: data.Semestre,
      value: data.total,
    }
  })

  const dataLabel = [...dataMonth].map(data => {
    return {
      label: data.Semestre,
    }
  })

  const dataLabelIncomplete = [...dataIncomplete].map(data => {
    return {
      label: data.Semestre,
    }
  })

  console.log(dataLabelIncomplete)

  const dataTable = [...dataMonth].map(data => data.total)
  const dataTableIncomplete = [...dataIncomplete].map(data => data.total)

  const newStringLabel = Object.keys(dataLabel).map(key => dataLabel[key].label);
  const newStringLabelIncomplete = Object.keys(dataTableIncomplete).map(key => dataLabel[key].label);




  const totalSum = dataBarr.reduce((sum, item) => sum + item.value, 0);
  dataBarr.forEach(item => {
    item.percentage = ((item.value / totalSum) * 100).toFixed(3);
  });

  const newDataPie = (dataBarr).map(data => {
    return {
      label: data.label,
      value: parseFloat(data.percentage),
    }
  })




  const theme = useTheme();


  useEffect(() => {
    getData()
  }, [])


  return (
    <>
      <Helmet>
        <title> Dashboard | Scholar URP </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {
            data.map((data, index) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <AppWidgetSummary title={data.mensaje} total={data.total} color={data.upload_aws === "1" ? "info" : "error"} icon={`ant-design:${data.upload_aws === "1" ? "apple-filled" : "bug-filled"}`} />
              </Grid>
            ))
          }
        </Grid>

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

          <Grid item xs={12} md={6} lg={6}>
            <AppWebsiteVisits
              title="Archivos Procesados"
              subheader=""
              chartLabels={newStringLabel}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: dataTable,
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: dataTable,
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: dataTable,
                },
              ]}
            />
          </Grid>



          <Grid item xs={12} md={6} lg={6}>
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

          <Grid item xs={12} md={6} lg={6}>
            <AppWebsiteVisits
              title="Archivos Incompletos"
              subheader=""
              chartLabels={newStringLabelIncomplete}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: dataTableIncomplete,
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: dataTableIncomplete,
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: dataTableIncomplete,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Archivos Incompletos Porcentajes"
              subheader=""
              chartData={newDataPie}
            />
          </Grid>



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
