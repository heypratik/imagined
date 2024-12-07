import React, { forwardRef } from "react";
import {
  eachDayOfInterval,
  format,
  isWeekend,
  lastDayOfMonth,
  eachMonthOfInterval,
  startOfDay,
  isSameDay,
  isBefore,
  isSameMonth,
  addMonths,
} from "date-fns";
import clsx from "clsx";

const PrevIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 fill-gray-400"
    viewBox="0 0 24 24"
  >
    <polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12" />
  </svg>
);

const NextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 fill-gray-400"
    viewBox="0 0 24 24"
  >
    <polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12" />
  </svg>
);

export const Datepicker = forwardRef<HTMLDivElement, any>(
  ({ locale, startDate, endDate, onChange, startValue, endValue, disabledDates }, ref) => {
    const DATES = React.useMemo(() => {
      const startMonth = startDate || new Date();
      const endMonth = endDate || addMonths(new Date(), 3);
      const months = eachMonthOfInterval({ start: startMonth, end: endMonth });

      return months.map((month, idx) => {
        const last = endDate && isSameMonth(month, endDate)
          ? endDate || month
          : lastDayOfMonth(month);
        const startDay = idx === 0 ? startDate || new Date() : month;
        const days = eachDayOfInterval({ start: startOfDay(startDay), end: startOfDay(last) });

        return { month, days };
      });
    }, [startDate, endDate]);

    const onDateClick = (selectedDate: Date) => {
      const isRangeFilled = startValue && endValue;
      const hasStartRange = startValue && !endValue;

      if (!startValue && !endValue) {
        onChange([selectedDate, null, null]);
      } else if (hasStartRange) {
        if (isSameDay(startValue, selectedDate)) {
          onChange([null, null, null]);
        } else {
          const range = eachDayOfInterval({
            start: startValue,
            end: selectedDate,
          });
          onChange([startValue, selectedDate, range]);
        }
      } else if (isRangeFilled) {
        onChange([selectedDate, null, null]);
      }
    };


React.useEffect(() => {
  if (containerRef.current && startValue) {
    const startIndex = DATES.findIndex(({ days }) =>
      days.some((day) => isSameDay(day, startValue))
    );

    if (startIndex !== -1) {
      const scrollAmount = startIndex * 1731;
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }
}, [DATES, startValue]);
    

    const containerRef = React.useRef<HTMLDivElement | null>(null);

    return (
      <div ref={ref} className="flex w-full bg-inherit py-7 px-4 rounded-b-2xl justify-center bg-white shadow">
        <button
          onClick={() =>
            containerRef.current?.scrollBy({ left: -400, behavior: "smooth" })
          }
          className="relative flex items-center justify-center bg-transparent mt-6 focus:outline-none"
        >
          <PrevIcon />
        </button>
        <div
          ref={containerRef}
          className="hidescroll flex overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {DATES.map(({ month, days }, idx) => {
            const _month = format(month, "LLLL", { locale });
            return (
              <div key={_month + idx} className="flex flex-col cursor-pointer">
                <div className="dateLabel sticky top-0 left-0 font-bold text-2xl ml-2">
                  {_month}
                </div>
                <div className="flex mt-2">
                  {days.map((d, idx) => {
                    const dayLabel = format(d, "EEEEEE", { locale });
                    const dateLabel = format(d, "dd", { locale });
                    const isDisabled = disabledDates?.some(
                      (date) => startOfDay(date).getTime() === startOfDay(d).getTime()
                    );
                    const isSelected =
                      startValue &&
                      (isSameDay(startValue, d) ||
                        (endValue && isSameDay(endValue, d)));
                    const inRange =
                      startValue &&
                      endValue &&
                      eachDayOfInterval({ start: startValue, end: endValue }).some(
                        (day) => isSameDay(day, d)
                      );

                    return (
                      <div
                        key={dayLabel + idx}
                        className={clsx(
                          "flex flex-col items-center justify-center m-1 p-4 text-sm rounded-lg",
                          isWeekend(d) && "text-red-500",
                          inRange && "bg-gray-200",
                          isSelected && "bg-blue-500 text-white !bg-black",
                          isDisabled && "opacity-30 cursor-not-allowed",
                          !isSelected && !isDisabled && "hover:bg-gray-100"
                        )}
                        onClick={() => !isDisabled && onDateClick(d)}
                      >
                        <div className={`text-xs text-gray-500 ${isSelected && "text-white"}`}>{dayLabel}</div>
                        <div className="font-bold text-base">{dateLabel}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() =>
            containerRef.current?.scrollBy({ left: 400, behavior: "smooth" })
          }
          className="relative flex items-center justify-center bg-transparent mt-6 focus:outline-none"
        >
          <NextIcon />
        </button>
      </div>
    );
  }
);


