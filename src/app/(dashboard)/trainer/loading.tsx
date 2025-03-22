import { LoadingSpinner } from "~/components/ui/loading-spinner";

export default function TrainerLoading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
