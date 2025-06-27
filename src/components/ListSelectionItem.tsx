import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface ListSelectionItemProps {
    title: string;
    active?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
    className?: string;
}

export default function ListSelectionItem({
    title,
    active,
    onClick,
    onDelete,
    className = "",
}: ListSelectionItemProps) {
    return (
        <div
            className={`selection-item w-90% flex flex-row items-center justify-between w-full px-4 py-2 hover:bg-accent rounded-md ${
                active ? "bg-accent active" : ""
            } ${className}`}
            onClick={(event) => {
                if (event.target instanceof HTMLButtonElement) {
                    onDelete?.();
                } else {
                    onClick?.();
                }
            }}
        >
            <span className="user-select-none">{title}</span>
            <Button variant="outline">
                <Trash2 />
            </Button>
        </div>
    );
}
