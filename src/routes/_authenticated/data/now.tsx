import { createFileRoute } from '@tanstack/react-router';
import { GenericCrudPage } from '../../../components/cms/GenericCrudPage';
import type { NowEntity } from '../../../types';

export const Route = createFileRoute('/_authenticated/data/now')({
  component: NowSectionCMS,
});

function NowSectionCMS() {
  return (
    <GenericCrudPage<NowEntity>
      title="Now Section Data"
      description="Manage your current focus and priorities on the /now page."
      resourceKey="now"
      columns={[
        { header: 'Title', accessorKey: 'title' },
        { header: 'Date', accessorKey: 'date' },
        { header: 'Content', accessorKey: 'content' },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Now' },
        { name: 'date', label: 'Display Date', type: 'text', required: true, placeholder: 'March 2026' },
        { name: 'content', label: 'Now Focus Description', type: 'textarea', required: true },
      ]}
    />
  );
}
