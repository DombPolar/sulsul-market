const Loading = () => {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(3)].map((_, idx) => (
        <div className="*:rounded-md flex gap-5 items-center" key={idx}>
          <div className="flex gap-2 *:rounded-md">
            <div className="bg-neutral-700 size-20" />
            <div className="flex flex-col justify-center gap-2 *:rounded-md">
              <div className="bg-neutral-700 h-5 w-20" />
              <div className="bg-neutral-700 h-5 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;
