"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type Simplify } from "type-fest";
import { z } from "zod";

import { useScrobble } from "~/components/scrobble-button";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Track title is required.",
  }),
  artist: z.string().trim().min(1, {
    message: "Artist name is required.",
  }),
  album: z.string().trim().optional(),
  date: z.number().optional(),
  time: z.string().optional(),
});

type formSchema = z.infer<typeof formSchema>;

type Track = Simplify<
  Omit<formSchema, "date" | "time"> & { type: "form"; timestamp?: number }
>;

const TrackForm = () => {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name") ?? "";
  const artistParam = searchParams.get("artist") ?? "";
  const albumParam = searchParams.get("album") ?? "";
  const timeParam = Number(searchParams.get("time"));

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      artist: "",
      album: "",
      date: 0,
      time: "",
    },
  });

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (nameParam) form.setValue("name", nameParam);
    if (artistParam) form.setValue("artist", artistParam);
    if (albumParam) form.setValue("album", albumParam);

    if (timeParam) {
      const timeStamp = timeParam * 1000;

      if (Number.isNaN(timeStamp) || timeStamp === 0) {
        form.setValue("date", 0);
        form.setValue("time", "");
      } else {
        const date = new Date(timeStamp);
        const time = `
        ${date.getHours().toString().padStart(2, "0")}:
        ${date.getMinutes().toString().padStart(2, "0")}:
        ${date.getSeconds().toString().padStart(2, "0")}
        `;

        form.setValue("date", timeStamp);
        form.setValue("time", time);
      }
    }

    router.replace(pathname);
  }, [albumParam, artistParam, form, nameParam, pathname, router, timeParam]);

  const [open, setOpen] = useState(false);

  const startScrobble = useScrobble();

  const onSubmit = (data: formSchema) => {
    const timestamp = (() => {
      const dateStr = data.date;
      const time = data.time;

      if (!dateStr || !time) return null;

      const date = new Date(dateStr);
      const timeArray = time.split(":").map(Number);

      date.setHours(timeArray[0] ?? 0);
      date.setMinutes(timeArray[1] ?? 0);
      date.setSeconds(timeArray[2] ?? 0);

      return date.getTime() / 1000;
    })();

    const track = {
      type: "form" as const,
      name: data.name,
      artist: data.artist,
      album: data.album,
      ...(timestamp && { timestamp }),
    };

    void startScrobble([track]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artist *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="album"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Album</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap gap-x-3 gap-y-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-32 justify-between font-normal"
                      >
                        {field.value
                          ? new Date(field.value).toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={new Date(field.value ?? 0)}
                        captionLayout="dropdown"
                        onSelect={(date) => field.onChange(date?.getTime())}
                        {...field}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="time"
                    step="1"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="reset"
            variant="secondary"
            onClick={() => {
              form.setValue("date", 0);
              form.setValue("time", "");
            }}
          >
            Clear date
          </Button>
        </div>
        <Button
          type="reset"
          variant="secondary"
          className="mr-3"
          onClick={() => form.reset()}
        >
          Clear form
        </Button>
        <Button type="submit">Scrobble</Button>
      </form>
    </Form>
  );
};

const TrackPage = () => (
  <div className="mx-auto w-2/3">
    <h1 className="mt-5 mb-8 text-center text-4xl font-semibold">
      Scrobble track
    </h1>
    <TrackForm />
  </div>
);

export default TrackPage;
export { type Track };
