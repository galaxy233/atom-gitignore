'use babel';

import { CompositeDisposable, File } from 'atom';
const fs = require('fs');

export default {
  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-gitignore:add': (e) => this.add(e)
    }));
  },

  add(e) {
      let {path, name} = e.target.dataset;
      let projectRoot = atom.project.relativizePath(path)[0];
      let gitignorePath = projectRoot + '/.gitignore';
      if (!fs.existsSync(gitignorePath)) {
          fs.writeFileSync(gitignorePath, name);
          atom.notifications.addSuccess("File has been added to .gitignore");
      } else {
          let contents = fs.readFileSync(gitignorePath);
          let re = new RegExp(`^${name}$`, 'm');
          if (re.test(contents)) {
              atom.notifications.addWarning("File is already in .gitignore");
          } else {
              fs.appendFileSync(gitignorePath, "\n" + name);
              atom.notifications.addSuccess("File has been added to .gitignore");
          }
      }
  },
};
