### Contributing

**Before making a commit, make sure the lint, test, and format checks pass.**

You can do this by running the associated commands in our development environment.

```shell
backend-lint
backend-test
frontend-lint
frontend-test
```

Then, commit your changes. Afterwards:

1. Create a pull request and fill out the provided template. Ensure all fields are filled and that **the title is detailed**.
2. In order for a PR to be merged, it requires at least one approval from a technical lead, as well as a fully passing CI/CD pipeline. This is to ensure the commit tree in our main branch is clean and well-tested. To help with this, all pull requests will be squashed and merged.
3. In the case your PR is not initially approved, a technical lead will leave suggestions to improve. Once you have incorporated said improvements, feel free to re-request a review or message one of your TLs on Slack for another review.

### Best Practices

- We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages for uniformity and clarity.
- Make sure to write tests for the most complex parts of your code.
- For manual API testing, include screenshots from Postman.
- Go uses **TitleCase** and React Native uses **camelCase** for naming conventions.

### If you have time...

- _Want to go that extra level?_ — Consider checking out [act](https://github.com/nektos/act).
- If you're _real interested_ in industry-level commit practices, consider [GPG/PGP signing](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) your commits.
