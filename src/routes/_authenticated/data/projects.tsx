import { createFileRoute } from '@tanstack/react-router';
import { GenericCrudPage } from '../../../components/cms/GenericCrudPage';
import type { ProjectEntity } from '../../../types';
import { getImageUrl } from '../../../api/client';

export const Route = createFileRoute('/_authenticated/data/projects')({
  component: ProjectsPageCMS,
});

function ProjectsPageCMS() {
  return (
    <GenericCrudPage<ProjectEntity>
      title="Projects Data"
      description="Manage portfolio projects, tech stack tags, GitHub repositories, and images."
      resourceKey="projects"
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
        { header: 'Slug', accessorKey: 'slug' },
        { header: 'Title', accessorKey: 'title' },
        { header: 'Description', accessorKey: 'description' },
        { header: 'Tags', accessorKey: 'tags' },
      ]}
      fields={[
        { name: 'slug', label: 'URL Slug', type: 'text', required: true, placeholder: 'e.g. musaku' },
        { name: 'title', label: 'Project Title', type: 'text', required: true, placeholder: 'e.g. musaku' },
        { name: 'description', label: 'Short Description', type: 'text', required: true, placeholder: 'e.g. management uang saku' },
        { name: 'longDescription', label: 'Full / Detailed Description', type: 'textarea', required: true },
        { name: 'tags', label: 'Tags (Comma separated)', type: 'text', required: true, placeholder: 'e.g. JAVA, POSTGRESQL, SPRING' },
        { name: 'github', label: 'GitHub Repository URL', type: 'text', required: true, placeholder: 'https://github.com/vg/project' },
        { name: 'image', label: 'Project Image', type: 'image' },
      ]}
    />
  );
}
