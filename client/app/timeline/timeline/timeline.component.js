import angular from 'angular'

import timelineModule from '../timeline.module'
import timelineService from '../timeline.service'
import backendService from '../../services/backendService'
import toastService from '../../services/toastService'
import AddClassModalController from '../../modals/classes/addClass.controller'
import addClassTemplate from '../../modals/classes/addClassModal.html'
import timelineTemplate from './timeline.component.html'
import './timeline.scss'

class TimelineController {
  static get $inject() {
    return ['$rootScope', '$mdDialog', 'me', timelineService, backendService, toastService]
  }

  constructor($rootScope, $mdDialog, me, timelineService, backendService, toastService) {
    this.$rootScope = $rootScope
    this.$mdDialog = $mdDialog
    this.me = me
    this.timelineService = timelineService
    this.backendService = backendService
    this.toastService = toastService

    this.$rootScope.$on('timelineChanged', () => {
      this.backendService.getTimeline()
        .then(timeline => {
          this.timeline = timeline
          this._composeTimeline()
        })
        .catch(err => console.log(err))
    })

    setTimeout(() => {
      this.showFooter = true
    }, 60)
  }

  $onInit() {
    document.getElementById('content').scrollTop = 0
    this._composeTimeline()
  }

  scrollToToday() {
    this.$rootScope.$broadcast('scrollToToday')
  }

  onClick(module) {
    this.selectedModule = module
  }

  addClassModal(ev) {
    this.$mdDialog.show({
      controller: AddClassModalController,
      controllerAs: '$ctrl',
      template: addClassTemplate,
      targetEvent: ev,
      clickOutsideToClose: true
    }).then(group => {
      if (!group.starting_date) {
        return this.toastService.displayToast(true, `Please supply starting date`)
      }
      let classInfo = group.group_name.split('')[0].toUpperCase() + group.group_name.split('').slice(1).join('')
      classInfo = { group_name: classInfo, starting_date: group.starting_date }
      this.backendService.addGroup(classInfo)
        .then(() => {
          this.toastService.displayToast(true, `${classInfo.group_name} has been added`)
          this.timelineService.notifyTimelineChanged()
        })
    }).catch(() => {
      this.toastService.displayToast(false)
    })
  }

  isTeacher() {
    return this.me.role === 'teacher'
  }

  _composeTimeline() {
    this.classNames = Object.keys(this.timeline)
    this.height = (this.classNames.length * 60) + 40
    if (this.me.group_name) {
      const now = new Date()
      const afterTwintyDays = new Date(new Date(now).setDate(now.getDate() + 20)).getTime()
      setTimeout(() => {
        for (const group of this.timeline[this.me.group_name]) {
          const group_date = new Date(group.startingDate).getTime()
          if (group_date >= now.getTime() - 8.64e+7 && group_date <= afterTwintyDays) {
            this.selectedModule = group
          }
        }
      }, 200)
    }
    this.selectedModule = this.timeline[this.classNames[0]][0]
  }
}

const componentName = 'hyfTimeline'

angular
  .module(timelineModule)
  .component(componentName, {
    template: timelineTemplate,
    controller: TimelineController,
    bindings: {
      timeline: '<'
    }
  })

export default componentName
