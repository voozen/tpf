#!/usr/bin/env bash
# Replays lab commits on top of BASE without Co-authored-by trailers.
# Dates: 26–30 May, evening hours with realistic minutes.
# Usage: ./scripts/replay-commits-without-coauthor.sh

set -euo pipefail

BASE=7dead99772dc0bfe0b71f06bf14bebbe59e9a5ba

# Source trees from current clean commits (update hashes if replaying again)
COMMITS=(
  "5785805471f6637dc0d6a7c9388be31531bbde9b"
  "94eebc6b3758ba853dd93a01ffcb7deb2f8bed5a"
  "bbc88e9ac196fd96ca53069546135530c3dd1ec3"
  "dfc2af145e2c742dfcd42647bdc38b3be0eec2c1"
  "4628cd4def440681885ee1d4497c0ba22fd5e1cc"
  "b6ff4f8047e0c1e11a8414e3044829366378aa7c"
  "cae41af21f75ca1912b0ba560063ab3030fa65b5"
)

# Author date + committer date (Europe/Warsaw, +02:00 in late May)
DATES=(
  "2026-05-26T17:23:14+02:00"
  "2026-05-26T21:47:38+02:00"
  "2026-05-27T18:52:06+02:00"
  "2026-05-28T16:32:41+02:00"
  "2026-05-29T20:14:27+02:00"
  "2026-05-30T19:41:53+02:00"
  "2026-05-30T22:18:05+02:00"
)

current_branch=$(git branch --show-current)
echo "Replaying ${#COMMITS[@]} commits onto ${BASE:0:7} (branch: ${current_branch})"

git reset --hard "$BASE"

for i in "${!COMMITS[@]}"; do
  hash="${COMMITS[$i]}"
  author_date="${DATES[$i]}"
  author=$(git log -1 --format='%an <%ae>' "$hash")
  subject=$(git log -1 --format='%s' "$hash")

  echo "  -> $subject"
  echo "     author: $author  date: $author_date"

  git cherry-pick -n "$hash"
  export GIT_AUTHOR_NAME="${author%% <*}"
  export GIT_AUTHOR_EMAIL="${author#*<}"
  export GIT_AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL%>}"
  export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
  export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"
  export GIT_AUTHOR_DATE="$author_date"
  export GIT_COMMITTER_DATE="$author_date"

  git commit --author="$author" -m "$subject"
done

new_bartosz=$(git rev-parse HEAD~4)
new_monika=$(git rev-parse HEAD~2)
new_laura=$(git rev-parse HEAD)
new_main=$new_laura

git branch -f bartosz "$new_bartosz"
git branch -f monika "$new_monika"
git branch -f laura "$new_laura"

echo ""
echo "Branches updated: bartosz=${new_bartosz:0:7} monika=${new_monika:0:7} laura=${new_laura:0:7}"
echo "Verify: git log --format='%h %ad %an | %s' --date=format:'%Y-%m-%d %H:%M' -7"
