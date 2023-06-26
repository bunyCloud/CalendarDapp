// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CalendarOne {
    
    struct CalendarEvent {
        string title;     // title of event
        address organizer; // event organizer's address
        uint startTime;   // start time ie. 1687393537 Thu Jun 22 2023 00:25:37
        uint endTime;     // end time ie. 1687739137 Mon Jun 26 2023 00:25:37
        uint created; //  event created date time
        string metadataURI; // IPFS metadata or JSON file URL
        address[] invitedAttendees; // array of invited addresses
        address[] confirmedAttendees; // array of confirmed addresses
    }

    // Define all events by all users
    struct AllEvents {
        address user; // event creator address
        CalendarEvent[] events; // array of all events created
    }

    string public calendarName = "Calendar One";
    mapping(address => CalendarEvent[]) public userEvents;
    address[] public users; // Array to keep track of all users
    address[] public eventCreators; // Array to keep track of all event creators
    mapping(address => uint) public eventCount; // Mapping to keep track of the number of events per user
    mapping(uint => address[]) public eventInvitations; // Mapping of event ID to invited users
    uint public totalEvents; // Count of all events created

    event NewEventCreated(string title, address organizer, uint startTime, uint endTime, string metadataURI, uint timestamp);
    event EventUpdated(uint eventID, string title, address organizer, uint startTime, uint endTime, string metadataURI, uint timestamp);
    event UserInvited(uint eventID, string title,  address invitedUser);
    event InvitationAccepted(uint eventID, address attendee);

    function createTelosCalendarEvent(string memory title, uint startTime, uint endTime, string memory metadataURI, address[] memory invitees) public {
        CalendarEvent memory newEvent;
        newEvent.title = title; // title of event
        newEvent.startTime = startTime; // unix start time ie. 1687398249 =  Thu Jun 22 2023 01:44:09
        newEvent.endTime = endTime; // unix end time ie. 1687743849 = Mon Jun 26 2023 01:44:09
        newEvent.organizer = msg.sender;  // account address 
        newEvent.created = block.timestamp; // created timestamp
        newEvent.metadataURI = metadataURI; // metadata URI ie. IPFS cid or URL to JSON file
        newEvent.invitedAttendees = invitees; // account addresses invited to event
        // Adding the event to the organizer's list of events
        userEvents[msg.sender].push(newEvent); // push data to struct
        uint eventID = userEvents[msg.sender].length - 1; // assign ID to each event
        totalEvents++; // Increment total event count
        // Adding user to the users list
        if (userEvents[msg.sender].length == 1) { // this means it's the user's first event
            users.push(msg.sender);
            eventCreators.push(msg.sender); // Add the creator to the list of event creators
        }
        eventCount[msg.sender]++; // Update the count of events for the creator
        // Invite users to the event
        for (uint i = 0; i < invitees.length; i++) {
            eventInvitations[eventID].push(invitees[i]); // push invitees to struct
            emit UserInvited(eventID, title, invitees[i]);
        }

        emit NewEventCreated(title, msg.sender, startTime, endTime, metadataURI, block.timestamp);
    }

   function acceptInvitation(uint eventID) public {
    // Ensure we have an address for this event ID
    require(eventID < eventCreators.length, "Invalid event ID");
    address eventCreator = eventCreators[eventID];
    CalendarEvent[] storage events = userEvents[eventCreator];
    // Ensure the event exists for this user
    require(eventID < events.length, "Invalid event ID for this user");
    // Check if user is invited
    bool isInvited = false;
    for (uint i = 0; i < events[eventID].invitedAttendees.length; i++) {
        if (events[eventID].invitedAttendees[i] == msg.sender) {
            isInvited = true;
            break;
        }
    }
    require(isInvited, "You are not invited to this event");
    // add the address to the confirmed attendees list
    events[eventID].confirmedAttendees.push(msg.sender);
    emit InvitationAccepted(eventID, msg.sender);
}


  function updateEvent(uint eventID, string memory title, uint startTime, uint endTime, string memory metadataURI) public {
        // Check that the eventID is valid for the user
        require(eventID < userEvents[msg.sender].length, "Invalid event ID");
        // Update the event
        CalendarEvent storage eventToUpdate = userEvents[msg.sender][eventID];
        eventToUpdate.title = title; // title to update
        eventToUpdate.startTime = startTime; // update start time
        eventToUpdate.endTime = endTime;
        eventToUpdate.metadataURI = metadataURI; // change metadata url
        emit EventUpdated(eventID, title, msg.sender, startTime, endTime, metadataURI, block.timestamp);
    }

    // Fetch user calendar events
    function getUserEvents(address user) public view returns (CalendarEvent[] memory) {
        return userEvents[user];
    }

    // Fetch all users' events
    function getAllUsersEvents() public view returns (AllEvents[] memory) {
        AllEvents[] memory allUsersEvents = new AllEvents[](users.length);

        for (uint i = 0; i < users.length; i++) {
            allUsersEvents[i] = AllEvents({
                user: users[i],
                events: getUserEvents(users[i])
            });
        }

        return allUsersEvents;
    }
}
