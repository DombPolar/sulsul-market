export default function Loading() {
  return (
    <>
      <h1 className="text-white text-4xl">Products</h1>
      <div className="p-5 animate-pulse flex flex-col gap-5">
        {[...Array(3)].map((_, idx) => (
          <div className="*:rounded-md flex gap-5 items-center" key={idx}>
            <div className="size-28 bg-neutral-700" />
            <div className="flex flex-col gap-2 *:bg-neutral-700 *:h-5 *:rounded-md">
              <div className="w-40" />
              <div className="w-20" />
              <div className="w-30" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
