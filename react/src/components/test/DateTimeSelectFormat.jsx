import DateSelector from '../../utils/DateSelector'
import TimeSelector from '../../utils/TimeSelector'

export default function DateTimeSelectFormat() {
  const [startTime, setStartTime] = useState('') // Default to an empty string
  const [endTime, setEndTime] = useState('')
  const [currentToastId, setCurrentToastId] = useState(null)

  const [selectedStartTime, setSelectedStartTime] = useState(null)
  const [selectedEndTime, setSelectedEndTime] = useState(null)


  
  const handleDateRangeSave = (startDate, endDate) => {
    // Handle the selected startTime and endTime here
    console.log('Start Time:', startDate);
    console.log('End Time:', endDate);
  };


  // input start time
  const handleStartTimeChange = (time) => {
    setSelectedStartTime(time)
    // Do any additional processing or state updates as needed
  }

  //input end time
  const handleEndTimeChange = (time) => {
    setSelectedEndTime(time)
    // Do any additional processing or state updates as needed
  }


  const handleCreateEvent = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(displayCalendar, CalendarDailyTelos.abi, signer)
    const inviteesArray = invitees.split(',').map((item) => item.trim())
    const startTimestamp = Math.floor(startTime.getTime() / 1000)
    const endTimestamp = Math.floor(endTime.getTime() / 1000)

    const transaction = await contract.createEvent(title, description, startTimestamp, endTimestamp, imageUrl, inviteesArray)
  }

  return (
    <>
      <FormControl id="startTime">
        <FormLabel>Date Range</FormLabel>
        <DateSelector onSave={handleDateRangeSave} />
      </FormControl>

      <FormControl id="endTime">
        <FormLabel>Event Times</FormLabel>
        <TimeSelector onStartTimeChange={handleStartTimeChange} onEndTimeChange={handleEndTimeChange} />
      </FormControl>
    </>
  )
}
