import {types, getSnapshot, applySnapshot, Instance, flow} from "mobx-state-tree";
import axios from "axios";
import {useMemo} from "react";
import AppStore from "./app.store";

const MeasuresDataStrata = types.model({
    description: "",
    eMeasureUuids: types.optional(types.model({
        initialPopulationUuid: "",
        denominatorUuid: "",
        numeratorUuid: "",
        denominatorExclusionUuid: ""
    }), {})
})

const Measure = types.model({
    title: "",
    eMeasureId: types.optional(types.maybeNull(types.string), ""),
    nqfId: types.maybeNull(types.string),
    nqfEMeasureId: types.maybeNull(types.string),
    eMeasureUuid: types.optional(types.string, ""),
    measureId: "",
    category: "",
    description: "",
    nationalQualityStrategyDomain: types.maybeNull(types.string),
    primarySteward: "",
    firstPerformanceYear: 1969,
    lastPerformanceYear: types.maybeNull(types.number),
    metricType: "",
    measureType: "",
    isInverse: false,
    isHighPriority: false,
    isClinicalGuidelineChanged: false,
    isRegistryMeasure: false,
    isRiskAdjusted: false,
    isIcdImpacted: false,
    icdImpacted: types.array(types.string),
    clinicalGuidelineChanged: types.array(types.string),
    allowedPrograms: types.array(types.string),
    submissionMethods: types.array(types.string),
    measureSets: types.array(types.string),
    measureSpecification: types.maybeNull(types.union(types.model({
        default: ""
    }),types.string)),
    strata: types.array(MeasuresDataStrata),
    cpcPlusGroup: "",
    eligibilityOptions: types.array(types.model({
        diagnosisCodes: types.array(types.string),
        maxAge: 0,
        minAge: 0,
        optionGroup: "",
        procedureCodes: types.array(types.model({
            code: ""
        }))
    })),
    performanceOptions: types.array(types.model({
        optionGroup: "",
        optionType: "",
        qualityCodes: types.array(types.model({
            code: ""
        }))
    }))
})

const MeasuresData = types.model({
    measures: types.array(Measure),
    year: 2021,
    total_measure_count: 0,
    total_quality_measure_count: 0,
    total_pi_measure_count: 0,
    total_ia_measure_count: 0,
    total_cost_measure_count: 0,
    measures_loading: true
  }).actions((self) => {
      const getMeasuresData = flow(function* (performanceYear: number) {
          if (performanceYear == self.year) { return }

          self.measures_loading = true
          const {data} = yield axios.get('https://raw.githubusercontent.com/CMSgov/qpp-measures-data/develop/measures/' + performanceYear + '/measures-data.json');
          self.measures_loading = false

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

export const defaultMeasuresSnapshot = {
    measures: [],
    year: 1969,
    total_measure_count: 0,
    total_quality_measure_count: 0,
    total_pi_measure_count: 0,
    total_ia_measure_count: 0,
    total_cost_measure_count: 0
}

// Can convert Mobx-State-Tree models to Typescript model. Cool!
export type IMeasure = Instance<typeof Measure>

let store: IMeasureStore | undefined
export type IMeasureStore = Instance<typeof MeasuresData>


export function initializeStore(snapshot = null) {
    const _store = store ?? MeasuresData.create(defaultMeasuresSnapshot)

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