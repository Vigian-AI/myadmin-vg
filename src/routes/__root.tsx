import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { isAuthenticated } from '../utils/auth';
import appCss from '../styles.css?url';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'MY ADMIN' },
      { name: 'description', content: 'Personal website content management panel' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  // Guard: redirect unauthenticated users to /login (except the login page itself)
  beforeLoad: ({ location }) => {
    if (location.pathname !== '/login' && !isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <Toaster position="top-right" />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
