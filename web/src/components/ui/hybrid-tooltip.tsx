// Source - https://stackoverflow.com/a/79637950
// Posted by Jasperan
// Retrieved 2025-12-26, License - CC BY-SA 4.0

"use client";

import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "./tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

const TouchContext = createContext<boolean | undefined>(undefined);
const useTouch = () => useContext(TouchContext);

const TouchProvider = (props: PropsWithChildren) => {
    const [isTouch, setTouch] = useState<boolean>();

    useEffect(() => {
        setTouch(window.matchMedia("(pointer: coarse)").matches);
    }, []);

    return <TouchContext.Provider value={isTouch} {...props} />;
};

const HybridTooltipProvider = (props: TooltipPrimitive.Provider.Props) => {
    return <TooltipProvider delay={0} {...props} />;
};

const HybridTooltip = (
    props: TooltipPrimitive.Root.Props & PopoverPrimitive.Root.Props,
) => {
    const isTouch = useTouch();

    return isTouch ? <Popover {...props} /> : <Tooltip {...props} />;
};

const HybridTooltipTrigger = (
    props: TooltipPrimitive.Trigger.Props & PopoverPrimitive.Trigger.Props,
) => {
    const isTouch = useTouch();

    return isTouch ? (
        <PopoverTrigger {...props} />
    ) : (
        <TooltipTrigger {...props} />
    );
};

const HybridTooltipContent = (
    props: TooltipPrimitive.Popup.Props & PopoverPrimitive.Popup.Props,
) => {
    const isTouch = useTouch();

    return isTouch ? (
        <PopoverContent {...props} />
    ) : (
        <TooltipContent {...props} />
    );
};

export {
    TouchProvider,
    HybridTooltipProvider,
    HybridTooltip,
    HybridTooltipTrigger,
    HybridTooltipContent,
};
