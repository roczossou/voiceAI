import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage';
import { ProjetsPage } from './pages/Projets/ProjetsPage';
import { ProjetDetailPage } from './pages/Projets/ProjetDetailPage';
import { AProposPage } from './pages/APropos/AProposPage';
import { ServicesPage } from './pages/Services/ServicesPage';
import { ContactPage } from './pages/Contact/ContactPage';
import { BlogPage } from './pages/Blog/BlogPage';
import { BlogArticlePage } from './pages/Blog/BlogArticlePage';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/projets', element: <ProjetsPage /> },
  { path: '/projets/:slug', element: <ProjetDetailPage /> },
  { path: '/a-propos', element: <AProposPage /> },
  { path: '/services', element: <ServicesPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/blog/:slug', element: <BlogArticlePage /> },
  { path: '*', element: <NotFoundPage /> },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
