'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    
    var done = this.async();
    var greeting = 'This action will create a scaffold for HTML5 banner projects.';

    this.log(yosay(
      'This action will create a scaffold for ' + chalk.blue('HTML5 banner projects') + '.'
    ));

    var prompts = [{
      type: 'input',
      name: 'campaignName',
      message: 'Enter the name of this campaign:'
    },{
      type: 'input',
      name: 'sizes',
      message: 'Enter the banner sizes you would like to create as a comma-separated list (728x90, 300x250, 160x600):'
    },{
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

      tmpSizes.forEach(function(value){
        var dimensions = value.split('x');

        if (!dimensions[0] || !dimensions[1]) {
          return self.env.error(chalk.red('Invalid dimensions entered: ' + value));
        }

        var width = Math.floor(dimensions[0]).toString();
        var height = Math.floor(dimensions[1]).toString();

        if (width !== dimensions[0]) {
          console.log('Width', width, 'Dimension', dimensions[0]);
          return self.env.error(chalk.red('Invalid width entered in the following banner size: ' + value));
        }

        if (height !== dimensions[1]) {
          console.log('Height', height, 'Dimension', dimensions[1]);
          return self.env.error(chalk.red('Invalid height entered in the following banner size: ' + value));
        }

        sizes.push([width, height]);
      });

      this.props = {};
      this.props.sizes = sizes;
      this.props.campaignName = answers.campaignName;
      this.props.includeEnabler = answers.includeEnabler;

      done();
    }.bind(this));
  },

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

    this.props.sizes.forEach(function(value){

      var width = value[0];
      var height = value[1];
      var fileName = width + 'x' + height + '.html';

      self.fs.copyTpl(
        self.templatePath('index.html'),
        self.destinationPath(fileName),
        {
          width: width,
          height: height,
          campaignName: self.props.campaignName,
          includeEnabler: self.props.includeEnabler
        }
      );
    });
  },

  install: function () {
    this.npmInstall();
  }
});
