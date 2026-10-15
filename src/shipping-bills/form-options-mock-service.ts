import { documentCodes } from '@/data/e-sanchit-codes'
import { quantityCodes } from '@/data/quantity-code'
import schemeCodes from '@/data/scheme-codes'
import { stateOptions } from '@/data/states'
import { Trades } from '@/data/trade-agrements'
import {
  cargoOptions,
  contractTypes,
  paymentTypes,
  priceInclusionTypes,
  sealTypes,
  weightUnits
} from '@/data/types'
import { ports } from './model'

export interface FormOptionData {
  documentCodes: typeof documentCodes
  quantityCodes: typeof quantityCodes
  schemeCodes: typeof schemeCodes
  stateOptions: typeof stateOptions
  tradeAgreements: typeof Trades
  cargoOptions: typeof cargoOptions
  contractTypes: typeof contractTypes
  paymentTypes: typeof paymentTypes
  priceInclusionTypes: typeof priceInclusionTypes
  sealTypes: typeof sealTypes
  weightUnits: typeof weightUnits
  portOptions: { value: string; label: string }[]
  currencyOptions: { value: string; label: string }[]
  nfeiCategories: { value: string; label: string }[]
  igstPaymentOptions: { value: string; label: string }[]
  accessoryStatusOptions: { value: string; label: string }[]
  goodsSourceOptions: { value: string; label: string }[]
}

const MOCK_DELAY_MS = 200

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS))
}

const portOptions = ports.map((port) => ({ value: port.code, label: `${port.name} · ${port.code}` }))
const currencyOptions = ['USD', 'EUR', 'INR', 'AED', 'GBP', 'SGD'].map((value) => ({ value, label: value }))

const nfeiCategories = [
  { value: '01', label: 'Free trade sample' },
  { value: '02', label: 'Diplomatic goods' },
  { value: '03', label: 'Warranty replacement' },
  { value: '07', label: 'Gift parcel' },
  { value: '08', label: 'Other' }
]

const igstPaymentOptions = [
  { value: 'NA', label: 'Not applicable' },
  { value: 'LUT', label: 'Under LUT / bond' },
  { value: 'P', label: 'Against payment' }
]

const accessoryStatusOptions = [
  { value: '0', label: 'No accessory' },
  { value: '1', label: 'Included free of cost' },
  { value: '2', label: 'Entered separately' }
]

const goodsSourceOptions = [
  { value: 'I', label: 'Imported' },
  { value: 'D', label: 'Indigenous' }
]

/**
 * Asynchronous boundary for reference data used by the Shipping Bill form.
 * Replace this mock implementation with an API request when a backend is available.
 */
export const formOptionsMockService = {
  async getOptions(): Promise<FormOptionData> {
    return delay({
      documentCodes,
      quantityCodes,
      schemeCodes,
      stateOptions,
      tradeAgreements: Trades,
      cargoOptions,
      contractTypes,
      paymentTypes,
      priceInclusionTypes,
      sealTypes,
      weightUnits,
      portOptions,
      currencyOptions,
      nfeiCategories,
      igstPaymentOptions,
      accessoryStatusOptions,
      goodsSourceOptions
    })
  }
}
