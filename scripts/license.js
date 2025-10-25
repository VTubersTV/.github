#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const CURRENT_YEAR = new Date().getFullYear();
const COPYRIGHT_HOLDER = "VTubers.TV / Lexi Rose Rogers";
const START_YEAR = 2025;

function yearRange(start, end) {
  if (!start) return String(end);
  const s = Number(start);
  const e = Number(end);
  if (isNaN(s) || isNaN(e)) return String(end);
  return s >= e ? String(e) : `${s}-${e}`;
}

function buildLicenseText({
  startYear = START_YEAR,
  currentYear = CURRENT_YEAR,
  holder = COPYRIGHT_HOLDER,
} = {}) {
  const years = yearRange(startYear, currentYear);
  return `
VTubers.TV License (MIT-Community Variant)
Copyright (c) ${years} ${holder}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit others to do so, subject to the following terms:

1. Attribution — You must credit “VTubers.TV” and the original authors in any
   public use, derivative work, or distribution where reasonably possible.

2. Transparency — Modified versions must clearly state changes and include a
   link to the original repository (https://github.com/vtubersTV).

3. Integrity — You may not misrepresent modified versions as official or
   affiliated with VTubers.TV. Branding, logos, and visual identity are
   protected under separate trademark rights and may not be reused without
   permission.

4. Community Protection — The Software may not be used to exploit, harass,
   defame, or discriminate against individuals or communities, particularly
   VTubers, digital creators, or marginalized groups.

5. Privacy & Ethics — Redistribution in systems that violate user privacy,
   engage in deceptive monetization, or enable creator censorship is strictly
   prohibited.

6. Open Development — If redistributed publicly, you are encouraged (but not
   required) to maintain open access to source modifications and contribute
   improvements back to the community.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
`.trim();
}

function printHelp() {
  console.log(
    [
      "Usage: license.js [options]",
      "",
      "Options:",
      "  -w, --write <path>   Write license text to <path> instead of stdout",
      "  -f, --force          Overwrite target file when using --write",
      "  -h, --help           Show this help message",
      "",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const out = { write: null, force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-w" || a === "--write") {
      out.write = argv[i + 1];
      i++;
    } else if (a === "-f" || a === "--force") {
      out.force = true;
    } else if (a === "-h" || a === "--help") {
      out.help = true;
    }
  }
  return out;
}

function main() {
  const argv = process.argv.slice(2);
  const opts = parseArgs(argv);

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  const text = buildLicenseText();

  if (!opts.write) {
    console.log(text);
    return;
  }

  const targetPath = path.isAbsolute(opts.write)
    ? opts.write
    : path.resolve(__dirname, "..", "..", opts.write);

  if (fs.existsSync(targetPath) && !opts.force) {
    console.error(
      `Refusing to overwrite existing file at ${targetPath}. Use --force to overwrite.`
    );
    process.exitCode = 2;
    return;
  }

  try {
    fs.writeFileSync(targetPath, text + "\n", { encoding: "utf8" });
    console.log(`Wrote license to ${targetPath}`);
  } catch (err) {
    console.error(
      `Failed to write license to ${targetPath}:`,
      err.message || err
    );
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}
