import { resolve } from "node:path"

import * as core from "@actions/core"
import dedent from "dedent"
import { beforeEach, describe, expect, it, vi } from "vitest"

import * as main from "../src/main"

// Mock the GitHub Actions core library
vi.spyOn(core, "debug").mockImplementation(() => {})
const getInputMock = vi.spyOn(core, "getInput")
const setFailedMock = vi.spyOn(core, "setFailed").mockImplementation(() => {})
const setOutputMock = vi.spyOn(core, "setOutput").mockImplementation(() => {})

describe("action", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders a template string", () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "template":
          return "Hello {{ username | capitalize }}"
        case "vars":
          return JSON.stringify({ username: "john" })
        default:
          return ""
      }
    })

    main.run()
    expect(setOutputMock).toHaveBeenCalledWith("result", "Hello John")
  })

  it("renders a template file", () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "template-path":
          return resolve(__dirname, "./mocks/simple.njk")
        case "vars":
          return JSON.stringify({ username: "john" })
        default:
          return ""
      }
    })

    main.run()
    expect(setOutputMock).toHaveBeenCalledWith("result", "Hello John\n")
  })

  it("renders the template file even when both `template` and `template-path` are defined", () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "template":
          return "I won't be rendered"
        case "template-path":
          return resolve(__dirname, "./mocks/simple.njk")
        case "vars":
          return JSON.stringify({ username: "john" })
        default:
          return ""
      }
    })

    main.run()
    expect(setOutputMock).toHaveBeenCalledWith("result", "Hello John\n")
  })

  it("escapes the output characters when that option is turned on", () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "template":
          return `{{ {"key": "value"} | dump }}`
        case "vars":
          return "{}"
        case "auto-escape":
          return "true"
        default:
          return ""
      }
    })

    main.run()
    expect(setOutputMock).toHaveBeenCalledWith(
      "result",
      "{&quot;key&quot;:&quot;value&quot;}",
    )
  })

  it("doesn't escape the output when that option is turned off", () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "template":
          return `{{ {"key": "value"} | dump }}`
        case "vars":
          return "{}"
        case "auto-escape":
          return "false"
        default:
          return ""
      }
    })

    main.run()
    expect(setOutputMock).toHaveBeenCalledWith("result", `{"key":"value"}`)
  })

  it("removes trailing newlines from a block/tag when that option is turned on", () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "template-path":
          return resolve(__dirname, "./mocks/blocks.njk")
        case "vars":
          return JSON.stringify({
            items: [
              { title: "foo", id: 1 },
              { title: "bar", id: 2 },
            ],
          })
        case "trim-blocks":
          return "true"
        default:
          return ""
      }
    })

    main.run()

    const expectedResult = dedent`
      <h1>Posts</h1>
      <ul>
        <li>foo</li>
        <li>bar</li>
      </ul>`

    expect(setOutputMock).toHaveBeenCalledWith("result", `${expectedResult}\n`)
  })

  it("doesn't remove trailing newlines from a block/tag when that option is turned off", () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "template-path":
          return resolve(__dirname, "./mocks/blocks.njk")
        case "vars":
          return JSON.stringify({
            items: [
              { title: "foo", id: 1 },
              { title: "bar", id: 2 },
            ],
          })
        case "trim-blocks":
          return "false"
        default:
          return ""
      }
    })

    main.run()

    const expectedResult = dedent`
      <h1>Posts</h1>
      <ul>

        <li>foo</li>

        <li>bar</li>

      </ul>`

    expect(setOutputMock).toHaveBeenCalledWith("result", `${expectedResult}\n`)
  })

  it("throws an error when no template or template path has been give", () => {
    getInputMock.mockImplementation((_name: string): string => {
      return ""
    })

    main.run()
    expect(setFailedMock).toHaveBeenCalledWith(
      "❌ No template specified, please provide `template` or `template-path`",
    )
  })

  it("throws an error when the template file does not exist", () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "template-path":
          return "not-exist.njk"
        case "vars":
          return JSON.stringify({ username: "john" })
        default:
          return ""
      }
    })

    main.run()
    expect(setFailedMock).toHaveBeenCalledWith(
      "❌ template not found: not-exist.njk",
    )
  })

  it("throws an error when the variables cannot be parsed as JSON", () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case "template":
          return "Hello"
        case "vars":
          return "{invalid: json"
        default:
          return ""
      }
    })

    main.run()
    expect(setFailedMock).toHaveBeenCalledWith(
      "❌ Could not parse the input variables as JSON: {invalid: json",
    )
  })
})
