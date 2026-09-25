import { createFileRoute } from '@tanstack/react-router';
import { GenericCrudPage } from '../../../components/cms/GenericCrudPage';
import type { ContactLinkEntity } from '../../../types';

export const Route = createFileRoute('/_authenticated/data/contact')({
  component: ContactPage,
});

function ContactPage() {
  return (
    <GenericCrudPage<ContactLinkEntity>
      title="Contact Links"
      description="Manage the footer contact links (Instagram, GitHub, LinkedIn, Email)."
      resourceKey="contact"
      columns={[
        { header: 'Label', accessorKey: 'label' },
        { header: 'URL', accessorKey: 'href' },
        { header: 'Icon', accessorKey: 'icon' },
      ]}
      fields={[
        { name: 'label', label: 'Label', type: 'text', required: true, placeholder: 'e.g. Instagram' },
        { name: 'href', label: 'Link URL', type: 'text', required: true, placeholder: 'e.g. https://instagram.com/vg' },
        { name: 'icon', label: 'Icon Key', type: 'text', placeholder: 'e.g. instagram' },
      ]}
    />
  );
}
