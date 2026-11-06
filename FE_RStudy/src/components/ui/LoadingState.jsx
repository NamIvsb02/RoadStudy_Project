import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div role="status" className="flex items-center justify-center py-10 text-primary">
      <Loader2 size={24} className="animate-spin" />
    </div>
  );
}