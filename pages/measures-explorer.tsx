import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from "axios";
import {useEffect, useState } from "react";
import Link from 'next/link'
import {Button} from "@material-ui/core";
import Footer from '../components/Footer'
import DataTable from 'react-data-table-component';
import {Box, Checkbox, FormControlLabel, FormGroup, Grid, Paper} from "@mui/material";

interface Props {
  measures?: any;
  total_measure_count?: Number;
  total_quality_measure_count?: Number;
  total_pi_measure_count?: Number;
  total_ia_measure_count?: Number;
  total_cost_measure_count?: Number;
}

const columns = [
  {
    name: 'Measure Id',
    selector: row => row.measureId,
    sortable: true
  }
  ,{
    name: 'First Performance Year',
    selector: row => row.firstPerformanceYear,
    sortable: true
  }
  ,{
    name: 'Category',
    selector: row => row.category,
    sortable: true
  }
  ,{
    name: 'Metric Type',
    selector: row => row.metricType,
    sortable: true
  }
  ,{
    name: 'Measure Type',
    selector: row => row.measureType,
    sortable: true
  }
  ,{
    name: 'Inverse Measure',
    selector: row => row.isInverse,
    sortable: true
  }
]

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>

const defaultState = {
  measuresData: { measures: []},
  quality_filter: true,
  pi_filter: true,
  ia_filter: true,
  cost_filter: true
}

const MeasuresExplorer: NextPage<Props> = () => {
  const router = useRouter();
  const performanceYear = (router.query.performanceYear != undefined) ? router.query.performanceYear : 2021
  const [data, setData] = useState(defaultState)
  const [isLoading, setLoading] = useState(false)

  const toggleFilterCheck = (key: String) => {
    const newState = {}
    newState[key] = !data[key]
    setData( {...data, ...newState})
  };

  useEffect(() => {
    setLoading(true)

    const fetchData = async () => {
      const year = (!router.isReady) ? 2021 : parseInt(performanceYear)
      const m_data = await getMeasuresData(year)
      setData({ ...data, measuresData: m_data })
      setLoading(false)
    }

    fetchData().catch(console.error)
  }, [router.isReady, performanceYear])

  if (!data || !data.measuresData) return <p>No measure data</p>
  return (
    <div className={styles.container}>
      <Head>
        <title>Measures Data Table</title>
        <meta name="description" content="Measures Data Table" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            { [2017,2018,2019,2020,2021,2022].map((year) => {
              return (
                <Grid item xs={2} key={year}>
                  <Link href={'/measures-explorer?performanceYear=' + year}><Button>{year}</Button></Link>
                </Grid>
              )
            })}
          </Grid>
        </Box>

        { (isLoading) ? <Box sx={{ flexGrow: 1}}><p>Loading...</p></Box> :
          (
            <Box sx={{ flexGrow: 1, width: '100%'}}>
              <h1><p>Performance Year: { data.measuresData.year }</p></h1>
              <h2><p>Stats:</p></h2>
              <p>Total Measure Count: { data.measuresData.total_measure_count }</p>
              <p>Total Quality Measure Count: { data.measuresData.total_quality_measure_count }</p>
              <p>Total PI Measure Count: { data.measuresData.total_pi_measure_count }</p>
              <p>Total IA Measure Count: { data.measuresData.total_ia_measure_count }</p>
              <p>Total Cost Measure Count: { data.measuresData.total_cost_measure_count }</p>
              <h2><p>Filters:</p></h2>
              <FormGroup>
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
              </FormGroup>
              <DataTable
              columns={columns}
              data={ data.measuresData.measures
                .filter(x => (data.quality_filter) ? true : x.category != "quality" )
                .filter(x => (data.pi_filter) ? true : x.category != "pi" )
                .filter(x => (data.ia_filter) ? true : x.category != "ia" )
                .filter(x => (data.cost_filter) ? true : x.category != "cost" )
              }
              selectableRows
              expandableRows
              expandableRowsComponent={ExpandedComponent}
              />
            </Box>
          )
        }
      </main>

      <Footer/>
    </div>
  )
}

const getMeasuresData = async (performanceYear: Number) => {
  const { data } = await axios.get('https://raw.githubusercontent.com/CMSgov/qpp-measures-data/develop/measures/' + performanceYear + '/measures-data.json');
  console.log("again",performanceYear)
  return {
      measures: data,
      year: performanceYear,
      total_measure_count: data.length,
      total_quality_measure_count: data.filter((x: any): any => x.category == 'quality').length,
      total_pi_measure_count: data.filter((x: any): any => x.category == 'pi').length,
      total_ia_measure_count: data.filter((x: any): any => x.category == 'ia').length,
      total_cost_measure_count: data.filter((x: any): any => x.category == 'cost').length
   }
};

// MeasuresExplorer.getInitialProps = async () => {
//   const { data } = await axios.get('https://raw.githubusercontent.com/CMSgov/qpp-measures-data/develop/measures/2021/measures-data.json');
//   return { measures: data };
// }

export default MeasuresExplorer
