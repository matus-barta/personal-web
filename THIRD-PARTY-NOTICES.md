# Third-party notices

This repository contains material owned by third parties. That material is not covered by the MIT License in `LICENSE`, and this project neither licenses nor sublicenses it. Anyone reusing the source code is responsible for obtaining their own rights to the material below, or for removing it.

## PrismJS

`static/prism/prism.js` and `static/prism/prism.css` are a bundled build of [PrismJS](https://prismjs.com) 1.29.0, redistributed here under the MIT License.

```text
MIT LICENSE

Copyright (c) 2012 Lea Verou

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Kerbal Space Program

`src/lib/assets/ksp.jpg` is artwork from the video game Kerbal Space Program, cropped and used as the site author's avatar. It is not original work by the author of this repository, and no ownership of it is claimed here. Kerbal Space Program, its artwork and its name belong to their rights holders — the game was developed by Squad and published by Private Division (Take-Two Interactive). Reuse or redistribution is subject to those rights holders' terms; replace this file if you fork this repository for your own site.

## Logoipsum

`src/lib/assets/projects/inprogress.svg` is a placeholder logo obtained from [Logoipsum](https://logoipsum.com). It is not original work by the author of this repository, and it carries the Logoipsum wordmark. Its use is governed by Logoipsum's own terms rather than by anything in this repository — check them before reusing or redistributing the file, and replace it outright if you fork this project for your own site.

## Blog post images

Not every image under `static/media/blog/` is the author's work. The files below are third party, are not covered by any license in this repository, and remain the property of their respective owners.

| File                                                         | What it is                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `best-way-to-manage-nodejs/nodejs-logo-flat.svg`             | The Node.js logo, a mark of the OpenJS Foundation                                                                                                                                                                                                                                                         |
| `simple-nodejs-project/expressjs.png`                        | The Express wordmark, a mark of the OpenJS Foundation, beside the JavaScript logo                                                                                                                                                                                                                         |
| `development-of-personal-web-with-svelte-and-tailwind/1.png` | The Svelte logo on a gradient background, a mark of the Svelte project                                                                                                                                                                                                                                    |
| `simple-nodejs-project/uptime-kuma-settings.jpg`             | A screenshot of the Uptime Kuma web interface, by Louis Lam and contributors                                                                                                                                                                                                                              |
| `svelte-kit-migration-experience/issue-6462-sveltekit.png`   | A screenshot of a GitHub issue thread in the SvelteKit repository, including comments written by other people                                                                                                                                                                                             |
| `svelte-kit-migration-experience/1.jpg`                      | A stock photograph of source code on a screen, found through an image search. Its EXIF metadata has been stripped and carries no author or copyright field, so the original photographer, source and license terms are unknown. Treat its status as unresolved rather than assuming it is freely reusable |
| `interesting-image.jpg`                                      | A frame from the music video for Rick Astley's "Never Gonna Give You Up". Rights are held by Sony Music Entertainment. The file appears only inside a fenced code sample in one post, so it is never rendered; the URL is reachable directly as an easter egg                                             |

The remaining images in that tree are the author's own work and are reserved under `LICENSE`: the Open-RMM dashboard captures and the screenshot of his own source code under `open-rmm/` and `open-rmm-part-deux/`.

## Vendored agent skills

The agent skills in `.agents/skills/` are third-party tools that AI coding agents load while working on this repository. They are not part of the site and not the author's work, and they are kept unchanged: the [`skills` CLI](https://github.com/vercel-labs/skills) installs and updates them, and [`skills-lock.json`](skills-lock.json) records where each came from. They are redistributed here under the licenses of their source repositories.

| Skill                       | Source                                                                | License    |
| --------------------------- | --------------------------------------------------------------------- | ---------- |
| `find-skills`               | [vercel-labs/skills](https://github.com/vercel-labs/skills)           | MIT        |
| `shadcn-svelte`             | [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte) | MIT        |
| `svelte-core-bestpractices` | [sveltejs/ai-tools](https://github.com/sveltejs/ai-tools)             | MIT        |
| `typescript-advanced-types` | [wshobson/agents](https://github.com/wshobson/agents)                 | MIT        |
| `gha-security-review`       | [getsentry/skills](https://github.com/getsentry/skills)               | Apache-2.0 |
| `security-review`           | [getsentry/skills](https://github.com/getsentry/skills)               | Apache-2.0 |

`security-review`'s reference material is derived from the [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) and licensed under CC BY-SA 4.0. Its attribution and terms are in the skill's own [`LICENSE`](.agents/skills/security-review/LICENSE), which its `SKILL.md` names as its license and which is kept with it.

The four MIT-licensed skills are distributed under this license, with the copyright notices of their source repositories:

```text
MIT License

Copyright (c) 2026 Vercel, Inc.
Copyright (c) 2023 Hunter Johnston <https://github.com/huntabyte>
Copyright (c) 2023 CokaKoala <https://github.com/adriangonz97>
Copyright (c) 2023 shadcn
Copyright (c) 2026 [Svelte Contributors](https://github.com/sveltejs/ai-tools/graphs/contributors)
Copyright (c) 2024 Seth Hobson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

`gha-security-review` and `security-review` are distributed under the Apache License 2.0:

```text
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to the Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   Copyright 2025 Functional Software, Inc. dba Sentry

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

## Trademarks and brand assets

The files below reproduce logos and marks owned by other organisations. They identify a linked service, the technology a listed project is built with, or the project a vendored agent skill comes from. They remain the property of their respective owners, are not covered by any license in this repository, and their use is subject to each owner's brand guidelines.

| Files                                                                              | Mark and owner                    |
| ---------------------------------------------------------------------------------- | --------------------------------- |
| `src/lib/assets/social/gh.svg`, `gh-grey.svg`                                      | GitHub, GitHub, Inc.              |
| `src/lib/assets/social/ig.svg`, `ig-grey.svg`                                      | Instagram, Meta Platforms, Inc.   |
| `src/lib/assets/social/yt.svg`, `yt-grey.svg`                                      | YouTube, Google LLC               |
| `src/lib/assets/social/tw.svg`, `tw-grey.svg`                                      | X, formerly Twitter, X Corp.      |
| `src/lib/assets/social/bsky.svg`, `bsky-grey.svg`                                  | Bluesky, Bluesky Social, PBC      |
| `src/lib/assets/projects/nodejs.svg`                                               | Node.js, OpenJS Foundation        |
| `src/lib/assets/projects/powershell.svg`                                           | PowerShell, Microsoft Corporation |
| `.agents/skills/shadcn-svelte/assets/shadcn-svelte.png`, `shadcn-svelte-small.png` | shadcn-svelte, its maintainers    |

Dependencies installed from the npm registry are not listed here. They are declared in `package.json`, resolved in `pnpm-lock.yaml`, and are not redistributed in this repository.
