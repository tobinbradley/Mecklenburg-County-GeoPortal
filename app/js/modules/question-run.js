var React = require('react'),
    ReactDOM = require('react-dom'),
    TrashInfo = require('./trash'),
    ParkInfo = require('./parks'),
    LibraryInfo = require('./library'),
    ImperviousInfo = require('./impervious'),
    SchoolsInfo = require('./schools'),
    VotingComponent = require('./voting'),
    EnvironmentComponent = require('./environment'),
    PropertyClass = require('./property');


var questionRun = function(q, latlng, label, pid, gid) {
    var lat = Number(latlng.split(',')[0]);
    var lng = Number(latlng.split(',')[1]);
    switch(q) {
        case 'property':
            var propertyComponent = ReactDOM.render(
                        <PropertyClass lat={lat} lng={lng} pid={pid} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'trash':
            var trashInfo = ReactDOM.render(
                        <TrashInfo lat={lat} lng={lng} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'parks':
            var parkInfo = ReactDOM.render(
                    <ParkInfo lat={lat} lng={lng} />,
                    document.querySelector('.report-container')
                );
            break;
        case 'libraries':
            var libraryInfo = ReactDOM.render(
                        <LibraryInfo lat={lat} lng={lng} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'impervious':
            var imperviousInfo = ReactDOM.render(
                        <ImperviousInfo pid={pid} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'schools':
            var schoolsInfo = ReactDOM.render(
                        <SchoolsInfo lat={lat} lng={lng} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'voting':
            var votingInfo = ReactDOM.render(
                        <VotingComponent lat={lat} lng={lng} />,
                        document.querySelector('.report-container')
                );
            break;
        case 'environment':
            var environmentInfo = ReactDOM.render(
                        <EnvironmentComponent lat={lat} lng={lng} pid={pid} gid={Number(gid)} />,
                        document.querySelector('.report-container')
                );
            break;
    }
};

module.exports = questionRun;
