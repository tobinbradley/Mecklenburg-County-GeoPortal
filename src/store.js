import { writable } from 'svelte/store'
import { readable } from 'svelte/store'

// export let location = writable({
//   label: '5515 RUTH DR CHARLOTTE NC 28215',
//   address: '5515 RUTH DR CHARLOTTE NC 28215',
//   lnglat: [-80.7591, 35.2483],
//   pid: '09910232',
//   groundpid: '09910232'
// })

let initLocation = {
  label: null,
  address: null,
  lnglat: null,
  pid: null,
  groundpid: null
}

const initTabs = [
  {
    name: 'Schools',
    id: 'schools'
  },
  {
    name: 'Trash & Recycling',
    id: 'trash'
  },
  {
    name: 'Property',
    id: 'property'
  },
  {
    name: 'Environment',
    id: 'environment'
  },
  {
    name: 'Impervious',
    id: 'impervious'
  },
  {
    name: 'Voting',
    id: 'voting'
  },
  {
    name: 'Parks',
    id: 'parks'
  },
  {
    name: 'Libraries',
    id: 'libraries'
  },
  {
    name: 'Community',
    id: 'community'
  }
]

let defaultTabs = ['schools']


// message types are: info, warning, error, success
const toastData = {
  message: "",
  messageType: "success",
  loadDelay: 1000,
  dismissDelay: 5000
}

// export the things
export let scroll = writable(false)
export let location = writable(initLocation)
export const tabs = readable(initTabs)
export let toastMessage = writable(toastData)


// process hash on load
const args = window.location.hash.replace('#', '').split('/')
if (args.length === 2) {
  // default tabs
  if (args[1].length > 0) {
    const argsTabs = args[1].split(',')
    const tabVals = initTabs.map(el => el.id)
    if (argsTabs.every(r => tabVals.indexOf(r)) !== -1)
      defaultTabs = argsTabs
  }
}

export let activeTabs = writable(defaultTabs)
