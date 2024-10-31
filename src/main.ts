import { join } from "node:path"

import * as core from "@actions/core"
import { context } from "@actions/github"
import * as nunjucks from "nunjucks"

export function run(): void {
  try {
    const { template, templatePath } = getTemplateAndTemplatePath()

    const renderContext = getRenderContext()
    core.debug(`💬 Render context: ${JSON.stringify(renderContext)}`)

    const nunjucksConfiguration = getNunjucksConfiguration()
    const nunjucksEnv = nunjucks.configure(nunjucksConfiguration)

    let result: string

    if (templatePath) {
      const fullPath = join(process.env.GITHUB_WORKSPACE || "", templatePath)
      core.debug(`💬 Loading template file from: ${fullPath}`)
      result = nunjucksEnv.render(fullPath, renderContext)
    } else {
      result = nunjucksEnv.renderString(template, renderContext)
    }

    core.debug(`💬 Result: ${result}`)
    core.setOutput("result", result)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`❌ ${error.message}`)
    }
  }
}

function getTemplateAndTemplatePath() {
  const template = core.getInput("template")
  const templatePath = core.getInput("template-path")

  if (!template && !templatePath) {
    throw new Error(
      "No template specified, please provide `template` or `template-path`",
    )
  }

  return { template, templatePath }
}

function getRenderContext() {
  const variables = getTemplateVariables()
  const env = process.env
  return { context, env, ...variables }
}

function getNunjucksConfiguration() {
  const autoescape = getBooleanInput("auto-escape")
  core.debug(`💬 auto-escape: ${autoescape}`)

  const trimBlocks = getBooleanInput("trim-blocks")
  core.debug(`💬 trim-blocks: ${trimBlocks}`)

  const lstripBlocks = getBooleanInput("lstrip-blocks")
  core.debug(`💬 lstrip-blocks: ${lstripBlocks}`)

  return { autoescape, trimBlocks, lstripBlocks }
}

function getTemplateVariables() {
  const vars = core.getInput("vars")
  try {
    return JSON.parse(vars)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Could not parse the input variables as JSON: ${vars}`)
    }
    throw error
  }
}

function getBooleanInput(name: string) {
  return core.getInput(name).toLowerCase() === "true"
}
