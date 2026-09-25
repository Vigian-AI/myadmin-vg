import { createFileRoute } from '@tanstack/react-router';
import { GenericCrudPage } from '../../../components/cms/GenericCrudPage';
import type { HomeEntity } from '../../../types';
import { getImageUrl } from '../../../api/client';

export const Route = createFileRoute('/_authenticated/data/home')({
  component: HomePage,
});

function HomePage() {
  return (
    <GenericCrudPage<HomeEntity>
      title="Home Section Data"
      description="Manage the primary home section title, subtitle, call to action, and background image."
      resourceKey="hero"
      columns={[
        {
          header: 'Image',
          cell: (item) =>
            item.image ? (
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                className="w-12 h-12 object-cover rounded-md border border-slate-200"
              />
            ) : (
              <span className="text-slate-400 italic">No image</span>
            ),
        },
        { header: 'Title', accessorKey: 'title' },
        { header: 'Subtitle', accessorKey: 'subtitle' },
        { header: 'Button Text', accessorKey: 'buttonText' },
      ]}
      fields={[
        { name: 'title', label: 'Main Title', type: 'text', required: true, placeholder: "e.g. Hello, I'm VG." },
        { name: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'e.g. Designer · Developer · Writer' },
        { name: 'description', label: 'Description Content', type: 'textarea', placeholder: 'Enter home paragraph...' },
        { name: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'e.g. View Projects' },
        { name: 'buttonUrl', label: 'Button Target URL', type: 'text', placeholder: 'e.g. /projects' },
        { name: 'image', label: 'Home Image / Banner', type: 'image' },
      ]}
    />
  );
}
