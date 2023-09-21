// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import './CalendarFactory.sol';


contract CalendarDailyTelos is AccessControl {
    
    string public calendarName;
    address public calendarOwner;
    
    CalendarFactory private _factory;
    
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");
    bytes32 public constant GUEST_ROLE = keccak256("GUEST_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    address[] public users; 
    address[] public eventCreators;
    
    uint public totalEvents; 
    uint public adminCount;
    uint public memberCount; 
    uint public guestCount;
    
    mapping(address => uint) public eventCount; 
    mapping(address => Guest) public guests;
    mapping(address => Member) public members;
    mapping(address => Admin) public admins;

     event NewEventCreated(uint indexed eventID, string title, address indexed organizer, uint startTime, uint endTime, string metadataURI, uint timestamp, bytes32 role);
    
   

    struct Admin {
        address addr;
        uint[] eventIds;
    }
   
    struct Member {
        address addr;
        uint[] eventIds;
    }

    struct Guest {
        address addr;
        uint[] eventIds;
    }

   

    function revokeRole(bytes32 role, address account) public override onlyAdmin {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        super.revokeRole(role, account);
        if (!hasRole(ADMIN_ROLE, account) && hasRole(MEMBER_ROLE, account)) {
            revokeRole(MEMBER_ROLE, account);
            delete members[account];
            memberCount--;
        }
    }

    function grantRole(bytes32 role, address account) public override onlyAdmin {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        super.grantRole(role, account);
        if (role == MEMBER_ROLE) {
            members[account] = Member({
                addr: account,
                eventIds: new uint[](0)
            });
            memberCount++;
        } else if (role == GUEST_ROLE) {
            guestCount++;
        } 
    }

    function addMember(address memberAddress) public onlyAdmin {
        _setupRole(MEMBER_ROLE, memberAddress);
        members[memberAddress] = Member({
            addr: memberAddress,
            eventIds: new uint[](0)
        });
        memberCount++;
        if (!hasRole(GUEST_ROLE, memberAddress)) {
            _setupRole(GUEST_ROLE, memberAddress);
            guests[memberAddress] = Guest({
                addr: memberAddress,
                eventIds: new uint[](0)
            });
            guestCount++;
        }
        bool userExists = false;
        for (uint i = 0; i < users.length; i++) {
            if (users[i] == memberAddress) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            users.push(memberAddress);
        }
    }

    function addMembers(address[] memory memberAddresses) public onlyAdmin {
    for (uint i = 0; i < memberAddresses.length; i++) {
        address memberAddress = memberAddresses[i];
        _setupRole(MEMBER_ROLE, memberAddress);
        members[memberAddress] = Member({
            addr: memberAddress,
            eventIds: new uint[](0)
        });
        memberCount++;

        if (!hasRole(GUEST_ROLE, memberAddress)) {
            _setupRole(GUEST_ROLE, memberAddress);
            guests[memberAddress] = Guest({
                addr: memberAddress,
                eventIds: new uint[](0)
            });
            guestCount++;
        }

        bool userExists = false;
        for (uint j = 0; j < users.length; j++) {
            if (users[j] == memberAddress) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            users.push(memberAddress);
        }
    }
}


 function addAdmins(address[] memory adminAddresses) public onlyAdmin {
    for (uint i = 0; i < adminAddresses.length; i++) {
        address adminAddress = adminAddresses[i];
        _setupRole(ADMIN_ROLE, adminAddress);
        admins[adminAddress] = Admin({
            addr: adminAddress,
            eventIds: new uint[](0)
        });
        adminCount++;

        if (!hasRole(MEMBER_ROLE, adminAddress)) {
            _setupRole(MEMBER_ROLE, adminAddress);
            members[adminAddress] = Member({
                addr: adminAddress,
                eventIds: new uint[](0)
            });
            memberCount++;
        }

        bool userExists = false;
        for (uint j = 0; j < users.length; j++) {
            if (users[j] == adminAddress) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            users.push(adminAddress);
        }
    }
}


    function addGuest(address guestAddress) public {
        _setupRole(GUEST_ROLE, guestAddress);
        guests[guestAddress] = Guest({
            addr: guestAddress,
            eventIds: new uint[](0)
        });
        guestCount++;
        bool userExists = false;
        for (uint i = 0; i < users.length; i++) {
            if (users[i] == guestAddress) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            users.push(guestAddress);
        }
    }

    function removeMember(address memberAddress) public onlyAdmin {
        revokeRole(MEMBER_ROLE, memberAddress);
        delete members[memberAddress];
        memberCount--;
    }

   
  

    function deleteEvent(uint eventID) public {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not a admin");
        if (hasRole(ADMIN_ROLE, msg.sender)) {
            require(eventID < memberEvents[msg.sender].length, "Invalid event ID");
            CalendarEvent[] storage events = memberEvents[msg.sender];
                        delete events[eventID];
        } 
    }
}
