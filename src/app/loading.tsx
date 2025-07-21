import Spinner from './components/Spinner';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size={6} />
    </div>
  );
} 