const Loading = () => {
  return (
    <div className="p-5 bg-neutral-900 animate-pulse flex flex-col gap-5 text-white">
      {[...Array(17)].map((_, idx) => (
        <div className="rounded-md flex gap-5 items-center" key={idx}>
          <div className="flex flex-col gap-2 rounded-md">
            <div className="bg-neutral-700 h-5 w-20" />
            <div className="bg-neutral-700 h-5 w-40" />
            <div className="flex gap-2 rounded-md">
              <div className="bg-neutral-700 h-5 w-5" />
              <div className="bg-neutral-700 h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;
