import { font } from './tiny.js'
import { initFont } from './index.js'
import { ctx } from './canvas.js'

const writeText = initFont(font, ctx);

export { writeText }
