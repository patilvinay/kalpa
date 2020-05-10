[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![License][apache-image]][apache-url]

# Kalpa (WIP)

Automation Tool, programmed through descriptive yml language,

## Getting started

1. npm install kalpa -g
2. kalpa <kalpa-playbook.yml>

### example playbook.yml

npm install kalpa-exec -g

```
kalpa:
  - play:
      - name: Create a file foo.txt
        kalpa-execa:
          cmd: touch
          opts:
            - foo.txt
      - name: Downloading a file
        kalpa-execa:
          cmd: wget
          opts:
            - https://wordpress.org/latest.zip
      - name: Uncompress a file
        kalpa-execa:
          cmd: unzip
          opts:
            - -o
            - latest.zip
```

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
