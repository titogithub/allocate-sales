module.exports = allocate

/**
 *
 * @param {Array<{id: string, created: string, quantity: number}>} salesOrders
 * @param {Array<{id: string, receiving: string, quantity: number}>} purchaseOrders
 * @returns {Array<{salesOrderId: string, availabilityDate: string}>}
 */
function allocate (salesOrders, purchaseOrders) {
  const sortedSalesOrders = sortByDate(salesOrders, 'created', 'ASC')
  const sortedPurchaseOrders = sortByDate(purchaseOrders, 'receiving', 'ASC')

  const solution = []

  for (const saleOrder of sortedSalesOrders) {
    let remainingSaleQuantity = saleOrder.quantity

    for (
      let purchaseOrdersIndex = 0;
      purchaseOrdersIndex < sortedPurchaseOrders.length;
      purchaseOrdersIndex++
    ) {
      const purchaseOrder = sortedPurchaseOrders[purchaseOrdersIndex]

      if (
        isPurchaseOrderDateGreaterThanSaleOrder(
          purchaseOrder.receiving,
          saleOrder.created
        )
      ) {
        if (purchaseOrder.quantity - remainingSaleQuantity > 0) {
          purchaseOrder.quantity =
            purchaseOrder.quantity - remainingSaleQuantity

          solution.push({
            salesOrderId: saleOrder.id,
            availabilityDate: purchaseOrder.receiving
          })
          remainingSaleQuantity = 0
          break
        }

        if (purchaseOrder.quantity - remainingSaleQuantity === 0) {
          solution.push({
            salesOrderId: saleOrder.id,
            availabilityDate: purchaseOrder.receiving
          })

          remainingSaleQuantity = 0
          sortedPurchaseOrders.shift()
          break
        }

        if (purchaseOrder.quantity - remainingSaleQuantity < 0) {
          remainingSaleQuantity =
            remainingSaleQuantity - purchaseOrder.quantity
          purchaseOrdersIndex--
          sortedPurchaseOrders.shift()
        }
      }
    }

    if (remainingSaleQuantity) {
      break
    }
  }

  return solution
}

/**
 *
 * @param {string} purchaseOrder
 * @param {string} saleOrder
 * @returns boolean
 */
function isPurchaseOrderDateGreaterThanSaleOrder (purchaseOrder, saleOrder) {
  return new Date(purchaseOrder).getTime() >= new Date(saleOrder).getTime()
}

/**
 * @template T
 * @param {Array<T>} arr
 * @param { keyof T} property
  * @param {'ASC' | 'DESC'} sortingCriteria
 */
function sortByDate (arr, property, sortingCriteria = 'ASC') {
  return arr.sort(
    (elementA, elementB) =>
      sortingCriteria === 'ASC'
        ? new Date(elementA[property]).getTime() -
          new Date(elementB[property]).getTime()
        : new Date(elementB[property]).getTime() -
          new Date(elementA[property]).getTime()
  )
}
