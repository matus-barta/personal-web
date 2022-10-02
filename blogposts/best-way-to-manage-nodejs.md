---
title: Best way to manage Node.JS
date: '2022-2-25'
excerpt: Quick how-to, to manage Node installation.
img: /media/blog/best-way-to-manage-nodejs/nodejs-logo-flat.svg
img_transparent: true
---

Installation and updating of Node.JS can be sometimes little complicated or annoying, there can be issues with version in your distribution's repository or after update of npm will start showing weird errors.

The solution is to use [Node Version Manager](https://github.com/nvm-sh/nvm).

## NVM installation

We will download and run nvm install shell script (check this [link](https://github.com/nvm-sh/nvm#installing-and-updating) if code bellow is outdated):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

or with wget

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

## Node installation

to download, compile, and install the latest release of node, do this:

```bash
nvm install node # "node" is an alias for the latest version
```

to install a specific version of node:

```bash
nvm install 14.7.0 # or 16.3.0, 12.22.1, etc
```

## Node update

to update node to latest version run:

```bash
nvm install node --reinstall-packages-from=node
```

to update Stable (LTS) version: (if currently in use):

```bash
nvm install "lts/*" --reinstall-packages-from="$(nvm current)"
```
