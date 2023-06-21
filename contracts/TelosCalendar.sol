// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './CalendarFactory.sol';

contract TelosCalendar {
    address  public owner;
    string public calendarName;
    CalendarFactory private _factory;



    struct TelosCalendarEvent {
    string title;     // title of the promo slot
    address attendee; // person you are meeting
    uint startTime;   // start time of promo slot
    uint endTime;     // end time of the promo slot
    }

    TelosCalendarEvent[] telosCalendarEvents;
    event NewEventCreated(string title, address attendee, uint startTime, uint endTime);


    constructor(string memory _calendarName) {
        calendarName = _calendarName;
        _factory = CalendarFactory(msg.sender);
        owner = msg.sender;
    }

     modifier onlyOwner() {
    require(msg.sender == owner, 'Only the contract owner may call this function');
    _;
  }


    // when returning string needs to allocate temporary place to store data
    // we do this with the memory keyword in Solidity
    function getTelosCalendarEvents() public view returns (TelosCalendarEvent[] memory) {
        return telosCalendarEvents;
    }

    function createTelosCalendarEvent(string memory title, uint startTime, uint endTime) public onlyOwner {
        TelosCalendarEvent memory telosCalendarEvent;
        telosCalendarEvent.title = title;
        telosCalendarEvent.startTime = startTime;
        telosCalendarEvent.endTime = endTime;
        telosCalendarEvent.attendee = msg.sender; // address of person calling contract
        telosCalendarEvents.push(telosCalendarEvent);
        emit NewEventCreated(title, msg.sender, startTime, endTime);

    }

function getTelosCalendarEventTitles() public view returns (string[] memory) {
    string[] memory titles = new string[](telosCalendarEvents.length);
    for (uint i = 0; i < telosCalendarEvents.length; i++) {
        titles[i] = telosCalendarEvents[i].title;
    }
    return titles;
}

function getTelosCalendarEventAttendees() public view returns (address[] memory) {
    address[] memory attendees = new address[](telosCalendarEvents.length);
    for (uint i = 0; i < telosCalendarEvents.length; i++) {
        attendees[i] = telosCalendarEvents[i].attendee;
    }
    return attendees;
}

function getTelosCalendarEventStartTimes() public view returns (uint[] memory) {
    uint[] memory startTimes = new uint[](telosCalendarEvents.length);
    for (uint i = 0; i < telosCalendarEvents.length; i++) {
        startTimes[i] = telosCalendarEvents[i].startTime;
    }
    return startTimes;
}

function getTelosCalendarEventEndTimes() public view returns (uint[] memory) {
    uint[] memory endTimes = new uint[](telosCalendarEvents.length);
    for (uint i = 0; i < telosCalendarEvents.length; i++) {
        endTimes[i] = telosCalendarEvents[i].endTime;
    }
    return endTimes;
}

 
}
