(function() {
    'use strict';

    class hyfTimelineController {
        static get $inject() {
            return ['backendService', '$sce', '$mdDialog', 'toastService', 'me'];
        }

        constructor(backendService, $sce, $mdDialog, toastService, me) {
            this.me = me;
            this.$mdDialog = $mdDialog;
            this.backendService = backendService;
            this.toastService = toastService;
            this.backendService.getTimeline()
                .then(data => {
                    this.timeline = data;
                    this.classes = Object.keys(this.timeline)
                })
        }

        addClassModal(ev) {
            this.$mdDialog.show({
                    controller: 'dialogController',
                    controllerAs: '$ctrl',
                    templateUrl: 'client/app/timeline/addClassModal.html',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(group => {
                    this.backendService.addGroup(group)
                        .then((res) => {
                            this.toastService.displayToast(true, res, group);
                            console.log(res)
                            this.backendService.getTimeline()
                                .then(data => {
                                    this.timeline = data;
                                    this.classes = Object.keys(this.timeline)
                                })
                        })
                })
                .catch(err => this.toastService.displayToast(false));
        };

        isTeacher() {
            if (this.me.role === 'teacher') {
                return true;
            }
        }

    }

    angular
        .module('hyferApp')
        .component('hyfTimeline', {
            templateUrl: 'app/timeline/view.html',
            controller: hyfTimelineController
        });
})();