# Render nunjucks template

![CI status](https://github.com/lehoczky/render-nunjucks-template-action/workflows/CI/badge.svg)
![check dist status](https://github.com/lehoczky/render-nunjucks-template-action/workflows/Check%20dist%2F/badge.svg)
![formatted with prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

A GitHub action to render [nunjucks](https://mozilla.github.io/nunjucks/) templates.

## Usage

### Inline template

```yml
name: Example

on:
  workflow_dispatch:

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Check out Git repository ⏬
        uses: actions/checkout@v4

      - name: Render template string 🎬
        id: render-template-string
        uses: Lehoczky/render-nunjucks-template-action@v1.0.0
        with:
          template: "Hello {{ username | capitalize }}"
          vars: |
            { 
              "username": "john" 
            }

      - name: Print output 📽
        run: echo "${{ steps.render-template-string.outputs.result }}"
```

### Template from file

```yml
name: Example

on:
  workflow_dispatch:

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Check out Git repository ⏬
        uses: actions/checkout@v4

      - name: Render template string 🎬
        id: render-template-string
        uses: Lehoczky/render-nunjucks-template-action@v1.0.0
        with:
          template-path: .github/templates/example.njk
          vars: |
            { 
              "username": "john" 
            }

      - name: Print output 📽
        run: echo "${{ steps.render-template-string.outputs.result }}"
```

### Using injected context

The [GitHub action context](https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts) and [env variables](https://docs.github.com/en/actions/learn-github-actions/variables#defining-environment-variables-for-a-single-workflow) are automatically injected into the templates for convenience:

```yml
- name: Render template string 🎬
  id: render-template-string
  uses: Lehoczky/render-nunjucks-template-action@v1.0.0
  with:
    template: |
      GitHub context:
      {{ context | dump(2) }}

      Env:
      {{ env | dump(2) }}
```

## Inputs

| name          | description                                                            | default |
| ------------- | ---------------------------------------------------------------------- | ------- |
| template      | Nunjucks template string                                               | ""      |
| template-path | Path to nunjucks template file                                         | ""      |
| vars          | Variables to use in template in JSON format                            | {}      |
| auto-escape   | Controls if output with dangerous characters are escaped automatically | true    |
| trim-blocks   | Automatically remove trailing newlines from a block/tag                | false   |
| lstrip-blocks | Automatically remove leading whitespace from a block/tag               | false   |

Either `template` or `template-path` is required. If both of them are defined, `template-path` takes precedence.

To learn more about `auto-escape`, `trim-blocks` and `lstrip-block`, see the official Nunjucks documentation:
<https://mozilla.github.io/nunjucks/api.html#configure>

## Outputs

| name   | description           |
| ------ | --------------------- |
| result | Rendered file content |

## Development docs

See [development.md](docs/development.md)
