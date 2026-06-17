# Contributing Guide

## Branch Rule
- Use `main` for stable code.
- Create feature branches as `feature/<short-topic>`.
- Create fix branches as `fix/<short-topic>`.

## Commit Rule
- Keep one topic per commit.
- Use clear prefixes:
  - `feat:`
  - `fix:`
  - `docs:`
  - `refactor:`

## Pull Request Rule
- Do not push directly to `main` in team work.
- Open a PR and request at least one review.
- Add a short test note in PR description:
  - what was tested
  - result

## Secrets Rule
- Never commit `.env` or API keys.
- Use `.env.example` as the shared template.
