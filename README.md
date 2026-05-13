# OpenDesk Pages

The official document pages for the [OpenDesk](https://gitcode.com/openharmony-robot/OpenDesk) project. This project is powered by [Jekyll](https://jekyllrb.com/) and using the [minimal-mistakes](https://github.com/mmistakes/minimal-mistakes) theme.

## 1. Installing the Dependencies

### On Windows Platform

1. Download and install ruby from [RubyInstaller](https://rubyinstaller.org/downloads/):
   - download the **with devkit** version;
   - during the installation process, make sure that *Add rube executables to your PATH* and *MSYS2 development toolchain* are selected and installed (otherwise some native libraries might not work properly);
2. Restart your terminal (to guarantee the PATH environment variables have taken effect);
3. Using bash, powershell or simply cmd, jumping to this directory and run:

   ```
   bundle install
   ```
   and wait until everything is properly configured.

### On Other Platforms

Since you guys are working on a *professional* platform, we will not waste the time teaching you how to do this, haha ;)

## 2. Starting The Server

The default serving port of jekyll is 4000, however this is by default disallowed on latest Windows. So manually specify a port instaed. For, example:

```bash
bundle exec jekyll serve --port 8081
```

Or using the following command to enable live reload:

```bash
bundle exec jekyll serve --port 8081 --livereload
```