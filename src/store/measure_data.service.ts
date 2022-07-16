import {types, getSnapshot, applySnapshot, Instance, flow} from "mobx-state-tree";
import axios from "axios";
import {useMemo} from "react";
import AppStore from "./app.store";
import makeInspectable from 'mobx-devtools-mst';

const Measure = types.model({
    title: types.maybe(types.string),
    eMeasureId: types.optional(types.maybeNull(types.string), ""),
    nqfId: types.maybeNull(types.string),
    nqfEMeasureId: types.maybeNull(types.string),
    eMeasureUuid: types.optional(types.string, ""),
    measureId: types.maybe(types.string),
    category: types.maybe(types.string),
    description: types.maybe(types.string),
    nationalQualityStrategyDomain: types.maybeNull(types.string),
    primarySteward: types.maybe(types.string),
    firstPerformanceYear: types.maybe(types.number),
    lastPerformanceYear: types.maybeNull(types.number),
    metricType: types.maybe(types.string),
    measureType: types.maybe(types.string),
    isInverse: types.maybe(types.boolean),
    isHighPriority: types.maybe(types.boolean),
    isClinicalGuidelineChanged: types.maybe(types.boolean),
    isRegistryMeasure: types.maybe(types.boolean),
    isRiskAdjusted: types.maybe(types.boolean),
    isIcdImpacted: types.maybe(types.boolean),
    icdImpacted: types.maybe(types.array(types.string)),
    clinicalGuidelineChanged: types.array(types.string),
    allowedPrograms: types.array(types.string),
    submissionMethods: types.array(types.string),
    measureSets: types.array(types.string),
    measureSpecification: types.maybeNull(types.union(types.model({
        default: types.maybe(types.string)
    }),types.string)),
    strata: types.array(types.model({
        description: types.maybe(types.string),
        eMeasureUuids: types.optional(types.model({
            initialPopulationUuid: types.maybe(types.string),
            denominatorUuid: types.maybe(types.string),
            numeratorUuid: types.maybe(types.string),
            denominatorExclusionUuid: types.maybe(types.string)
        }), {})
    })),
    cpcPlusGroup: types.maybe(types.string),
    eligibilityOptions: types.array(types.model({
        diagnosisCodes: types.array(types.string),
        maxAge: types.maybe(types.number),
        minAge: types.maybe(types.number),
        optionGroup: types.maybe(types.string),
        procedureCodes: types.array(types.model({
            code: types.maybe(types.string)
        }))
    })),
    performanceOptions: types.array(types.model({
        optionGroup: types.maybe(types.string),
        optionType: types.maybe(types.string),
        qualityCodes: types.array(types.model({
            code: types.maybe(types.string)
        }))
    }))
})

const MeasuresData = types.model("MeasuresData", {
    measures: types.array(Measure),
    year: 2021,
    measures_loading: true
  }).views((self) => ({
    get total_measure_count() {
        return self.measures.length
    },
    get total_quality_measure_count() {
        return self.measures.filter(m => m.category == 'quality').length
    },
    get total_pi_measure_count() {
        return self.measures.filter(m => m.category == 'pi' || m.category == 'aci').length
    },
    get total_ia_measure_count() {
        return self.measures.filter(m => m.category == 'ia').length
    },
    get total_cost_measure_count() {
        return self.measures.filter(m => m.category == 'cost').length
    },
})).actions((self) => {
   const getMeasuresData = flow(function* (performanceYear: number) {
       if (performanceYear == self.year) { return }

       self.measures_loading = true
       const {data} = yield axios.get('https://raw.githubusercontent.com/CMSgov/qpp-measures-data/develop/measures/' + performanceYear + '/measures-data.json');
       self.measures_loading = false

       self.measures = data
       self.year = performanceYear
   })

   return { getMeasuresData }
  }
)

export const defaultMeasuresSnapshot = {
    measures: [],
    year: 1969
}

// Can convert Mobx-State-Tree models to Typescript model. Cool!
export type IMeasure = Instance<typeof Measure>

let store: IMeasureStore | undefined
export type IMeasureStore = Instance<typeof MeasuresData>


export function initializeStore(snapshot = null) {
    const _store = store ?? MeasuresData.create(defaultMeasuresSnapshot)
    makeInspectable(_store) // Should not be enabled in PROD

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