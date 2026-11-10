import Spinner from './components/Spinner';

export default function RootLoading() {
  return (
    <div className="ct-route-loading flex items-center justify-center">
      <Spinner size={3} />
    </div>
  );
} 