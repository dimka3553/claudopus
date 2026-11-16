# Changes waiting for their version

For each branch, add a file here that says what the branch changed for people using Claudopus. Name it after the branch, such as `changes/my-branch.md` (a slash in the branch name becomes a dash). Write one `- ` line for each change, in plain words: what people see or can do now, or what used to go wrong and now works. Never use commit titles or code names.

The release numbers the version. Its build moves these lines into `CHANGELOG.md` under that version and removes the files. If a release's version has no file here, its build fails, so no version goes out without its entry.
