import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {useEffect, useState } from "react";
import Link from 'next/link'
import {Button} from "@material-ui/core";
import Footer from '../components/Footer'
import DataTable from 'react-data-table-component';
import {Box, Checkbox, CircularProgress, OutlinedInput, FormHelperText, FormGroup, Grid, Paper, TextField} from "@mui/material";
import { useForm } from 'react-hook-form'
import FormControl, { useFormControl } from '@mui/material/FormControl';

import { IMeasureStore, useStore, iMvpVO } from "../store/measure_data.service";
import {observer} from "mobx-react-lite";
import {update} from "immutable";

interface Props {
  store?: IMeasureStore
}

const MvpFactory: NextPage<Props> = observer((props) => {
  const { getMvpData, mvps, measures_loading, addBlankMvp, removeMvp, updateMvp} = useStore(props.store)
  const router = useRouter();
  const performanceYear = (router.query.performanceYear != undefined) ? router.query.performanceYear : 2023

  useEffect(() => {
    const _year = (!router.isReady) ? 2023 : parseInt(performanceYear as string)
    if (mvps.length == 0) getMvpData(_year)
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

  const onSubmit = (d: any) => {
    const originalMvpId = d.mvpId
    d['mvpId'] = d['newMvpId']
    delete d['newMvpId']
    d['specialtyMostApplicableTo'] = [d.specialtyMostApplicableTo]
    d['qualityMeasureIds'] = d.qualityMeasureIds.split(',')
    d['iaMeasureIds'] = d.iaMeasureIds.split(',')
    d['costMeasureIds'] = d.costMeasureIds.split(',')
    d['foundationPiMeasureIds'] = d.foundationPiMeasureIds.split(',')
    d['foundationQualityMeasureIds'] = d.foundationQualityMeasureIds.split(',')
    updateMvp(originalMvpId, d)
  }

// @ts-ignore
  const ExpandedComponent = ({ data }) => {
    const { register, handleSubmit } = useForm()
    return (
      <Box sx={{flexGrow: 1, width: "95%", paddingLeft: "5%"}}>
        <form onSubmit={ handleSubmit(onSubmit) }>
          <input type="hidden" {...register("mvpId")} defaultValue={data.mvpId} />
          <label>
            <FormHelperText>Mvp Id:</FormHelperText>
            <OutlinedInput key={data.mvpId} fullWidth {...register("newMvpId")} defaultValue={data.mvpId}/>
          </label>
          <label>
            <FormHelperText>Short Title:</FormHelperText>
            <OutlinedInput fullWidth {...register("shortTitle")} defaultValue={data.shortTitle}/>
          </label>
          <label>
            <FormHelperText>Title:</FormHelperText>
            <OutlinedInput fullWidth {...register("title")} defaultValue={data.title}/>
          </label>
          <label>
            <FormHelperText>Description:</FormHelperText>
            <OutlinedInput fullWidth {...register("description")} defaultValue={data.description}/>
          </label>
          <label>
            <FormHelperText>Speciality Most Applicable To:</FormHelperText>
            <OutlinedInput fullWidth {...register("specialtyMostApplicableTo")} defaultValue={data.specialtyMostApplicableTo}/>
          </label>
          <label>
            <FormHelperText>Clinical Topics:</FormHelperText>
            <OutlinedInput fullWidth {...register("clinicalTopics")} defaultValue={data.clinicalTopics}/>
          </label>
          <label>
            <FormHelperText>Quality Measure Ids:</FormHelperText>
            <OutlinedInput fullWidth {...register("qualityMeasureIds")} defaultValue={data.qualityMeasureIds}/>
          </label>
          <label>
            <FormHelperText>Foundation PI Measure Ids:</FormHelperText>
            <OutlinedInput fullWidth {...register("foundationPiMeasureIds")} defaultValue={data.foundationPiMeasureIds}/>
          </label>
          <label>
            <FormHelperText>IA Measure Ids:</FormHelperText>
            <OutlinedInput fullWidth {...register("iaMeasureIds")} defaultValue={data.iaMeasureIds}/>
          </label>
          <label>
            <FormHelperText>Cost Measure Ids:</FormHelperText>
            <OutlinedInput fullWidth {...register("costMeasureIds")} defaultValue={data.costMeasureIds}/>
          </label>
          <label>
            <FormHelperText>Foundation Quality Measure Ids:</FormHelperText>
            <OutlinedInput fullWidth {...register("foundationQualityMeasureIds")} defaultValue={data.foundationQualityMeasureIds}/>
          </label>
          <p></p>
          <Button style={{backgroundColor: "green", color: "white"}} type="submit" value="Submit">Submit</Button>
        </form>
      </Box>
    )
  }

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

  const ExportBoxComp: JSX.Element = (
    <Box sx={{ flexGrow: 1, width: "60%"}}>
      <h3>JSON Export: </h3>
      <TextField
        id="filled-multiline-flexible"
        label="JSON Export"
        multiline
        fullWidth
        value={JSON.stringify(mvps, null, 2)}
        variant="filled"
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
        <Box sx={{flexGrow: 0.3}}>
          <h2 className={styles.title}>
            🏭 MVP Factory 🏭
          </h2>
        </Box>
        { (measures_loading) ? LoadingComp : MvpTableComp }
        { (!measures_loading) ? ExportBoxComp : (<></>) }
      </main>
      <Footer/>
    </div>
  )
})


export default MvpFactory
