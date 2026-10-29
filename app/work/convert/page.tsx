import type { Metadata } from 'next';
import { Action } from '@/components/Action';
import { WorkProjectActions } from '@/components/WorkProjectActions';
export const metadata: Metadata = { title: 'Convert — Independent product design', description: 'A focused browser-based file conversion workflow, designed and built by Alex Woo.' };
export default function ConvertStory() {
  return <article className="mx-auto max-w-content px-page py-12">
    <p className="mt-9 text-body text-fg-secondary">Independent product · Design and build</p>
    <h1 className="mt-4 text-h1 text-fg">From file to format, with fewer steps.</h1>
    <p className="mt-8 text-body-lg text-fg-secondary">Convert brings file conversion into a single browser workflow: drop files, choose a format, and download the result.</p>
    <h2 className="mt-12 text-h3">The job</h2>
    <p className="mt-6 text-body">Get a file into the format needed for the next task. Convert supports images, video, audio, documents, spreadsheets, and archives through one entry point.</p>
    <h2 className="mt-12 text-h3">The product approach</h2>
    <p className="mt-6 text-body">The interface centers on the conversion sequence. Batch conversion, scaling, quality controls, background removal, and renaming extend that workflow. Browser-side processing keeps file handling on the device.</p>
    <h2 className="mt-12 text-h3">My contribution</h2>
    <p className="mt-6 text-body">I designed and built Convert with Claude Code. It is an independent product visitors can use, alongside my work on creative tools at larger organizations.</p>
    <h2 className="mt-12 text-h3">See the product</h2>
    <p className="mt-6 text-body">The working application and demonstration show the interaction directly. No adoption or time-savings figures are claimed here.</p>
    <div className="mt-8 flex flex-wrap gap-4"><Action href="https://convert.ajwoo.com/" external variant="primary">Try Convert</Action><Action href="/apps/convert/">Watch the demo</Action></div>
    <WorkProjectActions />
  </article>;
}
