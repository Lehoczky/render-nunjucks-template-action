# Development documentation

To get started, install the project's dependencies:

```sh
pnpm install
```

Run unit tests with:

```sh
pnpm test
```

Before committing, make sure you don't have any lint errors and the projects builds successfully:

```sh
pnpm lint
pnpm build
```

To test the action as part of a workflow, you can run the `.github/workflows/example.yml` workflow locally with [act](https://github.com/nektos/act):

```sh
act workflow_dispatch -W '.github\workflows\example.yml'
```
