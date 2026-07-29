import { ErrorBoundary } from "react-error-boundary";
import NotFound from "../pages/NotFound";

function ErrorFallback() {
  return <NotFound />;
}

export default function AppBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}