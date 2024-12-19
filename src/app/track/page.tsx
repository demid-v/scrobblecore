"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useScrobble } from "~/components/scrobble-button";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type TrackToScrobble } from "~/server/api/routers/track";

const formSchema = z.object({
  track: z.string().trim().min(1, {
    message: "Track's title is required.",
  }),
  artist: z.string().trim().min(1, {
    message: "Artist's name is required.",
  }),
  album: z.string().trim().optional(),
});

type formSchema = z.infer<typeof formSchema>;

const TrackForm = () => {
  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      track: "",
      artist: "",
      album: "",
    },
  });

  const startScrobble = useScrobble();

  const onSubmit = (data: formSchema) => {
    const track: TrackToScrobble = {
      name: data.track,
      artist: data.artist,
      album: data.album,
    };

    startScrobble([track]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="track"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Track&apos;s title</FormLabel>
              <FormControl>
                <Input placeholder="Track's title" {...field} />
              </FormControl>
              <FormDescription>Track&apos;s title.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artist&apos;s name</FormLabel>
              <FormControl>
                <Input placeholder="Artist's name" {...field} />
              </FormControl>
              <FormDescription>Artist&apos;s name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="album"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Album&apos;s title</FormLabel>
              <FormControl>
                <Input placeholder="Album's title" {...field} />
              </FormControl>
              <FormDescription>Album&apos;s title.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Scrobble</Button>
      </form>
    </Form>
  );
};

const TrackPage = () => (
  <div className="mx-auto w-2/3">
    <h1 className="mb-8 text-4xl font-bold">Scrobble tracks</h1>
    <TrackForm />
  </div>
);

export default TrackPage;
