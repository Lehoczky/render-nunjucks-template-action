// @ts-check
import { configLehoczkyTypescript } from "@lehoczky/eslint-config-typescript"
import { configLehoczkyVitest } from "@lehoczky/eslint-config-vitest"

/** @type {import("eslint").Linter.Config[]} */
export default [...configLehoczkyTypescript(), ...configLehoczkyVitest()]
