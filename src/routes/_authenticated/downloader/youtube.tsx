import { createFileRoute } from '@tanstack/react-router';
import { YoutubeDownloader } from '../../../components/downloader/YoutubeDownloader';

export const Route = createFileRoute('/_authenticated/downloader/youtube')({
  component: YoutubeDownloader,
});
