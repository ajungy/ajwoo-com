import type { Metadata } from 'next';
import { Action } from '@/components/Action';
import { WorkProjectActions } from '@/components/WorkProjectActions';
export const metadata: Metadata = { title: 'Convert — Independent product design', description: 'A focused browser-based file conversion workflow, designed and built by Alex Woo.' };
export default function ConvertStory() {
  return <article className="detail-entrance work-reading-column py-12">
    <h1 className="type-project-title">Convert</h1>
    <p className="mt-4 type-caption">Independent product · Design and build</p>
    <p className="mt-4 type-section-heading">Drop files into your browser, choose a format, and download the result.</p>
    <h2 className="mt-12 type-section-heading">The job</h2>
    <p className="mt-4 type-body">Get a file into the format needed for the next task. Convert supports images, video, audio, documents, spreadsheets, and archives through one entry point.</p>
    <h2 className="mt-12 type-section-heading">The product approach</h2>
    <p className="mt-4 type-body">The interface centers on the conversion sequence. Batch conversion, scaling, quality controls, background removal, and renaming extend that workflow. Browser-side processing keeps file handling on the device.</p>
    <h2 className="mt-12 type-section-heading">My contribution</h2>
    <p className="mt-4 type-body">I designed and built Convert with Claude Code. It is an independent product visitors can use, alongside my work on creative tools at larger organizations.</p>
    <h2 className="mt-12 type-section-heading">See the product</h2>
    <p className="mt-4 type-body">The working application and demonstration show the interaction directly. No adoption or time-savings figures are claimed here.</p>
    <div className="mt-8 flex flex-wrap gap-4"><Action href="https://convert.ajwoo.com/" external variant="primary">Try Convert</Action><Action href="/apps/convert/">Watch the demo</Action></div>
    <WorkProjectActions />
  </article>;
}
