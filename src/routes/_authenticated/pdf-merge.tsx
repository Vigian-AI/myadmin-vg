import { createFileRoute } from '@tanstack/react-router';
import { MergePdfPage } from '../../components/pdf/MergePdfPage';

export const Route = createFileRoute('/_authenticated/pdf-merge')({
  component: MergePdfPage,
});
