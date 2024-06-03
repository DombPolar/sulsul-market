import { PhotoIcon } from "@heroicons/react/24/solid";

const LoadingPage = () => {
  return (
    <div className="animate-pulse p-5 flex flex-col gap-5">
      <div className="aspect-square border-neutral-700 border-4 rounded-md border-dashed flex items-center justify-center text-neutral-700">
        <PhotoIcon className="h-28" />
      </div>
      <div className="flex gap-2 items-center">
        <div className="size-14 rounded-full bg-neutral-700" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-neutral-700 rounded-md" />
          <div className="h-4 w-24 bg-neutral-700 rounded-md" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-full bg-neutral-700 rounded-md" />
        <div className="h-5 w-4/5 bg-neutral-700 rounded-md" />
      </div>
    </div>
  );
};

export default LoadingPage;
