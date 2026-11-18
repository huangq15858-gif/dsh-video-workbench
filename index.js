import PresetVideoPlugin, { VIDEO_MAKER_SYSTEM_PROMPT } from './packages/dsh-preset-video/index.js'
import WebVideoWorkbenchPlugin, {
  handleWorkbenchApiRequest,
  listVideoProjects,
} from './packages/dsh-web-video-workbench/lib/index.js'

export const name = 'dsh-video-workbench'

export function apply(ctx) {
  try {
    ctx.plugin(PresetVideoPlugin)
  } catch {}
  try {
    ctx.plugin(WebVideoWorkbenchPlugin)
  } catch {}
}

export { VIDEO_MAKER_SYSTEM_PROMPT, handleWorkbenchApiRequest, listVideoProjects }
export default { name, apply }
