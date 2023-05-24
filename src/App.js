import './App.css';
import { Calender } from './Calender/calender';
import { MockEvents } from './Calender/const';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : MockEvents;
  });

  // const [events, setEvents] = useState(MockEvents);
  // useEffect(() => {
  //   localStorage.setItem('events', JSON.stringify(events));
  //   events.forEach((event) => {
  //     const [hours, minutes] = event.reminderTime.split(":").map(Number);
  //     const reminderTime = new Date(
  //       parseInt(event.date.slice(0, 4)),   // Year
  //       parseInt(event.date.slice(5, 7)) - 1,   // Month (0-based)
  //       parseInt(event.date.slice(8, 10)),  // Day
  //       // parseInt(event.date.slice(14, 16)),  // Minutes
  //       // parseInt(event.date.slice(17, 19)),  // Seconds
  //       // parseInt(event.date.slice(20, 23))   // Milliseconds
  //     );
  //     reminderTime.setHours(hours);
  //     reminderTime.setMinutes(minutes);

  //     if (reminderTime > new Date()) {
  //       const timeUntilEvent = reminderTime.getTime() - Date.now();
  //       setTimeout(() => {
  //         console.log(event.title);
  //       }, timeUntilEvent);
  //     }
  //   });
  // }, [events]);
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
    const timeouts = []; // Array to store the setTimeout identifiers
  
    events.forEach((event) => {
      const [hours, minutes] = event.reminderTime.split(":").map(Number);
      const reminderTime = new Date(
        parseInt(event.date.slice(0, 4)),   // Year
        parseInt(event.date.slice(5, 7)) - 1,   // Month (0-based)
        parseInt(event.date.slice(8, 10)),  // Day
      );
      reminderTime.setHours(hours);
      reminderTime.setMinutes(minutes);
  
      if (reminderTime > new Date()) {
        const timeUntilEvent = reminderTime.getTime() - Date.now();
  
        const timeoutId = setTimeout(() => {
          toast.info(event.title + "\nReminder");
          // Perform other actions for the event reminder
  
          // Remove the timeout identifier from the array
          const index = timeouts.indexOf(timeoutId);
          if (index > -1) {
            timeouts.splice(index, 1);
          }
        }, timeUntilEvent);
  
        // Store the timeout identifier in the array
        timeouts.push(timeoutId);
      }
    });
  
    // Cleanup function to clear any remaining timeouts
    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [events]);


  const addEvent = (data, date) => {
    console.log(data, date);
    // saving date 
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // converting time from string to ISOstring
    // const userInput = data.reminderTime;
    // const [hours, minutes] = userInput.split(":").map(Number);
    // const reminderTime = utcDate;
    // reminderTime.setUTCHours(hours);
    // reminderTime.setUTCMinutes(minutes);
    // reminderTime.setUTCSeconds(0);
    // const reminderTimeUtcString = reminderTime.toISOString();
    // console.log(reminderTimeUtcString);
    // if(text!= null && text != ""){
    setEvents(prev => [...prev, { date: utcDate.toISOString(), title: data.title, desc: data.desc, reminderTime: data.reminderTime }]);
    // }
  }

  const editEvent = (eventToBeEdited, newData) => {

    setEvents((prev) =>
      prev.map((event) =>
        event === eventToBeEdited
          ? { ...event, title: newData.title, desc: newData.desc, reminderTime: newData.reminderTime }
          : event
      )
    );
  }

  const removeEvent = (eventToBeDeleted) => {
    // const confirmed = window.confirm('Are you sure you want to remove this event?');
    // if (confirmed) {
    setEvents(prev => prev.filter(event => event.title !== eventToBeDeleted.title || event.date !== eventToBeDeleted.date || event.reminderTime !== eventToBeDeleted.reminderTime));
    // }
  };

  return (
    <div className="App">
      <ToastContainer />
      <Calender startingDate={new Date()} eventsArr={events} addEvent={addEvent} editEvent={editEvent} removeEvent={removeEvent} />
    </div>
  );
}

export default App;
