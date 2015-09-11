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
    var lat = latlng.split(",")[0];
    var lng = latlng.split(",")[1];
    switch(q) {
        case 'property':
            var propertyComponent = React.render(
                        <PropertyClass />,
                        document.querySelector('.report-container')
                );
            propertyComponent.getData(pid, lat, lng);
            break;
        case 'trash':
            var trashInfo = React.render(
                        <TrashInfo />,
                        document.querySelector('.report-container')
                );
            trashInfo.getTrash(lat, lng);
            break;
        case 'parks':
            var parkInfo = React.render(
                        <ParkInfo />,
                        document.querySelector('.report-container')
                );
            parkInfo.getParks(lat, lng);
            break;
        case 'libraries':
            var libraryInfo = React.render(
                        <LibraryInfo />,
                        document.querySelector('.report-container')
                );
            libraryInfo.getLibraries(lat, lng);
            break;
        case 'impervious':
            var imperviousInfo = React.render(
                        <ImperviousInfo />,
                        document.querySelector('.report-container')
                );
            imperviousInfo.getImpervious(pid);
            break;
        case 'schools':
            var schoolsInfo = React.render(
                        <SchoolsInfo />,
                        document.querySelector('.report-container')
                );
            schoolsInfo.getData(lat, lng);
            break;
        case 'voting':
            var votingInfo = React.render(
                        <VotingComponent />,
                        document.querySelector('.report-container')
                );
            votingInfo.getData(lat, lng);
            break;
        case 'environment':
            var environmentInfo = React.render(
                        <EnvironmentComponent />,
                        document.querySelector('.report-container')
                );
            environmentInfo.getData(lat, lng, pid, gid);
            break;
        // case n:
        //     code block
        //     break;
        // default:
        //     default code block
    }
};

module.exports = questionRun;
