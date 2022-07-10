import {types, getSnapshot, applySnapshot, Instance, flow} from "mobx-state-tree";
import axios from "axios";
import {useMemo} from "react";
import AppStore from "./app.store";

interface IMeasure {
    measureId: string;
    category: string;
    firstPerformanceYear: string;
    metricType: string;
    measureType: string;
    isInverse: boolean;
}

const Measure = types.model({
    measureId: "",
    category: "",
    firstPerformanceYear: 1969,
    metricType: "",
    measureType: "",
    isInverse: false
})

export const defaultMeasuresData = {
    measures: [],
    year: 1969,
    total_measure_count: 0,
    total_quality_measure_count: 0,
    total_pi_measure_count: 0,
    total_ia_measure_count: 0,
    total_cost_measure_count: 0
}

const MeasuresData = types.model({
    measures: types.array(Measure),
    year: 2021,
    total_measure_count: 0,
    total_quality_measure_count: 0,
    total_pi_measure_count: 0,
    total_ia_measure_count: 0,
    total_cost_measure_count: 0
  }).actions((self) => {
      const getMeasuresData = flow(function* (performanceYear: number) {
          const {data} = yield axios.get('https://raw.githubusercontent.com/CMSgov/qpp-measures-data/develop/measures/' + performanceYear + '/measures-data.json');

          self.measures = data
          self.year = performanceYear
          self.total_measure_count = data.length
          self.total_quality_measure_count = data.filter((x: IMeasure): any => x.category == 'quality').length
          self.total_pi_measure_count = data.filter((x: IMeasure): any => x.category == 'pi').length
          self.total_ia_measure_count = data.filter((x: IMeasure): any => x.category == 'ia').length
          self.total_cost_measure_count = data.filter((x: IMeasure): any => x.category == 'cost').length
      })

    return { getMeasuresData }
  }
)

let store: IMeasureStore | undefined

export type IMeasureStore = Instance<typeof MeasuresData>

export function initializeStore(snapshot = null) {
    const _store = store ?? MeasuresData.create(defaultMeasuresData)

    // hydrated here
    if (snapshot) {
        applySnapshot(_store, snapshot)
    }
    // For SSG and SSR always create a new store. Otherwise you cross client data.
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!store) store = _store

    return store
}

export function useStore(initialState: any) {
    const store = useMemo(() => initializeStore(initialState), [initialState])
    return store
}

export default MeasuresData