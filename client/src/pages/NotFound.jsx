import EmptyState from '../components/EmptyState';

export default function NotFound() {
  return <EmptyState emoji="🧭" title="Page not found" text="The page you are looking for does not exist." actionLabel="Go home" actionTo="/" />;
}
