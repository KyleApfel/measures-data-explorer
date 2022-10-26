import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {useEffect, useState } from "react";
import Link from 'next/link'
import Footer from '../components/Footer'
import DataTable from 'react-data-table-component';
import {
  Box,
  Button,
  CircularProgress,
  OutlinedInput,
  FormHelperText,
  TextField,
  Container,
  Paper,
  AppBar, Toolbar, IconButton, Typography, Grid
} from "@mui/material";
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
    d['specialtiesMostApplicableTo'] = d.specialtiesMostApplicableTo.split(',')
    d['qualityMeasureIds'] = d.qualityMeasureIds.split(',')
    d['iaMeasureIds'] = d.iaMeasureIds.split(',')
    d['costMeasureIds'] = d.costMeasureIds.split(',')
    d['foundationPiMeasureIds'] = d.foundationPiMeasureIds.split(',')
    d['foundationQualityMeasureIds'] = d.foundationQualityMeasureIds.split(',')
    updateMvp(originalMvpId, d)
  }

// @ts-ignore
  const ExpandedComponent = ({ data }) => {
    const { register, handleSubmit, formState: { errors }} = useForm()
    return (
      <Box sx={{flexGrow: 1, width: "95%", paddingLeft: "5%"}}>
        <form onSubmit={ handleSubmit(onSubmit) }>
          <input type="hidden" {...register("mvpId",{ required: true })} defaultValue={data.mvpId} />
          <label>
            <FormHelperText>Mvp Id: {errors?.newMvpId && (<u style={{color: "red"}}>(Required)</u>)}</FormHelperText>
            <OutlinedInput key={data.mvpId} fullWidth {...register("newMvpId",{ required: true })} defaultValue={data.mvpId}/>
          </label>
          <label>
            <FormHelperText>Title: {errors?.title && (<u style={{color: "red"}}>(Required)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("title",{ required: true })} defaultValue={data.title}/>
          </label>
          <label>
            <FormHelperText>Description: {errors?.description && (<u style={{color: "red"}}>(Required)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("description",{ required: true })} defaultValue={data.description}/>
          </label>
          <label>
            <FormHelperText>Specialities Most Applicable To (Comma Separated): {errors?.specialtiesMostApplicableTo && (<u style={{color: "red"}}>(Required)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("specialtiesMostApplicableTo",{ required: true,  pattern: /^[a-zA-Z0-9_]*[a-zA-Z0-9]+(?:,[a-zA-Z0-9_]*[a-zA-Z0-9]+)*$/ })} defaultValue={data.specialtiesMostApplicableTo}/>
          </label>
          <label>
            <FormHelperText>Clinical Topics: {errors?.clinicalTopic && (<u style={{color: "red"}}>(Required)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("clinicalTopics",{ required: true })} defaultValue={data.clinicalTopics}/>
          </label>
          <label>
            <FormHelperText>Clinical Topic: {errors?.clinicalTopic && (<u style={{color: "red"}}>(Required)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("clinicalTopic",{ required: true })} defaultValue={data.clinicalTopic}/>
          </label>
          <label>
            <FormHelperText>Quality Measure Ids (Comma Separated): {errors?.qualityMeasureIds && (<u style={{color: "red"}}>(Required, Alphanumeric Only)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("qualityMeasureIds",{ required: true, pattern: /^[a-zA-Z0-9_]*[a-zA-Z0-9]+(?:,[a-zA-Z0-9_]*[a-zA-Z0-9]+)*$/ })} defaultValue={data.qualityMeasureIds}/>
          </label>
          <label>
            <FormHelperText>Foundation PI Measure Ids (Comma Separated): {errors?.foundationPiMeasureIds && (<u style={{color: "red"}}>(Required, Alphanumeric Only)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("foundationPiMeasureIds",{ required: true,  pattern: /^[a-zA-Z0-9_]*[a-zA-Z0-9]+(?:,[a-zA-Z0-9_]*[a-zA-Z0-9]+)*$/})} defaultValue={data.foundationPiMeasureIds}/>
          </label>
          <label>
            <FormHelperText>IA Measure Ids (Comma Separated): {errors?.iaMeasureIds && (<u style={{color: "red"}}>(Required, Alphanumeric Only)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("iaMeasureIds",{ required: true,  pattern: /^[a-zA-Z0-9_]*[a-zA-Z0-9]+(?:,[a-zA-Z0-9_]*[a-zA-Z0-9]+)*$/})} defaultValue={data.iaMeasureIds}/>
          </label>
          <label>
            <FormHelperText>Cost Measure Ids (Comma Separated): {errors?.costMeasureIds && (<u style={{color: "red"}}>(Required, Alphanumeric Only)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("costMeasureIds",{ required: true,  pattern: /^[a-zA-Z0-9_]*[a-zA-Z0-9]+(?:,[a-zA-Z0-9_]*[a-zA-Z0-9]+)*$/})} defaultValue={data.costMeasureIds}/>
          </label>
          <label>
            <FormHelperText>Foundation Quality Measure Ids (Comma Separated): {errors?.foundationQualityMeasureIds && (<u style={{color: "red"}}>(Required, Alphanumeric Only)</u>)}</FormHelperText>
            <OutlinedInput fullWidth {...register("foundationQualityMeasureIds",{ required: true,  pattern: /^[a-zA-Z0-9_]*[a-zA-Z0-9]+(?:,[a-zA-Z0-9_]*[a-zA-Z0-9]+)*$/})} defaultValue={data.foundationQualityMeasureIds}/>
          </label>
          <p></p>
          <Grid container spacing={2}>
            <Grid item xs={11}>
              <Button variant="contained" color="success" type="submit" value="Save">Submit</Button>
            </Grid>
            <Grid item xs={1}>
              { RemoveMvpComp(data.mvpId) }
            </Grid>
          </Grid>
          <p></p>
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
      name: 'System Generated Measure Ids',
      selector: (row:any) => row.foundationQualityMeasureIds.join(', '),
      sortable: false,
      wrap: true
    }
  ]
  const MvpTableComp: JSX.Element = (
    <Paper elevation={12}>
      <Box sx={{ flexGrow: 1, width: '100%'}}>
        <DataTable
          columns={columns}
          data={ mvps }
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />
      </Box>
    </Paper>
  )

  const ExportBoxComp: JSX.Element = (
    <Box sx={{ flexGrow: 1, width: "60%"}}>
      <h3>JSON Export: </h3>
      <Button variant="outlined" color="primary" onClick={() =>  navigator.clipboard.writeText(JSON.stringify(mvps, null, 2))}>
        Copy To Clipboard
      </Button>
      <TextField
        id="filled-multiline-flexible"
        label="JSON Export"
        multiline
        maxRows={25}
        fullWidth
        value={JSON.stringify(mvps, null, 2)}
        variant="filled"
      />
    </Box>
  )

  const AddMvpComp: JSX.Element = (
    <Grid container alignItems="flex-start" direction="row" justifyContent="flex-end">
      <Grid item xs={1} >
        <Button variant="contained" color="success" onClick={(x) => addBlankMvp() }><strong>Create MVP</strong></Button>
      </Grid>
    </Grid>
  )

  const RemoveMvpComp = (id: String): JSX.Element => { return (
    <>
      <Button variant="contained" color="error" onClick={(x) => removeMvp(id)}>Delete</Button>
    </>
  )}

  return (
    <div className={styles.container}>
      <Head>
        { HeadContent }
      </Head>

      <main className={styles.main}>
        <Container maxWidth="xl">
          <Paper elevation={12}>
            <Box sx={{flexGrow: 0.3}}>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    MVP Factory 🏭
                  </Typography>
                  <h3>Other Tools:</h3><Link href={"/measures-explorer"}><Button color="inherit">Measures Explorer 🔎</Button></Link>
                </Toolbar>
              </AppBar>
            </Box>
          </Paper>
          <p></p>
          { (measures_loading) ? LoadingComp : MvpTableComp }
          { (measures_loading) ? LoadingComp : AddMvpComp }
          { (measures_loading) ? LoadingComp : ExportBoxComp }
        </Container>
      </main>
      <Footer/>
    </div>
  )
})


export default MvpFactory
