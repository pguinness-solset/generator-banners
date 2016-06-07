'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-banners', function () {
  describe('With Enabler', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .inTmpDir(function () {
          var done = this.async();
          done();
        })
        .withPrompts({
          campaignName: 'Test Campaign',
          sizes: '728x90, 300x250, 160x600',
          includeEnabler: true
        })
        .toPromise();
    });

    it('creates files', function () {
      assert.file([
        'package.json',
        'index.html',
        '.gitignore',
        'gulpfile.js',
        'README.md',
        '728x90/index.html',
        '300x250/index.html',
        '160x600/index.html'
      ]);
    });

    it('adds title to index file', function () {
      assert.fileContent('index.html', '<title>Test Campaign Banners</title>');
    });

    it('adds title to banner files', function () {
      assert.fileContent([
        ['728x90/index.html', '<title>Test Campaign | 728x90</title>'],
        ['300x250/index.html', '<title>Test Campaign | 300x250</title>'],
        ['160x600/index.html', '<title>Test Campaign | 160x600</title>']
      ]);
    });

    it('adds Enabler script to banner files', function () {
      var enablerScript = '<script src="https://s0.2mdn.net/ads/studio/Enabler.js"></script>';

      assert.fileContent([
        ['728x90/index.html', enablerScript],
        ['300x250/index.html', enablerScript],
        ['160x600/index.html', enablerScript]
      ]);
    });
  });

  describe('Without Enabler', function () {
    before(function () {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .inTmpDir(function () {
          var done = this.async();
          done();
        })
        .withPrompts({
          campaignName: 'Test Campaign',
          sizes: '728x90, 300x250, 160x600',
          includeEnabler: false
        })
        .toPromise();
    });

    it('creates files', function () {
      assert.file([
        'package.json',
        'index.html',
        '.gitignore',
        'gulpfile.js',
        'README.md',
        '728x90/index.html',
        '300x250/index.html',
        '160x600/index.html'
      ]);
    });

    it('adds title to index file', function () {
      assert.fileContent('index.html', '<title>Test Campaign Banners</title>');
    });

    it('adds title to banner files', function () {
      assert.fileContent([
        ['728x90/index.html', '<title>Test Campaign | 728x90</title>'],
        ['300x250/index.html', '<title>Test Campaign | 300x250</title>'],
        ['160x600/index.html', '<title>Test Campaign | 160x600</title>']
      ]);
    });

    it('adds clicktag', function () {
      var clicktag = 'var clickTag = "http://google.com/";';

      assert.fileContent([
        ['728x90/index.html', clicktag],
        ['300x250/index.html', clicktag],
        ['160x600/index.html', clicktag]
      ]);
    });

    it('does not add Enabler script to banner files', function () {
      var enablerScript = '<script src="https://s0.2mdn.net/ads/studio/Enabler.js"></script>';

      assert.noFileContent([
        ['728x90/index.html', enablerScript],
        ['300x250/index.html', enablerScript],
        ['160x600/index.html', enablerScript]
      ]);
    });
  });
});
