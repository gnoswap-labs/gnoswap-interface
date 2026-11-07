const { execFileSync } = require("node:child_process");
const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { isDeepStrictEqual } = require("node:util");

const marker = "<!-- gnoswap:i18nexus-drift -->";
const localePrefix = "packages/web/public/locales/";

module.exports = async ({ github, context, core }) => {
  const head = context.payload.pull_request.head.sha;
  const repo = context.repo;
  const number = context.payload.pull_request.number;
  const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
  const expected = new Map();
  const collect = (directory, prefix = "") => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const name = `${prefix}${entry.name}`;
      if (entry.isDirectory()) collect(join(directory, entry.name), `${name}/`);
      else if (entry.isFile() && name.endsWith(".json")) {
        expected.set(
          name,
          JSON.parse(readFileSync(join(directory, entry.name), "utf8"))
        );
      }
    }
  };
  collect(process.env.I18NEXUS_EXPORT_DIR);
  if (expected.size === 0)
    throw new Error("The i18nexus export contains no locale JSON files.");

  // Read PR blobs as data: no checkout, symlink traversal, filters, or PR script execution.
  const actual = new Map();
  for (const record of git("ls-tree", "-r", "-z", head, "--", localePrefix)
    .split("\0")
    .filter(Boolean)) {
    const tab = record.indexOf("\t");
    const [mode, type, oid] = record.slice(0, tab).split(" ");
    const path = record.slice(tab + 1).slice(localePrefix.length);
    if (path.endsWith(".json")) actual.set(path, { mode, type, oid });
  }

  const changes = [];
  for (const path of [
    ...new Set([...expected.keys(), ...actual.keys()]),
  ].sort()) {
    if (!actual.has(path)) changes.push({ path, reason: "missing from PR" });
    else if (!expected.has(path))
      changes.push({ path, reason: "not in i18nexus" });
    else {
      const file = actual.get(path);
      if (file.type !== "blob" || !["100644", "100755"].includes(file.mode)) {
        changes.push({ path, reason: "not a regular file" });
        continue;
      }
      let value;
      try {
        value = JSON.parse(git("cat-file", "blob", file.oid));
      } catch {
        changes.push({ path, reason: "invalid JSON" });
        continue;
      }
      if (!isDeepStrictEqual(value, expected.get(path)))
        changes.push({ path, reason: "content differs" });
    }
  }

  const drift = changes.length > 0;
  const result = drift
    ? `${changes.length} locale file(s) differ from i18nexus.`
    : "Locale JSON matches i18nexus.";
  await core.summary.addHeading("i18nexus drift").addRaw(result).write();
  if (drift) core.warning(result);

  // An older run must not overwrite the result for a newer PR head.
  const current = await github.rest.pulls.get({ ...repo, pull_number: number });
  if (current.data.state !== "open" || current.data.head.sha !== head) {
    core.info("Skipping the comment: this PR run is no longer current.");
    return;
  }
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...repo,
    issue_number: number,
    per_page: 100,
  });
  const existing = comments.find(
    (comment) =>
      comment.user?.login === "github-actions[bot]" &&
      comment.body?.includes(marker)
  );
  if (!drift && !existing) return;

  const lines = [
    marker,
    `### ${
      drift
        ? "⚠️ i18nexus translation drift"
        : "✅ i18nexus translations are in sync"
    }`,
    "",
    result,
    "",
  ];
  if (drift) {
    lines.push("| Locale file | Difference |", "| --- | --- |");
    for (const change of changes.slice(0, 30)) {
      const path = change.path.split("/").map(encodeURIComponent).join("/");
      lines.push(`| \`${path}\` | ${change.reason} |`);
    }
    if (changes.length > 30)
      lines.push("", `Showing 30 of ${changes.length} affected files.`);
    lines.push(
      "",
      "#### How to sync",
      "1. If this PR intentionally changes strings, update them in i18nexus first. Do not hand-edit generated locale JSON.",
      "2. From the checkout root, download and review the authoritative translations:",
      "",
      "```sh",
      "yarn workspace @gnoswap-labs/web i18n:download",
      "git diff -- packages/web/public/locales",
      "```",
      "",
      "3. Commit the relevant locale changes and push. This comment updates automatically on the next check.",
      "",
      "This is an advisory check, not a merge blocker. Review unrelated namespace changes before committing them."
    );
  }
  lines.push(
    "",
    "Comparison ignores JSON formatting and object-key order. No files were modified.",
    `Checked PR commit \`${head.slice(
      0,
      12
    )}\` against the latest downloaded i18nexus snapshot.`,
    `[Workflow run](${context.serverUrl}/${repo.owner}/${repo.repo}/actions/runs/${context.runId})`
  );
  const body = lines.join("\n");
  if (existing)
    await github.rest.issues.updateComment({
      ...repo,
      comment_id: existing.id,
      body,
    });
  else
    await github.rest.issues.createComment({
      ...repo,
      issue_number: number,
      body,
    });
};
