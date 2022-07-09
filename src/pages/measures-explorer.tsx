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
import {Box, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, Paper, TextField} from "@mui/material";

interface Props {
  measures?: Measure;
  total_measure_count?: Number;
  total_quality_measure_count?: Number;
  total_pi_measure_count?: Number;
  total_ia_measure_count?: Number;
  total_cost_measure_count?: Number;
}

interface Measure {
  measureId: string;
  category: string;
  firstPerformanceYear: string;
  metricType: string;
  measureType: string;
  isInverse: boolean;
}

const columns = [
  {
    name: 'Measure Id',
    selector: (row:Measure) => row.measureId,
    sortable: true
  }
  ,{
    name: 'First Performance Year',
    selector: (row:Measure) => row.firstPerformanceYear,
    sortable: true
  }
  ,{
    name: 'Category',
    selector: (row:Measure) => row.category,
    sortable: true
  }
  ,{
    name: 'Metric Type',
    selector: (row:Measure) => row.metricType,
    sortable: true
  }
  ,{
    name: 'Measure Type',
    selector: (row:Measure) => row.measureType,
    sortable: true
  }
  ,{
    name: 'Inverse Measure',
    selector: (row:Measure) => row.isInverse,
    sortable: true
  }
]

// @ts-ignore
const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>

const defaultState = {
  measuresData: {
    measures: [],
    year:2021,
    total_measure_count: 0,
    total_quality_measure_count: 0,
    total_pi_measure_count: 0,
    total_ia_measure_count: 0,
    total_cost_measure_count: 0
  },
  measure_filter: '',
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
    // @ts-ignore
    newState[key] = !data[key]
    setData( {...data, ...newState})
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({...data, 'measure_filter': event.target.value });
  };

  useEffect(() => {
    setLoading(true)

    const fetchData = async () => {
      const year = (!router.isReady) ? 2021 : parseInt(performanceYear as string)
      const m_data = await getMeasuresData(year)
      // @ts-ignore
      setData({ ...data, measuresData: m_data })
      setLoading(false)
    }

    fetchData().catch(console.error)
  }, [router.isReady, performanceYear])

  const HeadContent: JSX.Element = (
    <>
      <title>Measures Data Table</title>
      <meta name="description" content="Measures Data Table" />
      <link rel="icon" href="/favicon.ico" />
    </>
  )

  const PerformanceYearButtons: JSX.Element = (
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
  )

  const Stats: JSX.Element = (
    <>
      <h1><p>Performance Year: { data.measuresData.year }</p></h1>
      <h2><p>Stats:</p></h2>
      <p>Total Measure Count: { data.measuresData.total_measure_count }</p>
      <p>Total Quality Measure Count: { data.measuresData.total_quality_measure_count }</p>
      <p>Total PI Measure Count: { data.measuresData.total_pi_measure_count }</p>
      <p>Total IA Measure Count: { data.measuresData.total_ia_measure_count }</p>
      <p>Total Cost Measure Count: { data.measuresData.total_cost_measure_count }</p>
    </>
  )

  const Filters: JSX.Element = (
   <>
     <h2><p>Filters:</p></h2>
     <p><TextField id="outlined-basic" label="Measure Id"
                   value={data.measure_filter}
                   onChange={handleSearchChange}
                   variant="outlined" /></p>
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
   </>
  )

  const Loading: JSX.Element = (
    <Box sx={{ flexGrow: 1}}>
      <p>Loading...</p>
      <p><CircularProgress color="success" /></p>
    </Box>
  )

  const MeasureTable: JSX.Element = (
    <DataTable
      columns={columns}
      data={ data.measuresData.measures
        .filter((x:Measure) => (data.measure_filter == '') ? true : x.measureId.includes(data.measure_filter))
        .filter((x:Measure) => (data.quality_filter) ? true : x.category != "quality" )
        .filter((x:Measure) => (data.pi_filter) ? true : x.category != "pi" )
        .filter((x:Measure) => (data.ia_filter) ? true : x.category != "ia" )
        .filter((x:Measure) => (data.cost_filter) ? true : x.category != "cost" )
      }
      selectableRows
      expandableRows
      expandableRowsComponent={ExpandedComponent}
    />
  )

  if (!data || !data.measuresData) return <p>No measure data</p>
  // @ts-ignore
  return (
    <div className={styles.container}>
      <Head>
        { HeadContent }
      </Head>

      <main className={styles.main}>
        { PerformanceYearButtons }

        { (isLoading) ?
          <>{ Loading }</> :
          (
            <Box sx={{ flexGrow: 1, width: '100%'}}>
              { Stats }
              { Filters }
              { MeasureTable }
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

  return {
      measures: data,
      year: performanceYear,
      total_measure_count: data.length,
      total_quality_measure_count: data.filter((x: Measure): any => x.category == 'quality').length,
      total_pi_measure_count: data.filter((x: Measure): any => x.category == 'pi').length,
      total_ia_measure_count: data.filter((x: Measure): any => x.category == 'ia').length,
      total_cost_measure_count: data.filter((x: Measure): any => x.category == 'cost').length
   }
};

export default MeasuresExplorer
