import CloseButton from "@/components/close-button";
import { PhotoIcon } from "@heroicons/react/24/solid";

const Loading = () => {
  return (
    <div className="absolute z-50 w-full h-full flex items-center justify-center left-0 top-0 bg-black bg-opacity-60">
      <CloseButton />
      <div className="max-w-[20rem] w-full flex flex-col justify-center items-center bg-neutral-700 *:animate-pulse">
        <div className="aspect-square rounded-md flex items-center justify-center text-neutral-200 w-full">
          <PhotoIcon className="h-28" />
        </div>
        <div className="flex flex-col p-5 gap-5 w-full">
          <div className="flex gap-2 items-center">
            <div className="size-8 rounded-full bg-neutral-500" />
            <div className="h-4 w-24 rounded-md bg-neutral-500" />
          </div>
          <div className="h-[3px] w-full rounded-md bg-neutral-500" />
          <div className="h-4 w-52 rounded-md bg-neutral-500" />
          <div className="flex flex-col gap-2">
            <div className="h-2 w-32 rounded-md bg-neutral-500" />
            <div className="h-2 w-40 rounded-md bg-neutral-500" />
          </div>
          <div className="flex justify-between mt-6 items-center">
            <div className="h-4 w-24 rounded-md bg-neutral-500" />
            <div className="h-6 w-16 rounded-md bg-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
