import ListSelectionItem from "./ListSelectionItem";
import { ScrollArea } from "./ui/scroll-area";

interface ListSelectionProps {
  list: Array<any>;
  onSelect: (graph: any) => void;
  onDelete: (graph: any) => void;
  emptyMessage?: React.ReactNode;
}

export default function ListSelection({
  list,
  onSelect,
  onDelete,
  emptyMessage,
}: ListSelectionProps) {
  if (!list || !Array.isArray(list) || list.length === 0) {
    return emptyMessage;
  }

  return (
    <ScrollArea className="w-full h-fit max-h-[400px] rounded-md border overflow-y-auto p-2.5">
      {list.map((item) => (
        <ListSelectionItem
          key={item.id}
          active={item.active}
          title={item.name}
          onClick={() => {
            onSelect(item);
          }}
          onDelete={() => {
            onDelete(item);
          }}
        />
      ))}
    </ScrollArea>
  );
}
