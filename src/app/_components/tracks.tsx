"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Edit2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EditedAlbumTracks } from "~/app/artists/[artistName]/albums/[albumName]/page";
import ImageWithFallback from "~/components/image-with-fallback";
import NoArtistImage from "~/components/no-artist-image";
import ScrobbleButton from "~/components/scrobble-button";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { SearchTracks, type Tracks as TracksT } from "~/lib/queries/track";

const formSchema = z.object({
  artist: z.string().trim().min(1, {
    message: "Artist name is required.",
  }),
  name: z.string().trim().min(1, {
    message: "Track title is required.",
  }),
});

type formSchema = z.infer<typeof formSchema>;

type EditedTracks = SearchTracks | EditedAlbumTracks;

const Track = ({
  index,
  tracks,
  track,
  formHandler,
  isEnumerated,
}: {
  index: number;
  tracks: TracksT;
  track: TracksT[number];
  formHandler?: (trackId: number, artist: string, name: string) => void;
  isEnumerated?: boolean;
}) => {
  const defaultArtist = useRef(track.artist);
  const defaultName = useRef(track.name);

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artist: track.artist,
      name: track.name,
    },
  });

  useEffect(() => {
    form.setValue("artist", track.artist);
    form.setValue("name", track.name);
  }, [form, track]);

  const [isEditing, setIsEditing] = useState(false);

  const applyChangesFromForm = (data: formSchema) => {
    formHandler?.(index, data.artist, data.name);
    setIsEditing(false);
  };

  const resetAlbumInfo = () => {
    formHandler?.(index, defaultArtist.current, defaultName.current);

    form.setValue("artist", defaultArtist.current);
    form.setValue("name", defaultName.current);
  };

  return (
    <li>
      <div className="hover:bg-accent flex items-center gap-x-2 rounded-sm px-2 py-1">
        {isEnumerated && (
          <div
            className="w-7 shrink-0 overflow-hidden text-center text-xs text-ellipsis"
            title={`${index + 1}`}
          >
            {index + 1}
          </div>
        )}
        <div className="flex grow items-center gap-x-2 overflow-hidden">
          {track.type === "track" && (
            <ImageWithFallback
              src={track.image}
              alt="Artist's image"
              width={34}
              height={34}
              defaultImage={
                <NoArtistImage className="hidden h-full w-full shrink-0 p-10" />
              }
              className="hidden shrink-0"
            />
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(applyChangesFromForm)}
              className="flex w-full overflow-hidden"
            >
              <div className="flex w-full items-center gap-x-4 overflow-hidden">
                <div className="max-w-1/2">
                  <div className="overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap">
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="artist"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} className="h-8 bg-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <Link
                        href={`/artists/${encodeURIComponent(track.artist)}`}
                      >
                        {track.artist}
                      </Link>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} className="h-8 bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    title={track.name}
                  >
                    {track.name}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-x-0.5">
                {isEditing ? (
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="h-fit w-fit px-2 py-1 hover:bg-gray-200"
                    title="Apply changes"
                  >
                    <Check style={{ height: "14px", width: "14px" }} />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-fit w-fit px-1.5 py-1 hover:bg-gray-200"
                    title="Edit and scrobble"
                    onClick={(e) => {
                      setIsEditing(true);
                      e.preventDefault();
                    }}
                  >
                    <Edit2 style={{ height: "14px", width: "14px" }} />
                  </Button>
                )}
                <Button
                  type="reset"
                  variant="ghost"
                  size="sm"
                  className="h-fit w-fit px-1.5 py-1 hover:bg-gray-200"
                  title="Reset track info"
                  onClick={resetAlbumInfo}
                >
                  <Undo2 style={{ height: "14px", width: "14px" }} />
                </Button>
              </div>
            </form>
          </Form>
          <ScrobbleButton
            tracks={[track] as TracksT}
            size="sm"
            className="ml-auto"
          >
            Scrobble
          </ScrobbleButton>
        </div>
      </div>
      {index !== tracks.length - 1 && <Separator />}
    </li>
  );
};

const Tracks = ({
  tracks,
  artistName,
  callback,
  isEnumerated,
  children,
}: {
  tracks: EditedTracks;
  artistName?: string;
  callback?: (tracks: EditedAlbumTracks) => void;
  isEnumerated?: boolean;
  children?: React.ReactNode;
}) => {
  const [editedTracks, setEditedTracks] = useState<EditedTracks>(tracks);

  useEffect(() => {
    setEditedTracks(
      tracks.map((track, i) => ({
        ...track,
        ...(track.type === "album" && track.isInlineEdited
          ? { artist: editedTracks.at(i)!.artist }
          : {}),
      })) as EditedTracks,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks]);

  const applyInlineChanges = (
    trackId: number,
    artist: string,
    name: string,
  ) => {
    const editedTrackId = editedTracks.findIndex((_track, i) => i === trackId);
    const editedTrack = editedTracks[editedTrackId]!;

    const newEditedTrack = {
      ...editedTrack,
      artist,
      name,
      ...(editedTrack.type === "album"
        ? { isInlineEdited: artist !== artistName }
        : {}),
    };

    const newEditedTracks = editedTracks.with(
      editedTrackId,
      newEditedTrack as never,
    );

    setEditedTracks(newEditedTracks);

    callback?.(newEditedTracks as EditedAlbumTracks);
  };

  if (tracks.length === 0) {
    return (
      <div className="mb-6 text-center text-xl font-medium">No tracks.</div>
    );
  }

  return (
    <section>
      {children}
      <ul>
        {editedTracks.map((track, i) => (
          <Track
            key={i}
            index={i}
            tracks={editedTracks}
            track={track}
            formHandler={applyInlineChanges}
            isEnumerated={isEnumerated}
          />
        ))}
      </ul>
    </section>
  );
};

export default Tracks;
