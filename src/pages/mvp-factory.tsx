import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {useEffect, useState } from "react";
import Link from 'next/link'
import {Button} from "@material-ui/core";
import Footer from '../components/Footer'
import DataTable from 'react-data-table-component';
import {Box, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, Paper, TextField} from "@mui/material";

import { IMeasureStore, useStore, iMvpVO } from "../store/measure_data.service";
import {observer} from "mobx-react-lite";

interface Props {
  store?: IMeasureStore
}

const MvpFactory: NextPage<Props> = observer((props) => {
  const { getMvpData, mvps, measures_loading, addBlankMvp, removeMvp} = useStore(props.store)
  const router = useRouter();
  const performanceYear = (router.query.performanceYear != undefined) ? router.query.performanceYear : 2023

  useEffect(() => {
    const _year = (!router.isReady) ? 2023 : parseInt(performanceYear as string)
    getMvpData(_year)
  }, [mvps])

  const HeadContent: JSX.Element = (
    <>
      <title>MVP Factory</title>
      <meta name="description" content="MVP Factory" />
      <link rel="icon" href="/favicon.ico" />
    </>
  )

  const LoadingComp: JSX.Element = (
    <Box sx={{ flexGrow: 1}}>
      <p>Loading...</p>
      <p><CircularProgress color="success" /></p>
    </Box>
  )

// @ts-ignore
  const ExpandedComponent = ({ data }) => (
    <>
    <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )

  const columns = [
    {
      name: 'MVP Id',
      selector: (row:any) => row.mvpId,
      sortable: true
    },
    {
      name: 'Short Title',
      selector: (row:any) => row.shortTitle,
      sortable: true
    },
    {
      name: 'Description',
      selector: (row:any) => row.description,
      sortable: false,
      wrap: true
    },
    {
      name: 'Quality Measure Ids',
      selector: (row:any) => row.qualityMeasureIds.join(', '),
      sortable: false,
      wrap: true
    },
    {
      name: 'PI Measure Ids',
      selector: (row:any) => row.foundationPiMeasureIds.join(', '),
      sortable: false,
      wrap: true
    },
    {
      name: 'IA Measure Ids',
      selector: (row:any) => row.iaMeasureIds.join(', '),
      sortable: false,
      wrap: true
    },
    {
      name: 'Cost Measure Ids',
      selector: (row:any) => row.costMeasureIds.join(', '),
      sortable: false,
      wrap: true
    },
    {
      name: 'Add/Remove',
      cell: (row:any) => (AddRemoveComp(row.mvpId))
    }
  ]
  const MvpTableComp: JSX.Element = (
    <Box sx={{ flexGrow: 1, width: '100%'}}>
      <DataTable
        columns={columns}
        data={ mvps }
        selectableRows
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />
    </Box>
  )

  const AddRemoveComp = (id: String): JSX.Element => { return (
    <>
      <Button style={{backgroundColor: "green", color: "white"}} onClick={(x) => addBlankMvp() }>+</Button>
      <Button style={{backgroundColor: "red", color: "white"}} onClick={(x) => removeMvp(id)}>-</Button>
    </>
  )}

  return (
    <div className={styles.container}>
      <Head>
        { HeadContent }
      </Head>

      <main className={styles.main}>
        <Box sx={{flexGrow: 0.1}}>
          <h2 className={styles.title}>
            MVP Factory
          </h2>
        </Box>
        { (measures_loading) ? LoadingComp : MvpTableComp }
      </main>
      <Footer/>
    </div>
  )
})


export default MvpFactory
