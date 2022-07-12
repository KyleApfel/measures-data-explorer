import { useMemo } from 'react'
import {types, getSnapshot, Instance, SnapshotIn, SnapshotOut, applySnapshot, castToSnapshot} from "mobx-state-tree";
import MeasuresData, {defaultMeasuresData} from "./measure_data.service";

const AppStore = types.model({
  measuresData: types.map(MeasuresData)
})

let store: IStore | undefined

export type IStore = Instance<typeof AppStore>
export type IStoreSnapshotIn = SnapshotIn<typeof AppStore>
export type IStoreSnapshotOut = SnapshotOut<typeof AppStore>

export function initializeStore(snapshot = null) {
  const _store = store ?? AppStore.create({ measuresData: {} })

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

export default AppStore