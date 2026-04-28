# branchbrief Template Notes

Use `templates/github/workflows/branchbrief.yml` as the baseline branchbrief
workflow.

The default workflow creates a pull request artifact only. It summarizes recent
commits, changed files, diff stats, likely review areas, and configured risk
keyword matches in changed files.

It does not require secrets and does not write comments, labels, or files back
to the repository.
