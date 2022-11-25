### Development

`target` in apps' and packages' `tsconfig.json` and inside of TS configs in this directory is not affecting the build target if we are using tsup. 

The default target is the tsup (esbuild) default target and can be changed with the tsup flag `--target`.
