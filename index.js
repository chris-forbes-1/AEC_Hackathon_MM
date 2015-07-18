var defaultUrn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YmtfbWVkL0NsaW5pY19NRVAucnZ0';
/*
$(document).ready(function () {
    var tokenurl = 'http://' + window.location.host + '/api/token';
    var config = {
        environment : 'AutodeskProduction'
		//environment : 'AutodeskStaging'
    };

    // Instantiate viewer factory
    var viewerFactory = new Autodesk.ADN.Toolkit.Viewer.AdnViewerFactory(
        tokenurl,
        config);

    // Allows different urn to be passed as url parameter
    var paramUrn = Autodesk.Viewing.Private.getParameterByName('urn');
    var urn = (paramUrn !== '' ? paramUrn : defaultUrn);

    viewerFactory.getViewablePath (urn,
        function(pathInfoCollection) {
            var viewerConfig = {
                viewerType: 'GuiViewer3D'
            };

            var viewer = viewerFactory.createViewer(
                $('#viewerDiv')[0],
                viewerConfig);

            viewer.load(pathInfoCollection.path3d[0].path);
        },
        onError);

});

function onError(error) {
    console.log('Error: ' + error);
};
*/

        $(document).ready(function () {
            var getToken =  function() {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", 'http://' + window.location.host + '/api/token', false);
                xhr.send(null);
                console.log("test " + xhr.responseText);
                var jso = JSON.parse(xhr.responseText);
                return jso.access_token;
            }

            function initializeViewer(containerId, documentId, role) {
                var viewerContainer = document.getElementById(containerId);
                var viewer = new Autodesk.Viewing.Private.GuiViewer3D(
                        viewerContainer);
                viewer.start();

                Autodesk.Viewing.Document.load(documentId,
                        function (document) {
                            var rootItem = document.getRootItem();
                            var geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(
                                    rootItem,
                                    { 'type': 'geometry', 'role': role },
                                    true);

                            viewer.load(document.getViewablePath(geometryItems[0]));
                        },

                        function (msg) {
                            console.log("Error loading document: " + msg);
                        }
                );
            }

            function initialize() {
                var options = {
                    env: "AutodeskProduction",
                    getAccessToken: getToken,
                    refreshToken: getToken
                };
                console.log("test " + options.getAccessToken);
                var paramUrn = Autodesk.Viewing.Private.getParameterByName('urn');
                var urn = (paramUrn !== '' ? paramUrn : defaultUrn);
                urn = "https://developer.api.autodesk.com/viewingservice/v1/" + urn;
                Autodesk.Viewing.Initializer(options, function () {
                    initializeViewer('viewerDiv', urn, '3d');
                });
            }
            initialize();
        });
