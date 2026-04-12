interface Discount {
    id: string | number;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    scope: 'product' | 'identity' | 'both';
    applicableItems: string[];
    isGlobal: boolean;
}

export function calculateFinalPrice(
    price: number,
    itemId: string | number,
    itemType: 'product' | 'identity',
    activeDiscounts: Discount[],
    globalPercentage: number = 0
): { finalPrice: number; discountValue: number; discountName: string } {
    let bestDiscountValue = 0;
    let discountName = '';

    // 1. Check item-specific discounts
    const itemDiscounts = activeDiscounts.filter(d => 
        (d.scope === itemType || d.scope === 'both') && 
        (d.applicableItems.includes(itemId.toString()) || d.isGlobal)
    );

    if (itemDiscounts.length > 0) {
        itemDiscounts.forEach(d => {
            let currentDiscount = 0;
            if (d.type === 'percentage') {
                currentDiscount = price * (d.value / 100);
            } else {
                currentDiscount = d.value;
            }

            if (currentDiscount > bestDiscountValue) {
                bestDiscountValue = currentDiscount;
                discountName = d.name;
            }
        });
    }

    // 2. If no item discount, check global percentage from settings
    if (bestDiscountValue === 0 && globalPercentage > 0) {
        bestDiscountValue = price * (globalPercentage / 100);
        discountName = 'خصم عام';
    }

    const finalPrice = Math.max(0, price - bestDiscountValue);
    return { 
        finalPrice: Math.round(finalPrice), 
        discountValue: Math.round(bestDiscountValue), 
        discountName 
    };
}
