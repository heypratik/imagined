"use client";
import React, { useState } from "react";
import { Datepicker, DatepickerEvent } from "./Datepicker";
import { enUS } from "date-fns/locale";

export function CalendarStrip({handleSave}) {
  const [date, setDate] = useState<{
    startValue: Date | null;
  }>({
    startValue: new Date(),
  });



  const handleChange = (d: DatepickerEvent) => {
    const [startValue] = d;
    setDate({ startValue });
    handleSave({startValue});
  };


  return (
    <Datepicker
      onChange={handleChange}
      locale={enUS}
      startValue={date.startValue}
      endValue={date.startValue}
      startDate={new Date(new Date().setMonth(new Date().getMonth() - 5))}
    />
  );
}