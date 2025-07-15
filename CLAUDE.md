# CLAUDE.md

When you are generating code prefer to be concise and to the point.
Make comments only if needed.

This is a design project for a new unit library in typescript.
Please be concise and to the point.

./ucum-spec is official spec of UCUM
./adr is a folder for Architecture Decision Records.
./concepts is a wiki like knowledge base for the project.
./tasks is a folder for task management (todo, in-progress, done).
./test is a folder for tests.


## Architecture Decisions

* Before making significant architectural changes, check existing ADRs in ./adr
* Create new ADRs for important design decisions using ./adr/template.md
* Document alternatives considered and rationale for choices

## Coding

* While importing files, remember about import type for types.
* Use `bun run <filename.ts>` to run files
* When you create or update typescript file, run `bun tsc --noEmit` to check for errors and fix them.
* Create tests for new functionality. Put test file as ./test/<filename>.test.ts by convention.
* Use `import {describe, it, expect} from 'bun:test'` and `bun run test` to run tests.






