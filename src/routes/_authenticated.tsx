import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Layout } from '../components/layout/Layout';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
