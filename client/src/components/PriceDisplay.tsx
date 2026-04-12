import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Currency } from './ui/Currency';
import { Badge } from './ui/badge';
import { calculateFinalPrice } from '@/lib/discounts';

interface Discount {
    id: string | number;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    scope: 'product' | 'identity' | 'both';
    applicableItems: string[];
    isGlobal: boolean;
}

interface SiteConfig {
    key: string;
    value: string;
}

interface PriceDisplayProps {
    price: number;
    itemId: string | number;
    itemType: 'product' | 'identity';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showBadge?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
    price,
    itemId,
    itemType,
    size = 'md',
    className = '',
    showBadge = true
}) => {
    const { data: activeDiscounts = [] } = useQuery<Discount[]>({
        queryKey: ['/api/discounts/active'],
    });

    const { data: configs = [] } = useQuery<SiteConfig[]>({
        queryKey: ["/api/site-configs"],
    });

    const globalPercentage = parseFloat(configs.find(c => c.key === 'global_discount_percentage')?.value || '0');

    const { finalPrice, discountValue } = calculateFinalPrice(
        price,
        itemId,
        itemType,
        activeDiscounts,
        globalPercentage
    );

    const hasDiscount = discountValue > 0;
    const discountPercent = Math.round((discountValue / price) * 100);

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex items-center gap-3 flex-wrap">
                <div className={`${hasDiscount ? 'text-red-600 font-bold' : 'text-foreground font-semibold'}`}>
                    <Currency amount={finalPrice} size={size} logoClassName={hasDiscount ? 'text-red-600' : 'text-primary'} />
                </div>
                
                {hasDiscount && (
                    <div className="relative text-muted-foreground/60 font-normal px-0.5">
                        <Currency amount={price} size={size === 'xl' ? 'lg' : 'sm'} logoClassName="text-muted-foreground/60" />
                        <div className="absolute top-[55%] left-0 right-0 h-[1.2px] bg-muted-foreground/60 rounded-full" />
                    </div>
                )}

                {hasDiscount && showBadge && (
                    <Badge variant="destructive" className="animate-pulse bg-red-600 hover:bg-red-700">
                        {discountPercent}% خصم
                    </Badge>
                )}
            </div>
            
            {hasDiscount && size === 'xl' && (
                <p className="text-xs text-red-600 font-medium mt-1">
                    وفرت {Math.round(discountValue)} ر.س من السعر الأصلي
                </p>
            )}
        </div>
    );
};
