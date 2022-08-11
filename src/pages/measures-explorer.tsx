import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {useEffect, useState } from "react";
import Link from 'next/link'
import {Button} from "@material-ui/core";
import Footer from '../components/Footer'
import DataTable from 'react-data-table-component';
import {Box, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, Container, Paper, TextField, Chip} from "@mui/material";

import { IMeasureStore, useStore } from "../store/measure_data.service";
import {observer} from "mobx-react-lite";

interface Props {
  store?: IMeasureStore
}

const columns = [
  {
    name: 'Measure Id',
    selector: (row:any) => row.measureId,
    sortable: true
  }
  ,{
    name: 'First Performance Year',
    selector: (row:any) => row.firstPerformanceYear,
    sortable: true
  }
  ,{
    name: 'Category',
    selector: (row:any) => row.category,
    sortable: true
  }
  ,{
    name: 'Metric Type',
    selector: (row:any) => row.metricType,
    sortable: true
  }
  ,{
    name: 'Measure Type',
    selector: (row:any) => row.measureType,
    sortable: true
  }
  ,{
    name: 'Inverse Measure',
    selector: (row:any) => row.isInverse,
    sortable: true
  }
]

// @ts-ignore
const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>

const defaultState = {
  measure_filter: '',
  quality_filter: true,
  pi_filter: true,
  ia_filter: true,
  cost_filter: true
}

const MeasuresExplorer: NextPage<Props> = observer((props) => {
  const {
    measures,
    year,
    getMeasuresData,
    total_measure_count,
    total_quality_measure_count,
    total_ia_measure_count,
    total_pi_measure_count,
    total_cost_measure_count,
    measures_loading
  } = useStore(props.store)

  const router = useRouter();
  const performanceYear = (router.query.performanceYear != undefined) ? router.query.performanceYear : 2021

  const [data, setData] = useState(defaultState)

  const toggleFilterCheck = (key: String) => {
    const newState = {}
    // @ts-ignore
    newState[key] = !data[key]
    setData( {...data, ...newState})
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({...data, 'measure_filter': event.target.value });
  };

  useEffect(() => {
    const _year = (!router.isReady) ? 2021 : parseInt(performanceYear as string)
    getMeasuresData(_year)
  }, [performanceYear])

  const HeadContent: JSX.Element = (
    <>
      <title>Measures Data Table</title>
      <meta name="description" content="Measures Data Table" />
      <link rel="icon" href="/favicon.ico" />
    </>
  )

  const PerformanceYearButtons: JSX.Element = (
    <Container sx={{ flexGrow: 1 }}>
      <Grid container spacing={0}>
        { [2017,2018,2019,2020,2021,2022].map((year) => {
          return (
            <Grid item xs={2} key={year}>
              <Link href={'/measures-explorer?performanceYear=' + year}><Button variant="outlined">{year}</Button></Link>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )

  const Stats: JSX.Element = (
    <Paper elevation={12}>
      <Container maxWidth="xl">
      <h1>Performance Year: { performanceYear }</h1>
      <h2><p>Stats:</p></h2>
      <Chip label={"Total Measure Count: " + total_measure_count }/>
      <Chip label={"Total Quality Measure Count: " + total_quality_measure_count }/>
      <Chip label={"Total PI Measure Count: " + total_pi_measure_count }/>
      <Chip label={"Total IA Measure Count: " + total_ia_measure_count }/>
      <Chip label={"Total Cost Measure Count: " + total_cost_measure_count }/>
      </Container>
    </Paper>
  )

  const Filters: JSX.Element = (
   <Paper elevation={12}>
     <Container maxWidth="xl">
     <h2><p>Filters:</p></h2>
     <><TextField id="outlined-basic" label="Measure Id"
                   value={data.measure_filter}
                   onChange={handleSearchChange}
                   variant="outlined" /></>
       <p></p>
     <FormGroup row={true}>
       <FormControlLabel control={<Checkbox checked={data.quality_filter}
                                            onChange={() => toggleFilterCheck("quality_filter")} />}
                         label="Quality Measures" />
       <FormControlLabel control={<Checkbox checked={data.pi_filter}
                                            onChange={() => toggleFilterCheck("pi_filter")} />}
                         label="PI Measures" />
       <FormControlLabel control={<Checkbox checked={data.ia_filter}
                                            onChange={() => toggleFilterCheck("ia_filter")} />}
                         label="IA Measures" />
       <FormControlLabel control={<Checkbox checked={data.cost_filter}
                                            onChange={() => toggleFilterCheck("cost_filter")} />}
                         label="Cost Measures" />
       <p></p>
     </FormGroup>
       <p></p>
     </Container>
   </Paper>
  )

  const Loading: JSX.Element = (
      <Paper elevation={12}>
        <Box sx={{ flexGrow: 1}}>
          <p>Loading...</p>
          <p><CircularProgress color="success" /></p>
        </Box>
      </Paper>
  )

  const MeasureTable: JSX.Element = (
    <DataTable
      columns={columns}
      data={ measures
        .filter((x:any) => (data.measure_filter == '') ? true : x.measureId.includes(data.measure_filter))
        .filter((x:any) => (data.quality_filter) ? true : x.category != "quality" )
        .filter((x:any) => (data.pi_filter) ? true : x.category != "pi" )
        .filter((x:any) => (data.ia_filter) ? true : x.category != "ia" )
        .filter((x:any) => (data.cost_filter) ? true : x.category != "cost" )
      }
      selectableRows
      expandableRows
      expandableRowsComponent={ExpandedComponent}
    />
  )

  return (
    <div className={styles.container}>
      <Head>
        { HeadContent }
      </Head>

      <main className={styles.main}>
        <Container maxWidth="xl">
        { PerformanceYearButtons }

        { (measures_loading) ?
          <>{ Loading }</> :
          (
            <Paper elevation={12}>
              <Box sx={{ flexGrow: 1, width: '100%'}}>
                { Stats }
                { Filters }
                { MeasureTable }
              </Box>
            </Paper>
          )
        }
        </Container>
      </main>
      <Footer/>
    </div>
  )
})

export default MeasuresExplorer
