export default function ThreeLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-ping h-2 w-2 bg-red-500 rounded-full"></div>
      <div className="animate-ping h-2 w-2 bg-red-500 rounded-full mx-4"></div>
      <div className="animate-ping h-2 w-2 bg-red-500 rounded-full"></div>
    </div>
  );
}
