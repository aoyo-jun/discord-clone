"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Documentation on Tooltip: https://ui.shadcn.com/docs/components/tooltip

// Explanation on interface: https://www.typescriptlang.org/docs/handbook/interfaces.html
interface ActionTooltipProps {
    // The text
    label: string;
    // The text to display
    children: React.ReactNode;
    // Optional: Where the tooltip will appear
    side?: "top" | "right" | "bottom" | "left";
    // Optional: Where the tooltip will align
    align?: "start" | "center" | "end";
}

// Creates an ActionTooltip referencing ActionTooltipProps
export const ActionTooltip = ({
    label,
    children,
    side,
    align
}: ActionTooltipProps) => {
    return (
        <TooltipProvider>
            {/* Shows the tooltip with a delay */}
            <Tooltip delayDuration={50}>
                {/* Renders the tooltip */}
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    {/* The text */}
                    <p className="font-semibold text-sm capitalize">
                        {label.toLowerCase()}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}