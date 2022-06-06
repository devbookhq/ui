## Issues
- There is a warning with nested tailwind
- There is some error in the bundled script that prevents it from working: Maybe it is the SDK ES module problem?
- The bundle size is big: 400K+ vs 128 with microbundle (but micro does not support inlined CSS)
- Add run/stop button and session url to the code snippet
- Fix local env for cloud workers
- Move to separate repo?
- Add build/deploy pipeline for cloud workers that includes building and loading/importing the bundled inline script as a string
