import { createFileRoute } from '@tanstack/react-router';
import { GenericCrudPage } from '../../../components/cms/GenericCrudPage';
import type { BlogPostEntity } from '../../../types';

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
        { header: 'Slug', accessorKey: 'slug' },
        { header: 'Title', accessorKey: 'title' },
        { header: 'Publish Date', accessorKey: 'date' },
        { header: 'Excerpt', accessorKey: 'excerpt' },
      ]}
      fields={[
        { name: 'slug', label: 'URL Slug', type: 'text', required: true, placeholder: 'e.g. starting-fresh' },
        { name: 'title', label: 'Post Title', type: 'text', required: true, placeholder: 'e.g. Starting fresh' },
        { name: 'date', label: 'Display Date', type: 'text', required: true, placeholder: 'e.g. March 2026' },
        { name: 'excerpt', label: 'Short Excerpt', type: 'textarea', required: true },
        { name: 'content', label: 'Post Article Content', type: 'textarea', required: true },
        { name: 'coverImage', label: 'Cover Image', type: 'image' },
      ]}
    />
  );
}
