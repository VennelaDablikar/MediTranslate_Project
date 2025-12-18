"use client";

import React from "react";
import { Pill, AlertCircle, ShoppingCart } from "lucide-react";
import clsx from "clsx";

interface AnalysisCardProps {
    icon: React.ReactNode;
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    stockStatus: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
}

export default function AnalysisCard({
    icon,
    name,
    description,
    price,
    originalPrice,
    stockStatus,
}: AnalysisCardProps) {
    const isLowStock = stockStatus === "LOW STOCK";

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary">
                    {icon}
                </div>
                <span
                    className={clsx(
                        "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide",
                        isLowStock
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                    )}
                >
                    {stockStatus}
                </span>
            </div>

            <div className="space-y-4 flex-1">
                <h3 className="text-xl font-bold text-foreground">{name}</h3>

                <div className="flex items-start gap-2">
                    <AlertCircle className="text-gray-400 mt-1 shrink-0" size={16} />
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-2xl font-bold text-foreground">${price}</span>
                    {originalPrice && (
                        <span className="text-sm text-gray-400 line-through decoration-gray-400">
                            ${originalPrice}
                        </span>
                    )}
                </div>
            </div>

            <button className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                Buy Now
                <ShoppingCart size={16} />
            </button>
        </div>
    );
}
