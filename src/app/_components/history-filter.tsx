import { useAtom } from "jotai";
import { useEffect, useState } from "react";

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

  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    setIsAvailable(true);
  }, [scrobblesFilter]);

  if (!isAvailable) return null;

  return (
    <Select
      defaultValue={scrobblesFilter}
      onValueChange={(value: ScrobblesFilter) => {
        setScrobblesFilter(value);
      }}
    >
      <SelectTrigger className="w-fit bg-background">
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
