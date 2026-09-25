import { createFileRoute } from '@tanstack/react-router';
import { GenericCrudPage } from '../../../components/cms/GenericCrudPage';
import type { BlogPostEntity } from '../../../types';
import { getImageUrl } from '../../../api/client';

export const Route = createFileRoute('/_authenticated/data/blog')({
  component: BlogPageCMS,
});

function BlogPageCMS() {
  return (
    <GenericCrudPage<BlogPostEntity>
      title="Blog Posts Data"
      description="Manage articles, publish dates, excerpts, and long-form content."
      resourceKey="blog"
      columns={[
        {
          header: 'Cover',
          cell: (item) =>
            item.coverImage ? (
              <img
                src={getImageUrl(item.coverImage)}
                alt={item.title}
                className="w-12 h-12 object-cover rounded-md border border-slate-200"
              />
            ) : (
              <span className="text-slate-400 italic">No cover</span>
            ),
        },
        { header: 'Slug', accessorKey: 'slug' },
        { header: 'Title', accessorKey: 'title' },
        { header: 'Publish Date', accessorKey: 'date' },
        { header: 'Excerpt', accessorKey: 'excerpt' },
      ]}
      fields={[
        { name: 'slug', label: 'URL Slug', type: 'text', required: true, placeholder: 'e.g. starting-fresh' },
        { name: 'title', label: 'Post Title', type: 'text', required: true, placeholder: 'e.g. Starting Fresh' },
        { name: 'date', label: 'Publish Date', type: 'text', required: true, placeholder: 'e.g. March 2026' },
        { name: 'excerpt', label: 'Short Description', type: 'textarea', required: true, placeholder: 'A short summary shown in the blog list.' },
        { name: 'content', label: 'Full / Detailed Content', type: 'textarea', required: true, placeholder: 'Write the complete article content here.' },
        { name: 'coverImage', label: 'Blog Cover Image', type: 'image' },
      ]}
    />
  );
}
