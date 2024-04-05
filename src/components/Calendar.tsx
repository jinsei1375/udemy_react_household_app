import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from "@fullcalendar/core/locales/ja"
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import "../calendar.css"
import { calculatateDailyBalances } from '../utils/financeCalculataions'
import { Balance, CalendarContent, Transaction } from '../types'
import { formatCurrency } from '../utils/formatting'
import interactionPlugin from '@fullcalendar/interaction';
import { DateClickArg } from '@fullcalendar/interaction';

interface CalendarProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>,
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>,
}

const Calendar = ({monthlyTransactions, setCurrentMonth, setCurrentDay}:CalendarProps) => {

  const events = [
    {title: 'Meeting', start: "2024-04-04"},
    {title: 'Meeting', start: "2024-04-04", income: 300, expense: 400, balance: -100},
  ]

  const renderEventContent = (eventInfo: EventContentArg) => {
    console.log(eventInfo);
    return (
      <div>
        <div className='money' id='event-income'>
          {eventInfo.event.extendedProps.income}
        </div>
        <div className='money' id='event-expense'>
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className='money' id='event-balance'>
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    )
  }

   // FullCalendar表示のためのイベント生成
  const createCalendarEvents = (dailyBalances: Record<string, Balance>): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const {income, expense, balance} = dailyBalances[date]
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance)
      }
    })
  }

  // 日付ごとの収支
  const dailyBalances = calculatateDailyBalances(monthlyTransactions);
  const calendarEvents = createCalendarEvents(dailyBalances);

  const handleDateSet = (dateSetInfo:DatesSetArg) => {
    setCurrentMonth(dateSetInfo.view.currentStart)
  }

  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
  }

  return (
    <FullCalendar 
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      events={calendarEvents}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={handleDateClick}
    />
  )
}

export default Calendar