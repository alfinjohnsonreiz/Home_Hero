export function generateRecurrenceDates(
  startDate: Date,
  frequency: "weekly" | "monthly",
  interval: number,
  endDate: Date
): string[] {
  const dates: string[] = [];
  let nextDate = new Date(startDate);
  const end = new Date(endDate); // convert endDate to Date object here

  console.log(
    "generateRecurrenceDates called with:",
    startDate,
    frequency,
    interval,
    endDate
  );

  while (nextDate <= end) {
    const dateStr = nextDate.toISOString().split("T")[0];
    console.log("Adding recurrence date:", dateStr);
    dates.push(dateStr);
    if (frequency === "weekly") {
      nextDate.setDate(nextDate.getDate() + interval * 7);
    } else {
      nextDate.setMonth(nextDate.getMonth() + interval);
    }
  }

  console.log("Generated recurrence dates:", dates);
  return dates;
}
