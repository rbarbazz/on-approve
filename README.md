```jsx
<Pr onApprove={() => 👍} />
```

Give the author a thumbs-up upon approving a PR.

### Example workflow:
```yaml
on: [pull_request_review]

jobs:
  approved_job:
    runs-on: ubuntu-latest
    name: on-approve
    steps:
      - name: Approved action step
        uses: rbarbazz/on-approve@v1.0
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```
