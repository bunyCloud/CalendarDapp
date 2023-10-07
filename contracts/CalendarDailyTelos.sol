// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./CalendarFactory.sol";

contract CalendarDailyTelos is AccessControl {
    string public calendarName;
    address public calendarOwner;

    CalendarFactory private _factory;

    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");
    bytes32 public constant GUEST_ROLE = keccak256("GUEST_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address[] public users;
    address[] public eventCreators;
    uint256 public totalEvents;
    uint256 public adminCount;
    uint256 public memberCount;
    uint256 public guestCount;

    mapping(address => uint256) public eventCount;
    mapping(address => Invitation) public userInvitations;
    mapping(address => Guest) public guests;
    mapping(address => Member) public members;
    mapping(address => Admin) public admins;
    mapping(uint256 => CalendarEvent) public eventsById;
    mapping(address => CalendarEvent[]) public userEvents;
    mapping(address => CalendarEvent[]) public guestEvents;
    mapping(address => CalendarEvent[]) public adminEvents;
    mapping(address => CalendarEvent[]) public memberEvents;
    mapping(uint256 => address[]) public eventInvitations;

    event NewEventCreated(
        uint256 indexed eventID,
        string title,
        address indexed organizer,
        uint256 startTime,
        uint256 endTime,
        string metadataURI,
        uint256 timestamp,
        bytes32 role
    );

    struct CalendarEvent {
        uint256 eventId;
        string title;
        string description;
        address organizer;
        uint256 startTime;
        uint256 endTime;
        uint256 created;
        string metadataURI;
        address[] invitedAttendees;
        address[] confirmedAttendees;
    }

    struct Admin {
        address addr;
        uint256[] eventIds;
    }

    struct Member {
        address addr;
        uint256[] eventIds;
    }

    struct Guest {
        address addr;
        uint256[] eventIds;
    }

    struct Invitation {
        address userAddress;
        uint256[] eventIDs;
    }

    constructor(string memory _calendarName, address _owner) {
        calendarName = _calendarName;
        calendarOwner = _owner;
        _factory = CalendarFactory(msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, calendarOwner);
        _setupRole(ADMIN_ROLE, calendarOwner);
        _setupRole(ADMIN_ROLE, address(this));
        admins[calendarOwner] = Admin({
            addr: calendarOwner,
            eventIds: new uint256[](0)
        });
        adminCount++;
            if (!userExistsInArray(calendarOwner)) {
        users.push(calendarOwner);
    }

    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    modifier onlyMember() {
        require(hasRole(MEMBER_ROLE, msg.sender), "Caller is not a member");
        _;
    }

    function revokeRole(bytes32 role, address account)
        public
        override
        onlyAdmin
    {
        super.revokeRole(role, account);
        if (
            role == ADMIN_ROLE &&
            !hasRole(ADMIN_ROLE, account) &&
            hasRole(MEMBER_ROLE, account)
        ) {
            revokeRole(MEMBER_ROLE, account);
            delete members[account];
            memberCount--;
        }
    }

    function grantRole(bytes32 role, address account)
        public
        override
        onlyAdmin
    {
        super.grantRole(role, account);

        if (role == MEMBER_ROLE && members[account].addr == address(0)) {
            members[account] = Member({
                addr: account,
                eventIds: new uint256[](0)
            });
            memberCount++;
        } else if (role == GUEST_ROLE && guests[account].addr == address(0)) {
            guests[account] = Guest({
                addr: account,
                eventIds: new uint256[](0)
            });
            guestCount++;
        } else if (role == ADMIN_ROLE && admins[account].addr == address(0)) {
            admins[account] = Admin({
                addr: account,
                eventIds: new uint256[](0)
            });
            adminCount++;
        }

        // Check if user exists in the users array and push if not
        bool userExists = false;
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == account) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            users.push(account);
        }
    }

    function addMember(address memberAddress) public onlyAdmin {
        require(
            !hasRole(MEMBER_ROLE, memberAddress),
            "Address is already a member"
        );

        grantRole(MEMBER_ROLE, memberAddress); // Use grantRole for MEMBER_ROLE

        if (!hasRole(GUEST_ROLE, memberAddress)) {
            grantRole(GUEST_ROLE, memberAddress); // Use grantRole for GUEST_ROLE
        }
    }

    function userExistsInArray(address userAddress)
        private
        view
        returns (bool)
    {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == userAddress) {
                return true;
            }
        }
        return false;
    }

    function addMembers(address[] memory memberAddresses) public onlyAdmin {
        for (uint256 i = 0; i < memberAddresses.length; i++) {
            address memberAddress = memberAddresses[i];

            grantRole(MEMBER_ROLE, memberAddress); // Use grantRole for MEMBER_ROLE

            if (!hasRole(GUEST_ROLE, memberAddress)) {
                grantRole(GUEST_ROLE, memberAddress); // Use grantRole for GUEST_ROLE
                guests[memberAddress] = Guest({
                    addr: memberAddress,
                    eventIds: new uint256[](0)
                });
                guestCount++;
            }

            if (!userExistsInArray(memberAddress)) {
                users.push(memberAddress);
            }
        }
    }

  function addGuest() public {
    address guestAddress = msg.sender; // The caller becomes the guest

    require(
        !hasRole(GUEST_ROLE, guestAddress),
        "Address is already a guest"
    ); // Check if not already a guest

    // Granting the GUEST_ROLE to the caller without calling grantRole
    _setupRole(GUEST_ROLE, guestAddress);

    // The rest remains the same
    guests[guestAddress] = Guest({
        addr: guestAddress,
        eventIds: new uint256[](0)
    });
    guestCount++;

    if (!userExistsInArray(guestAddress)) {
        users.push(guestAddress);
    }
}

    function getAddressesByRole(bytes32 role)
        public
        view
        returns (address[] memory)
    {
        address[] memory addressesTemp = new address[](users.length); // Create a temporary array with max possible size
        uint256 count = 0;

        for (uint256 i = 0; i < users.length; i++) {
            if (hasRole(role, users[i])) {
                addressesTemp[count] = users[i];
                count++;
            }
        }
        address[] memory roleAddresses = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            roleAddresses[i] = addressesTemp[i];
        }

        return roleAddresses;
    }

    function removeMember(address memberAddress) public onlyAdmin {
        revokeRole(MEMBER_ROLE, memberAddress);
        delete members[memberAddress];
        memberCount--;
    }

    function getEventById(uint256 eventId)
        public
        view
        returns (CalendarEvent memory)
    {
        for (uint256 i = 0; i < eventCreators.length; i++) {
            CalendarEvent[] storage events;
            if (hasRole(MEMBER_ROLE, eventCreators[i])) {
                events = memberEvents[eventCreators[i]];
            } else if (hasRole(GUEST_ROLE, eventCreators[i])) {
                events = guestEvents[eventCreators[i]];
            } else if (hasRole(ADMIN_ROLE, eventCreators[i])) {
                events = adminEvents[eventCreators[i]];
            } else {
                continue;
            }
            for (uint256 j = 0; j < events.length; j++) {
                if (events[j].eventId == eventId) {
                    return events[j];
                }
            }
        }
        revert("Event not found");
    }

    function getAdminEvents(address adminAddress)
        public
        view
        returns (CalendarEvent[] memory)
    {
        return adminEvents[adminAddress];
    }

    function getMemberEvents(address memberAddress)
        public
        view
        returns (CalendarEvent[] memory)
    {
        return memberEvents[memberAddress];
    }

    function getGuestEvents(address guestAddress)
        public
        view
        returns (CalendarEvent[] memory)
    {
        require(hasRole(GUEST_ROLE, guestAddress), "Caller is not a guest");
        return guestEvents[guestAddress];
    }

    function _getEventsByAddresses(bytes32 role, address[] memory roleAddresses)
        private
        view
        returns (CalendarEvent[] memory)
    {
        uint256 totalEvents = 0;
        for (uint256 i = 0; i < roleAddresses.length; i++) {
            if (hasRole(role, roleAddresses[i])) {
                if (role == ADMIN_ROLE || role == MEMBER_ROLE) {
                    totalEvents += memberEvents[roleAddresses[i]].length;
                } else if (role == GUEST_ROLE) {
                    totalEvents += guestEvents[roleAddresses[i]].length;
                }
            }
        }

        CalendarEvent[] memory allEvents = new CalendarEvent[](totalEvents);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < roleAddresses.length; i++) {
            if (hasRole(role, roleAddresses[i])) {
                CalendarEvent[] storage eventsForAddress = (role ==
                    ADMIN_ROLE ||
                    role == MEMBER_ROLE)
                    ? memberEvents[roleAddresses[i]]
                    : guestEvents[roleAddresses[i]];
                for (uint256 j = 0; j < eventsForAddress.length; j++) {
                    allEvents[currentIndex] = eventsForAddress[j];
                    currentIndex++;
                }
            }
        }
        return allEvents;
    }

    // Consolidated function to get events based on role
    function getEventsByRole(bytes32 role)
        public
        view
        returns (CalendarEvent[] memory)
    {
        require(
            role == ADMIN_ROLE || role == MEMBER_ROLE || role == GUEST_ROLE,
            "Invalid role provided"
        );
        return _getEventsByAddresses(role, users);
    }

    function getAllEvents() public view returns (CalendarEvent[] memory) {
        CalendarEvent[] memory adminEventsData = getEventsByRole(ADMIN_ROLE);
        CalendarEvent[] memory memberEventsData = getEventsByRole(MEMBER_ROLE);
        CalendarEvent[] memory guestEventsData = getEventsByRole(GUEST_ROLE);
        uint256 combinedTotalEvents = adminEventsData.length +
            memberEventsData.length +
            guestEventsData.length;
        CalendarEvent[] memory allEvents = new CalendarEvent[](
            combinedTotalEvents
        );
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < adminEventsData.length; i++) {
            allEvents[currentIndex] = adminEventsData[i];
            currentIndex++;
        }
        for (uint256 i = 0; i < memberEventsData.length; i++) {
            allEvents[currentIndex] = memberEventsData[i];
            currentIndex++;
        }
        for (uint256 i = 0; i < guestEventsData.length; i++) {
            allEvents[currentIndex] = guestEventsData[i];
            currentIndex++;
        }
        return allEvents;
    }

    function addInvitation(address userAddress, uint256 eventID) internal {
        Invitation storage invitation = userInvitations[userAddress];
        invitation.userAddress = userAddress;
        invitation.eventIDs.push(eventID);
    }

    function getInvitations(address userAddress)
        public
        view
        returns (uint256[] memory)
    {
        Invitation storage invitation = userInvitations[userAddress];
        return invitation.eventIDs;
    }

    function includes(address[] memory array, address element)
        internal
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == element) {
                return true;
            }
        }
        return false;
    }

    function acceptInvitation(uint256 eventID) public {
        require(
            hasRole(MEMBER_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender),
            "Only members or admins can accept invitations"
        );
        uint256[] memory invitedEvents = getInvitations(msg.sender);
        bool isInvited = false;
        for (uint256 i = 0; i < invitedEvents.length; i++) {
            if (invitedEvents[i] == eventID) {
                isInvited = true;
                break;
            }
        }
        require(isInvited, "You are not invited to this event");
        CalendarEvent storage calendarEvent = eventsById[eventID];
        calendarEvent.confirmedAttendees.push(msg.sender);
    }

    function updateEvent(
        uint256 eventID,
        string memory title,
        uint256 startTime,
        uint256 endTime,
        string memory metadataURI
    ) public {
        require(
            hasRole(ADMIN_ROLE, msg.sender) ||
                eventsById[eventID].organizer == msg.sender,
            "Caller is not an admin or the event owner"
        );
        require(eventID < totalEvents, "Invalid event ID");
        CalendarEvent storage eventToUpdate = eventsById[eventID];
        eventToUpdate.title = title;
        eventToUpdate.startTime = startTime;
        eventToUpdate.endTime = endTime;
        eventToUpdate.metadataURI = metadataURI;
    }

    function createEvent(
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        string memory metadataURI,
        address[] memory invitees
    ) public {
        require(bytes(title).length > 0, "Event title must not be empty");
        require(startTime < endTime, "Invalid event times");
        if (
            !hasRole(MEMBER_ROLE, msg.sender) &&
            !hasRole(ADMIN_ROLE, msg.sender) &&
            !hasRole(GUEST_ROLE, msg.sender)
        ) {
            addGuest();
            guestCount++;
        }
        CalendarEvent memory newEvent;
        newEvent.eventId = totalEvents + 1;
        newEvent.title = title;
        newEvent.description = description;
        newEvent.startTime = startTime;
        newEvent.endTime = endTime;
        newEvent.organizer = msg.sender;
        newEvent.created = block.timestamp;
        newEvent.metadataURI = metadataURI;
        newEvent.invitedAttendees = invitees;
        newEvent.confirmedAttendees = new address[](0);
        if (
            hasRole(MEMBER_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender)
        ) {
            memberEvents[msg.sender].push(newEvent);
            members[msg.sender].eventIds.push(newEvent.eventId);
        } else {
            userEvents[msg.sender].push(newEvent);
            guestEvents[msg.sender].push(newEvent);
            guests[msg.sender].eventIds.push(newEvent.eventId);
        }
        uint256 eventID = newEvent.eventId;
        totalEvents++;
        eventCreators.push(msg.sender);
        for (uint256 i = 0; i < invitees.length; i++) {
            address invitee = invitees[i];
            eventInvitations[eventID].push(invitee);
            addInvitation(invitee, eventID);
        }
        bytes32 userRole = MEMBER_ROLE;
        if (hasRole(ADMIN_ROLE, msg.sender)) {
            userRole = ADMIN_ROLE;
        } else if (hasRole(GUEST_ROLE, msg.sender)) {
            userRole = GUEST_ROLE;
        }
        emit NewEventCreated(
            eventID,
            title,
            msg.sender,
            startTime,
            endTime,
            metadataURI,
            block.timestamp,
            userRole
        );
    }

    function deleteEvent(uint256 eventID) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not a admin");
        if (hasRole(ADMIN_ROLE, msg.sender)) {
            require(
                eventID < memberEvents[msg.sender].length,
                "Invalid event ID"
            );
            CalendarEvent[] storage events = memberEvents[msg.sender];
            delete events[eventID];
        }
    }
}
