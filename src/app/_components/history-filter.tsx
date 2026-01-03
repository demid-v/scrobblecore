import { useAtom } from "jotai";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type ScrobblesFilter, scrobblesFilterAtom } from "~/lib/store";

const HistoryFilter = () => {
  const [scrobblesFilter, setScrobblesFilter] = useAtom(scrobblesFilterAtom);

  return (
    <Select
      defaultValue={scrobblesFilter}
      onValueChange={(value: ScrobblesFilter) => {
        setScrobblesFilter(value);
      }}
    >
      <SelectTrigger className="bg-background h-6 w-fit" aria-label="Filter">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="successful">Successful</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default HistoryFilter;
