# Changes waiting for their version

Each piece of work says here what it changed for the person using Claudopus, in a file of its own named after its branch, such as `changes/my-branch.md`: one `- ` line each, in plain words (what they see or can do now, or what used to go wrong and now works), never commit titles or code names.

The release numbers the version, and its build moves these lines into `CHANGELOG.md` under that version and removes the files. A release whose version has no file here fails its build, so no version goes out without its entry.
