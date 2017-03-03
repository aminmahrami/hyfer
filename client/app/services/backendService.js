(function() {
    'use strict';

    angular
        .module('hyferApp')
        .service('backendService', backendService)

    backendService.$inject = ['$http'];

    function backendService($http) {

        return {
            getModules: getModules,
            getTimeline: getTimeline,
            getReadme: getReadme
        }

        function getModules() {
            return $http.get('/api/modules', getHttpConfig())
                .then(res => res.data);
        }


        function getTimeline() {
            return $http.get('/api/groups')
                .then(res => res.data)
        }

        function getReadme(gitRepo) {
            return $http.get('/api/github/readme/hackyourfuture/' + gitRepo)
                .then(res => res.data);
        }

    }

    function getHttpConfig() {
        let config = {};
        let token = window.localStorage.getItem('token');
        if (token) {
            config.headers = { 'Authorization': 'Bearer ' + token };
        }
        return config;
    }

}());