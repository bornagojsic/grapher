import ListSelectionItem from "./ListSelectionItem";
import { ScrollArea } from "./ui/scroll-area";

interface ListSelectionProps {
    list: Array<any>;
    onSelect: (graph: any) => void;
    onDelete: (graph: any) => void;
    children?: React.ReactNode;
}

export default function ListSelection({
    list,
    onSelect,
    onDelete,
    children,
}: ListSelectionProps) {
    return (
        <>
            {list.length > 0 ? (
                <ScrollArea className="w-full h-fit max-h-[200px] rounded-md border overflow-y-auto p-2.5">
                    {list.map((graph) => (
                        <ListSelectionItem
                            key={graph.id}
                            active={graph.active}
                            title={graph.name}
                            onClick={() => {
                                onSelect(graph);
                            }}
                            onDelete={() => {
                                onDelete(graph);
                            }}
                        />
                    ))}
                </ScrollArea>
            ) : (
                { children }
            )}
        </>
    );
}
