import { getDemoData, saveBill } from './demo-store'
import { SavedBill, ShippingBillFormValues } from './model'
import { shippingBillService } from './shipping-bill-service'

const MOCK_DELAY_MS = 250

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function validateSubmission(values: ShippingBillFormValues) {
  if (!values.exporterId || !values.exporterBranchId) {
    throw new Error('Select an exporter and its branch before saving.')
  }
  if (!values.consigneeId || !values.consigneeBranchId) {
    throw new Error('Select a consignee and its branch before saving.')
  }
  if (!values.loadingPort || !values.finalDestinationPort) {
    throw new Error('Select both the loading port and final destination.')
  }
  if (!values.invoices.length) {
    throw new Error('Add at least one invoice.')
  }
  for (const [invoiceIndex, invoice] of values.invoices.entries()) {
    if (!invoice.items.length) {
      throw new Error(`Add at least one item to invoice ${invoiceIndex + 1}.`)
    }
    for (const [itemIndex, item] of invoice.items.entries()) {
      if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0) {
        throw new Error(`Enter a quantity above zero for item ${itemIndex + 1} in invoice ${invoiceIndex + 1}.`)
      }
      if (!Number.isFinite(Number(item.unitPrice)) || Number(item.unitPrice) <= 0) {
        throw new Error(`Enter a unit price above zero for item ${itemIndex + 1} in invoice ${invoiceIndex + 1}.`)
      }
    }
  }
}

/**
 * API-ready mock boundary for the Shipping Bill screen.
 *
 * Components depend on these asynchronous methods instead of a backend URL.
 * A real API implementation can replace this module without changing the form UI.
 */
export const shippingBillMockService = {
  async list(): Promise<SavedBill[]> {
    const localBills = getDemoData().bills
    const combined = new Map<number, SavedBill>()

    // Keep starter examples visible while letting locally saved versions take precedence.
    for (const bill of shippingBillService.getInitialBills()) combined.set(bill.id, bill)
    for (const bill of localBills) combined.set(bill.id, bill)

    return delay(Array.from(combined.values()).sort((a, b) => {
      const timeA = Date.parse(a.updated || '') || 0
      const timeB = Date.parse(b.updated || '') || 0
      return timeB - timeA
    }))
  },

  async saveDraft(values: ShippingBillFormValues, id?: number): Promise<SavedBill> {
    await delay(undefined)
    return saveBill(values, id)
  },

  async submit(values: ShippingBillFormValues, id?: number): Promise<SavedBill> {
    await delay(undefined)
    validateSubmission(values)
    return saveBill(values, id)
  }
}
