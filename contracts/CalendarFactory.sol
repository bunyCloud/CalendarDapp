
import "./TelosCalendar.sol";

contract CalendarFactory {
    string public contractName = 'The Daily Telos: Calendar Factory';
    address[] public calendars;
    address public owner;
    mapping(address => Deployer) public deployers;

    event CalendarCreated(string calendarName, address owner, address calendarAddress);

    struct Deployer {
        address deployer;
        uint timestamp;
        address calendarAddress;
        string calendarName;
    }

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only the contract owner may call this function');
        _;
    }

    function createTelosCalendar(string memory _calendarName) public {
        TelosCalendar tc = new TelosCalendar(_calendarName);
        calendars.push(address(tc));
        deployers[address(tc)] = Deployer(msg.sender, block.timestamp, address(tc), _calendarName);
        
        emit CalendarCreated(_calendarName, msg.sender, address(tc));
    }

    function getCalendars() public view returns(address[] memory) {
        return calendars;
    }

    function getDeployer(address calendarAddress) public view returns (address, uint, address, string memory) {
        Deployer memory deployer = deployers[calendarAddress];
        return (deployer.deployer, deployer.timestamp, deployer.calendarAddress, deployer.calendarName);
    }
}
