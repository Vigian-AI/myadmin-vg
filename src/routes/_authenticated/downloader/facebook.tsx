import { createFileRoute } from '@tanstack/react-router';
import { FacebookDownloader } from '../../../components/downloader/FacebookDownloader';

export const Route = createFileRoute('/_authenticated/downloader/facebook')({
  component: FacebookDownloader,
});
