import {types, getSnapshot, applySnapshot, Instance, flow} from "mobx-state-tree";
import axios from "axios";
import {useMemo} from "react";
import makeInspectable from 'mobx-devtools-mst';

const defaultMvpVO = {
    mvpId: "G006X",
    clinicalTopics: "",
    title: "",
    description: "",
    specialtiesMostApplicableTo: [],
    clinicalTopic: "",
    qualityMeasuresIds: [],
    iaMeasureIds: [],
    costMeasureIds: [],
    foundationPiMeasureIds: [],
    foundationQualityMeasureIds: [],
    administrativeClaimsMeasureIds: [],
    allowedVendors: [],
    hasCahps: false,
    hasOutcomeAdminClaims: false
}

const MvpVO = types.model({
    mvpId: types.string,
    clinicalTopic: types.string,
    title: types.string,
    description: types.string,
    specialtiesMostApplicableTo: types.array(types.string),
    clinicalTopics: types.string,
    qualityMeasureIds: types.array(types.string),
    iaMeasureIds: types.array(types.string),
    costMeasureIds: types.array(types.string),
    foundationPiMeasureIds: types.array(types.string),
    foundationQualityMeasureIds: types.array(types.string),
    administrativeClaimsMeasureIds: types.array(types.string),
    allowedVendors: types.optional(types.array(types.string), []),
    hasCahps: types.optional(types.boolean, false),
    hasOutcomeAdminClaims: types.optional(types.boolean, false)
})

export type iMvpVO = Instance<typeof MvpVO>

const MeasureVO = types.model({
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
    measures: types.array(MeasureVO),
    mvps: types.array(MvpVO),
    year: 2022,
    measures_loading: true,
    last_loaded_year: 2022
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

      const enrichMvpData = (mvp: any) => {
          const hasCahps = mvp.qualityMeasureIds.includes('321')
          const hasOutcomeAdminClaims = (mvp.administrativeClaimsMeasureIds === undefined) ? false : mvp.administrativeClaimsMeasureIds.length > 0

          return Object.assign({}, mvp, {hasCahps, hasOutcomeAdminClaims})
      }

      const getMvpData = flow(function* (performanceYear: number) {
          if (self.last_loaded_year === performanceYear) return
          self.measures_loading = true
          try {
              const {data} = yield axios.get('https://raw.githubusercontent.com/CMSgov/qpp-measures-data/develop/mvp/' + performanceYear + '/mvp.json')
              const enrich_mvp_data = data.map((x: any) => enrichMvpData(x))
              self.measures_loading = false
              self.mvps = enrich_mvp_data
          } catch {
              self.mvps.length = 0
              self.mvps.push(MvpVO.create(defaultMvpVO))
              self.measures_loading = false
          }
      })

      const getMvpDataFromSession = flow(function* (session: any) {
          self.measures_loading = true
          self.mvps = session
          self.measures_loading = false
      })

      const addBlankMvp = () => {
          self.measures_loading = true
          self.mvps.push(MvpVO.create(defaultMvpVO))
          self.measures_loading = false
      }

      const removeMvp = (id: String) => {
          self.measures_loading = true
          // @ts-ignore
          self.mvps = self.mvps.filter((mvp: iMvpVO) => mvp.mvpId !== id)
          self.measures_loading = false
      }

      const updateMvp = (id: String, data: iMvpVO) => {
          const mvpIndex = self.mvps.findIndex((element, index) => (element.mvpId === id))
          self.mvps[mvpIndex] = MvpVO.create(data)
      }

      return { getMeasuresData, getMvpData, addBlankMvp, removeMvp, updateMvp, getMvpDataFromSession }
  }
)

export const defaultMeasuresSnapshot = {
    measures: [],
    mvps: [],
    year: 1969
}

// Can convert Mobx-State-Tree models to Typescript model. Cool!
export type IMeasure = Instance<typeof MeasureVO>

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