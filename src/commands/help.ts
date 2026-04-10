import { defineCommand } from '../command';
import type { Config } from '../config/schema';
import type { GlobalFlags } from '../types/flags';

interface ApiRef {
  command: string;
  title: string;
  url: string;
}

const API_REFS: ApiRef[] = [
  { command: 'mmx text chat',            title: 'Text Generation (Chat Completion)',    url: 'https://platform.minimax.io/docs/api-reference/text-post' },
  { command: 'mmx speech synthesize',    title: 'Speech T2A (Text-to-Audio)',           url: 'https://platform.minimax.io/docs/api-reference/speech-t2a-http' },
  { command: 'mmx image generate',       title: 'Image Generation (T2I / I2I)',         url: 'https://platform.minimax.io/docs/api-reference/image-generation-t2i' },
  { command: 'mmx video generate',       title: 'Video Generation (T2V / I2V / S2V)',   url: 'https://platform.minimax.io/docs/api-reference/video-generation' },
  { command: 'mmx music generate',       title: 'Music Generation',                     url: 'https://platform.minimax.io/docs/api-reference/music-generation' },
  { command: 'mmx music cover',          title: 'Music Cover (via Music Generation)',   url: 'https://platform.minimax.io/docs/api-reference/music-generation' },
  { command: 'mmx search query',         title: 'Web Search',                           url: 'https://platform.minimax.io/docs/api-reference/web-search' },
  { command: 'mmx vision describe',      title: 'Vision (Image Understanding)',         url: 'https://platform.minimax.io/docs/api-reference/vision' },
];

export default defineCommand({
  name: 'help',
  description: 'Show MiniMax API documentation links',
  usage: 'mmx help',
  apiDocs: 'https://platform.minimax.io/docs/api-reference',
  async run(_config: Config, _flags: GlobalFlags) {
    process.stdout.write(`
MiniMax API Documentation Links

  Official docs: https://platform.minimax.io/docs/api-reference

`);
    for (const ref of API_REFS) {
      process.stdout.write(`  ${ref.command.padEnd(30)} ${ref.title}\n`);
      process.stdout.write(`  ${' '.repeat(30)} ${ref.url}\n\n`);
    }
  },
});
