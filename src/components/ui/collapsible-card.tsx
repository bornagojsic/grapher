import { ChevronDown, ChevronUp } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./collapsible";
import React from "react";

type CollapsibleCardProps = {
    title: string;
    children: React.ReactNode;
};

export default function CollapsibleCard({
    title,
    children,
}: CollapsibleCardProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex flex-col"
        >
            <CollapsibleTrigger className="collapsible-trigger">
                <div className="flex items-center justify-between gap-4 px-4 py-2">
                    <h4 className="text-sm font-semibold">{title}</h4>

                    <span className="size-8 flex items-center justify-center">
                        {isOpen ? <ChevronUp /> : <ChevronDown />}
                        <span className="sr-only">Toggle</span>
                    </span>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="collapsible-content">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}
