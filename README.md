[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![License][apache-image]][apache-url] [![semantic-release][semantic-release-image]][semantic-release-url]

> This project is looking for contributors. Please contact maintainer of this project to participate in this project

# Kalpa

Automation Tool, programmed through descriptive yml language. It is similar to Ansible, with a intent to leverage large npm echo system and readily available modules. The existing npm module can easily converted to kalpa module with minimal efforts.

Kalpa can do whole lot of things for you, like

- Create a directory for you, download a file zip file in it and unzip it.
- Code generation based on ejs templates
- Create a github repo for you
- Publish a apk on google play store

Currently some modules that are in development are available are

- kalpa-execa (shell module)
  - This module execute a shell command
  - Uses execa npm module
- kalpa-file (fs module)
  - This module provides fs related functionality
  - Uses fs-nextra npm module
- kalpa-inquirer (prompt module)
  - Provides terminal prompt interface.
  - Uses inquirer npm module
- kalpa-github
  - Kalpa module to use github apis
  - Uses octonode npm module
  - Can be used to create new repo, release and more...
- kalpa-googleapis

  - Kalpa module to use google apis
  - Can be used to publish you app on playstore.

## Basic concept

- Kalpa project provides a cli by name 'kalpa' which take a series of instruction in yml
- A yml file is called playbook
- Each playbook in turns has plays and series
  - plays are set of instruction that are executed by kalpa.
  - series are plays refactored in to directory and can be group of plays.
  - Each play uses kalpa modules to execute certain set of instructions.
- Each playbook can have it's own variables.
- Playbook can import other yml files as imported variables.

### Example playbook ( Just to explain. Will not run out of box )

```yml
kalpa:
  import:
    config:
      file: config.yml
      ref: vars
      directory: ./

  vars:
    fileName: latest.zip

  series:
    - essentials

  play:
    - name: Downloading a file
      kalpa-execa:
        cmd: curl
        opts:
          - "https://wordpress.org/{{ vars.fileName }}"
          - "-o{{vars.fileName}}"
```

## Getting started

```sh
$ npm install kalpa -g
$ kalpa install kalpa-execa kalpa-file kalpa-ejs kalpa-inquirer
$ kalpa <playbook.yml>
$ kalpa list   // To list the installed Kalpa modules
```

### Example playbook main.yml ( Should run out of box )

```yml
kalpa:
  play:
    - name: Create a file foo.txt
      kalpa-execa:
        cmd: touch
        opts:
          - foo.txt

    - name: Downloading a file
      kalpa-execa:
        cmd: curl
        opts:
          - https://wordpress.org/latest.zip
          - -olatest.zip

    - name: Uncompress a file
      kalpa-execa:
        cmd: unzip
        opts:
          - -o
          - latest.zip

    - name: Deleting latest.zip
      kalpa-execa:
        cmd: rm
        opts:
          - latest.zip
          - -f
```

More examples can be found in [Examples](https://github.com/patilvinay/kalpa/tree/master/examples)

### Style guide

[Airbnb style-guide](https://github.com/airbnb/javascripthttps://github.com/airbnb/javascript)

[npm-image]: https://badge.fury.io/js/kalpa.svg
[npm-url]: https://npmjs.org/package/kalpa
[travis-image]: https://travis-ci.com/patilvinay/kalpa.svg?branch=master
[travis-url]: https://travis-ci.com/patilvinay/kalpa
[daviddm-image]: https://david-dm.org/patilvinay/kalpa.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/patilvinay/kalpa
[coveralls-image]: https://coveralls.io/repos/patilvinay/kalpa/badge.svg
[coveralls-url]: https://coveralls.io/r/patilvinay/kalpa
[apache-image]: https://img.shields.io/badge/License-Apache%202.0-blue.svg
[apache-url]: https://opensource.org/licenses/Apache-2.0
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
