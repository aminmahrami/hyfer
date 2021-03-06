import angular from 'angular'

import timelineModule from '../timeline.module'
// import addAndUpdateRunningModuleController from '../../modals/runningModules/addAndUpdateRunningModuleModalCtrl';
// import addRunningTemplate from '../../modals/runningModules/addRunningModuleModal.html';
import template from './classBlockItem.component.html'

class ClassBlockItemController {

  static get $inject() {
    return ['$mdDialog', 'backendService', 'me']
  }

  constructor($mdDialog, backendService, me) {
    this.$mdDialog = $mdDialog
    this.me = me
  }

}

const componentName = 'hyfClassBlockItem'

angular.module(timelineModule)
  .component(componentName, {
    template,
    controller: ClassBlockItemController,
    bindings: {
      className: '<'
    }
  })

export default componentName
