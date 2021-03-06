'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({

  // Prompt user for project info before install
  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'This action will create a scaffold for ' + chalk.blue('HTML5 banner projects') + '.'
    ));

    var prompts = [{
      type: 'input',
      name: 'campaignName',
      message: 'Enter the name of this campaign:'
    }, {
      type: 'input',
      name: 'sizes',
      message: 'Enter the banner sizes you would like to create as a comma-separated list (728x90, 300x250, 160x600):'
    }, {
      type: 'confirm',
      name: 'includeEnabler',
      message: 'Would you like to include Enabler?',
      default: true
    }];

    return this.prompt(prompts).then(function (answers) {
      var self = this;
      var tmpSizes = answers.sizes.replace(/\s/g, '').split(',');
      var numSizes = tmpSizes.length;
      var sizes = [];
      var value;
      var dimensions;
      var width;
      var height;

      for (var i = 0; i < numSizes; i++) {
        value = tmpSizes[i];
        dimensions = value.split('x');

        if (!dimensions[0] || !dimensions[1]) {
          self.env.error(chalk.red('Invalid dimensions entered: ' + value));
          break;
        }

        width = Math.floor(dimensions[0]).toString();
        height = Math.floor(dimensions[1]).toString();

        if (width !== dimensions[0]) {
          self.env.error(chalk.red('Invalid width entered in the following banner size: ' + value));
          break;
        }

        if (height !== dimensions[1]) {
          self.env.error(chalk.red('Invalid height entered in the following banner size: ' + value));
          break;
        }

        sizes.push([width, height]);
      }

      this.props = {};
      this.props.sizes = sizes;
      this.props.campaignName = answers.campaignName;
      this.props.includeEnabler = answers.includeEnabler;

      done();
    }.bind(this));
  },

  // Create scaffold files
  writing: function () {
    var self = this;

    this.fs.copy(
      this.templatePath('_package.json'),
      this.destinationPath('package.json')
    );

    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );

    this.props.sizes.forEach(function (value) {
      var width = value[0];
      var height = value[1];
      var dirName = width + 'x' + height;

      // create separate folders for each banner
      self.fs.copyTpl(
        self.templatePath('banner.html'),
        self.destinationPath(dirName + '/index.html'),
        {
          width: width,
          height: height,
          campaignName: self.props.campaignName,
          includeEnabler: self.props.includeEnabler
        }
      );
    });

    // create an index page with links to banners
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('index.html'),
      {
        campaignName: this.props.campaignName,
        sizes: this.props.sizes
      }
    );

    // create README
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        campaignName: this.props.campaignName
      }
    );

    // create .gitignore
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
  },

  // Install any additional node or bower dependencies
  install: function () {
    this.npmInstall();
  },

  // Perform any additional actions after installation is complete
  end: function () {
    var message = chalk.cyan('Install complete! ');
    message += chalk.yellow('Run ');
    message += chalk.gray('gulp serve');
    message += chalk.yellow(' from your command line to run banners locally.');

    this.log(message);
  }
});
