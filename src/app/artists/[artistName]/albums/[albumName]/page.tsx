"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDownIcon, Edit2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import DefaultSearchPage from "~/app/_components/default-search-page";
import ListSkeleton from "~/app/_components/list-skeleton";
import Tracks from "~/app/_components/tracks";
import { ViewedAlbum } from "~/app/_components/viewed-album";
import ImageWithFallback from "~/components/image-with-fallback";
import NoCover from "~/components/no-cover";
import ScrobbleButton from "~/components/scrobble-button";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { Album, AlbumTracks, getAlbum } from "~/lib/queries/album";

const formSchema = z.object({
  artist: z.string().trim().min(1, {
    message: "Artist name is required.",
  }),
  album: z.string().trim().min(1, {
    message: "Album title is required.",
  }),
  date: z.number().optional(),
  time: z.string().optional(),
});

type formSchema = z.infer<typeof formSchema>;

type EditedAlbumTracks = (AlbumTracks[number] & {
  isInlineEdited?: boolean;
  isAlbumTrack?: boolean;
})[];

const AlbumPage = () => {
  const { artistName: artistNameParam, albumName: albumNameParam } = useParams<{
    artistName: string;
    albumName: string;
  }>();

  const artistName = decodeURIComponent(artistNameParam);
  const albumName = decodeURIComponent(albumNameParam);

  const queryParams = { artistName, albumName };

  const {
    data: album,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["albums", queryParams],
    queryFn: () => getAlbum(queryParams),
  });

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artist: artistName,
      album: albumName,
      date: 0,
      time: "",
    },
  });

  const watchedArtist = useWatch({ control: form.control, name: "artist" });
  const watchedAlbum = useWatch({ control: form.control, name: "album" });
  const watchedDate = useWatch({ control: form.control, name: "date" });
  const watchedTime = useWatch({ control: form.control, name: "time" });

  const [editedTracks, setEditedTracks] = useState<EditedAlbumTracks>([]);

  const setDefaultEditedTracks = (album: Album) =>
    setEditedTracks(
      album?.tracks.map((track) => ({
        ...track,
        ...(track.artist === artistName ? { isAlbumTrack: true } : {}),
      })) ?? [],
    );

  const setDefaultEditedTracksEvent = useEffectEvent((album: Album) => {
    setDefaultEditedTracks(album);
  });

  useEffect(() => {
    if (!album) return;
    setDefaultEditedTracksEvent(album);
  }, [album]);

  const [open, setOpen] = useState(false);

  if (isError) return <DefaultSearchPage title="Album not found" />;
  if (isLoading || !album) return <AlbumSkeleton />;

  const setChange = (tracks: EditedAlbumTracks) => {
    setEditedTracks(tracks);
  };

  const applyChanges = (
    artist: string,
    albumTitle: string,
    isReset?: boolean,
  ) => {
    const getArtist = (track: EditedAlbumTracks[number]) => {
      if (track.isInlineEdited) return { artist: track.artist };
      return track.isAlbumTrack ? { artist } : {};
    };

    if (isReset) {
      setDefaultEditedTracks(album);
    } else {
      setEditedTracks(
        editedTracks.map((track) => ({
          ...track,
          ...getArtist(track),
          album: albumTitle,
        })),
      );
    }

    setIsEditing(false);
  };

  const applyChangesFromForm = (data: formSchema) => {
    if (!editedTracks) return;

    applyChanges(data.artist, data.album);
  };

  const resetAlbumInfo = (isReset?: boolean) => {
    if (!album) return;

    applyChanges(album.artist, album.name, isReset);

    form.setValue("artist", album.artist);
    form.setValue("album", album.name);
    form.setValue("date", 0);
    form.setValue("time", "");
  };

  const timestamp = (() => {
    if (!watchedDate || !watchedTime) return;

    const date = new Date(watchedDate);
    const timeArray = watchedTime.split(":").map(Number);

    date.setHours(timeArray[0] ?? 0);
    date.setMinutes(timeArray[1] ?? 0);
    date.setSeconds(timeArray[2] ?? 0);

    return date.getTime();
  })();

  return (
    <div className="w-full">
      <div className="mx-auto mb-10 flex max-w-170 gap-x-6">
        <ImageWithFallback
          src={album.image}
          alt="Album's image"
          width={300}
          height={300}
          defaultImage={<NoCover className="mx-auto h-75 w-75 p-10" />}
          fetchPriority="high"
          preload
        />
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex gap-x-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(applyChangesFromForm)}
                className="flex w-full flex-col gap-y-1"
              >
                <div className="flex w-full gap-x-2">
                  <div className="w-full">
                    {isEditing ? (
                      <div className="w-full space-y-1">
                        <FormField
                          control={form.control}
                          name="artist"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} className="font-bold" />
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
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="mb-1 font-bold">
                          <Link
                            href={`/artists/${watchedArtist}`}
                            className="line-clamp-2 text-ellipsis"
                          >
                            {watchedArtist}
                          </Link>
                        </div>
                        <div className="text-lg">
                          <div
                            className="line-clamp-2 text-ellipsis"
                            title={watchedAlbum}
                          >
                            {watchedAlbum}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <div className="mb-1">
                      {isEditing ? (
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          title="Finish editing"
                        >
                          <Check style={{ height: "14px", width: "14px" }} />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          title="Edit album info"
                          onClick={(e) => {
                            setIsEditing(true);
                            e.preventDefault();
                          }}
                        >
                          <Edit2 style={{ height: "14px", width: "14px" }} />
                        </Button>
                      )}
                    </div>
                    <Button
                      type="reset"
                      variant="ghost"
                      size="sm"
                      title="Reset album info"
                      onClick={() => resetAlbumInfo()}
                    >
                      <Undo2 style={{ height: "14px", width: "14px" }} />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-x-2">
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
                                onSelect={(date) =>
                                  field.onChange(date?.getTime())
                                }
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
                            className="bg-background w-fit appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
          <div className="flex justify-between">
            <ScrobbleButton tracks={editedTracks} timestamp={timestamp}>
              Scrobble album
            </ScrobbleButton>
            <Button
              variant="ghost"
              size="sm"
              title="Reset album"
              onClick={() => resetAlbumInfo(true)}
            >
              <Undo2 style={{ height: "14px", width: "14px" }} />
            </Button>
          </div>
        </div>
      </div>
      <Tracks
        tracks={editedTracks}
        artistName={artistName}
        changeHandler={setChange}
        isEnumerated
      />
      <ViewedAlbum album={album} />
    </div>
  );
};

const AlbumSkeleton = () => (
  <div>
    <div className="mx-auto mb-10 flex max-w-170 gap-x-6">
      <Skeleton className="h-75 w-75 rounded-none" />
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex">
          <div className="w-full">
            <Skeleton className="mb-3 h-5 max-w-36" />
            <Skeleton className="h-6 max-w-56" />
          </div>
          <div className="flex flex-col">
            <Button variant="ghost" className="flex h-5 w-6 p-0" disabled>
              <Edit2 style={{ height: "12px", width: "12px" }} />
            </Button>
            <Button variant="ghost" className="flex h-5 w-6 p-0" disabled>
              <Undo2 style={{ height: "12px", width: "12px" }} />
            </Button>
          </div>
        </div>
        <div>
          <Button disabled>Scrobble album</Button>
        </div>
      </div>
    </div>
    <ListSkeleton count={11} isEnumerated />
  </div>
);

export default AlbumPage;
export type { EditedAlbumTracks };
