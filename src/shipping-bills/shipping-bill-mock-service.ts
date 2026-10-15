import { getDemoData, saveBill } from './demo-store'
import { SavedBill, ShippingBillFormValues } from './model'
import { shippingBillService } from './shipping-bill-service'

const MOCK_DELAY_MS = 250

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function validateSubmission(values: ShippingBillFormValues) {
  const { exporters, businesses } = getDemoData()
  const exporter = exporters.find((party) => String(party.id) === values.exporterId && !party.disabled)
  if (!exporter || !exporter.branches.some((branch) => String(branch.id) === values.exporterBranchId)) {
    throw new Error('Select a valid exporter and one of its branches before submitting.')
  }

  const consignee = businesses.find(
    (party) => String(party.id) === values.consigneeId && party.isConsignee
  )
  if (!consignee || !consignee.branches.some((branch) => String(branch.id) === values.consigneeBranchId)) {
    throw new Error('Select a valid consignee and one of its branches before submitting.')
  }

  if (!values.loadingPort || !values.finalDestinationPort) {
    throw new Error('Select both the loading port and final destination.')
  }

  const grossWeight = values.grossWeight?.trim() ? Number(values.grossWeight) : undefined
  const netWeight = values.netWeight?.trim() ? Number(values.netWeight) : undefined
  if (grossWeight !== undefined && (!Number.isFinite(grossWeight) || grossWeight < 0)) {
    throw new Error('Gross weight must be a non-negative number.')
  }
  if (netWeight !== undefined && (!Number.isFinite(netWeight) || netWeight < 0)) {
    throw new Error('Net weight must be a non-negative number.')
  }
  if (grossWeight !== undefined && netWeight !== undefined && netWeight > grossWeight) {
    throw new Error('Net weight cannot exceed gross weight.')
  }

  for (const [rangeIndex, range] of values.packingRanges.entries()) {
    const from = range.packingNumberFrom.trim() ? Number(range.packingNumberFrom) : undefined
    const to = range.packingNumberTo.trim() ? Number(range.packingNumberTo) : undefined
    if ((from === undefined) !== (to === undefined)) {
      throw new Error(`Enter both ends of packing range ${rangeIndex + 1}.`)
    }
    if (from !== undefined && to !== undefined) {
      if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to < 1) {
        throw new Error(`Packing range ${rangeIndex + 1} must use positive whole numbers.`)
      }
      if (from > to) {
        throw new Error(`Packing range ${rangeIndex + 1} must start at or before it ends.`)
      }
    }
  }

  if (!values.invoices.length) {
    throw new Error('Add at least one invoice.')
  }

  for (const [invoiceIndex, invoice] of values.invoices.entries()) {
    if (!invoice.invoiceNumber.trim() || !invoice.invoiceDate || !invoice.currency) {
      throw new Error(`Complete the number, date, and currency for invoice ${invoiceIndex + 1}.`)
    }

    if (!invoice.buyerSameAsConsignee) {
      const buyer = businesses.find(
        (party) => String(party.id) === invoice.buyerId && party.isBuyer
      )
      if (!buyer || !buyer.branches.some((branch) => String(branch.id) === invoice.buyerBranchId)) {
        throw new Error(`Select a valid buyer and branch for invoice ${invoiceIndex + 1}.`)
      }
    }

    if (invoice.thirdPartyId) {
      const thirdParty = businesses.find(
        (party) => String(party.id) === invoice.thirdPartyId && party.isThirdParty
      )
      if (!thirdParty || !thirdParty.branches.some((branch) => String(branch.id) === invoice.thirdPartyBranchId)) {
        throw new Error(`Select a valid third party and branch for invoice ${invoiceIndex + 1}.`)
      }
    }

    if (!invoice.items.length) {
      throw new Error(`Add at least one item to invoice ${invoiceIndex + 1}.`)
    }
    for (const [itemIndex, item] of invoice.items.entries()) {
      if (!item.ritcCode.trim() || !item.goodsDescription1.trim()) {
        throw new Error(`Enter an HS / RITC code and goods description for item ${itemIndex + 1} in invoice ${invoiceIndex + 1}.`)
      }
      if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0) {
        throw new Error(`Enter a quantity above zero for item ${itemIndex + 1} in invoice ${invoiceIndex + 1}.`)
      }
      if (!Number.isFinite(Number(item.unitPrice)) || Number(item.unitPrice) <= 0) {
        throw new Error(`Enter a unit price above zero for item ${itemIndex + 1} in invoice ${invoiceIndex + 1}.`)
      }

      if (item.thirdPartyItem) {
        const itemThirdParty = businesses.find(
          (party) => String(party.id) === item.itemThirdPartyId && party.isThirdParty
        )
        if (!itemThirdParty || !itemThirdParty.branches.some((branch) => String(branch.id) === item.itemThirdPartyBranchId)) {
          throw new Error(`Select a valid third party and branch for item ${itemIndex + 1} in invoice ${invoiceIndex + 1}.`)
        }
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
