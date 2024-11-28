import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const TranslatedHeader = ({ column, translationKey }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {translationKey}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default TranslatedHeader;
