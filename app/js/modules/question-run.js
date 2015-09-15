var React = require('react'),
    TrashInfo = require('./trash'),
    ParkInfo = require('./parks'),
    LibraryInfo = require('./library'),
    ImperviousInfo = require('./impervious'),
    SchoolsInfo = require('./schools'),
    VotingComponent = require('./voting'),
    EnvironmentComponent = require('./environment'),
    PropertyClass = require('./property');


var questionRun = function(q, latlng, label, pid, gid) {
    var lat = Number(latlng.split(",")[0]);
    var lng = Number(latlng.split(",")[1]);
    switch(q) {
        case 'property':
            var propertyComponent = React.render(
                        <PropertyClass lat={lat} lng={lng} pid={pid} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'trash':
            var trashInfo = React.render(
                        <TrashInfo lat={lat} lng={lng} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'parks':
            var parkInfo = React.render(
                    <ParkInfo lat={lat} lng={lng} />,
                    document.querySelector('.report-container')
                );
            break;
        case 'libraries':
            var libraryInfo = React.render(
                        <LibraryInfo lat={lat} lng={lng} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'impervious':
            var imperviousInfo = React.render(
                        <ImperviousInfo pid={pid} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'schools':
            var schoolsInfo = React.render(
                        <SchoolsInfo lat={lat} lng={lng} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'voting':
            var votingInfo = React.render(
                        <VotingComponent lat={lat} lng={lng} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'environment':
            var environmentInfo = React.render(
                        <EnvironmentComponent lat={lat} lng={lng} pid={pid} gid={Number(gid)} />,
                        document.querySelector('.report-container')
                );
            break;
    }
};

module.exports = questionRun;
