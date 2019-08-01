// @ts-ignore
import ejs from 'ejs/ejs.min'

export default function analyze(conf: any) {
  const { v, r, index, rule, expression = '' } = conf
  if (rule === 'template' && expression) {
    return ejs.render(expression, { v, r, index })
  }
  return v
}
