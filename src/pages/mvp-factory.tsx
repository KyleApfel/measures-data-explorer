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

import { IMeasureStore, useStore } from "../store/measure_data.service";
import {observer} from "mobx-react-lite";

const MvpFactory: NextPage<Props> = observer((props) => {
  const HeadContent: JSX.Element = (
    <>
      <title>MVP Factory</title>
      <meta name="description" content="MVP Factory" />
      <link rel="icon" href="/favicon.ico" />
    </>
  )
  return (
    <div className={styles.container}>
      <Head>
        { HeadContent }
      </Head>

      <main className={styles.main}>
          (
            <Box sx={{ flexGrow: 1, width: '100%'}}>
            </Box>
          )
      </main>
      <Footer/>
    </div>
  )
})

export default MvpFactory
