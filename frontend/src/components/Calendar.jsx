import { useState } from 'react';
import './Calendar.css';

function Calendar({ selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };
  
  const days = getDaysInMonth(currentMonth);
  
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };
  
  const events = [
    { day: 7, title: 'Monday Standup 9:00 AM', color: '#ffcae6', borderColor: '#ffb5dc', textColor: '#ff7070' },
    { day: 7, title: 'Meeting with O... 11:00 AM', color: '#a19eff', borderColor: '#8783ff', textColor: '#594dff' },
    { day: 7, title: 'Meeting with Si... 1:00 PM', color: '#b0f0fb', borderColor: '#66e9ff', textColor: '#0085d8' }
  ];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="calendar-controls">
          <button className="month-view-btn">
            <span>Month view</span>
            <svg width="7" height="14" viewBox="0 0 7 14" fill="none">
              <path d="M1 1L6 7L1 13" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-header-days">
          {dayNames.map(day => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
        </div>
        
        <div className="calendar-body">
          {Array.from({ length: 6 }, (_, weekIndex) => (
            <div key={weekIndex} className="calendar-week">
              {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                <div key={dayIndex} className="calendar-day">
                  {day && (
                    <>
                      <span className="day-number">{day}</span>
                      {events.filter(event => event.day === day).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="calendar-event"
                          style={{
                            backgroundColor: event.color,
                            borderColor: event.borderColor,
                            color: event.textColor
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
