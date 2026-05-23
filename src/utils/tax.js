/** Product price is VAT-inclusive: customer pays listed price only. */
export function splitVatInclusive(totalGross, taxRate = 18) {
  const rate = Number(taxRate) || 18;
  const gross = Number(totalGross) || 0;
  const taxAmount = gross * (rate / (100 + rate));
  const subtotal = gross - taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(gross * 100) / 100,
  };
}

export function computeCartLine(price, quantity, taxRate = 18) {
  const gross = price * quantity;
  const { subtotal, taxAmount, total } = splitVatInclusive(gross, taxRate);
  return { subtotal, taxAmount, total };
}
