import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BatchAttendance({ defaultAttendance = true }) {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [practicalDates, setPracticalDates] = useState(
    Array(16).fill({ date: "", startTime: "", endTime: "" })
  );

  // Generate a list of all valid times (15-minute intervals between 9:00 and 16:00)
  const allTimes = [];
  for (let hour = 9; hour <= 16; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;
      if (hour === 16 && minute > 0) break; // Stop at 4:00
      allTimes.push(timeString);
    }
  }

  const handleDateTimeChange = (index, field, value) => {
    setPracticalDates((prev) => {
      const newDates = [...prev];
      newDates[index] = { ...newDates[index], [field]: value };
      return newDates;
    });
  };

  const toggleAttendance = (studentIndex, dateIndex) => {
    const { date, startTime, endTime } = practicalDates[dateIndex];
    if (!date || !startTime || !endTime) {
      alert("Please enter date, start time, and end time first");
      return;
    }

    setStudents((prevStudents) => {
      const newStudents = [...prevStudents];
      const student = { ...newStudents[studentIndex] };
      const attendance = [...student.attendance];
      attendance[dateIndex] =
        attendance[dateIndex] === null ? true : !attendance[dateIndex];
      student.attendance = attendance;
      newStudents[studentIndex] = student;
      return newStudents;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[95%] mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#155E95] hover:text-[#0f4a75] mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Batch Details
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#155E95] px-6 py-4">
            <h1 className="text-xl font-bold text-white">
              Laboratory Attendance Record - Batch {batchId}
            </h1>
            <p className="text-white text-sm mt-1 opacity-80">
              Academic Year: 2023-2024 | Semester: II
            </p>
          </div>

          <div className="p-6 overflow-x-auto relative">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border sticky left-0 bg-gray-50 z-20"
                    style={{ width: "80px" }}
                  >
                    Roll No
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border sticky left-[80px] bg-gray-50 z-20"
                    style={{ width: "200px" }}
                  >
                    Name of the Student
                  </th>
                  {practicalDates.map((_, index) => (
                    <th key={index} className="border min-w-[180px]">
                      <div className="px-2 py-2">
                        <input
                          type="date"
                          value={practicalDates[index].date}
                          onChange={(e) =>
                            handleDateTimeChange(index, "date", e.target.value)
                          }
                          className="block w-full text-xs rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] mb-1"
                        />
                        <select
                          value={practicalDates[index].startTime}
                          onChange={(e) =>
                            handleDateTimeChange(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="block w-full text-xs rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] mb-1"
                        >
                          <option value="">Start Time</option>
                          {allTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <select
                          value={practicalDates[index].endTime}
                          onChange={(e) =>
                            handleDateTimeChange(
                              index,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="block w-full text-xs rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95]"
                        >
                          <option value="">End Time</option>
                          {allTimes
                            .filter(
                              (time) =>
                                practicalDates[index].startTime &&
                                time > practicalDates[index].startTime
                            )
                            .map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                        </select>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, studentIndex) => (
                  <tr key={student.rollNo}>
                    <td
                      className="px-4 py-3 text-sm text-gray-900 border sticky left-0 bg-white z-10"
                      style={{ width: "80px" }}
                    >
                      {student.rollNo}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-gray-900 border sticky left-[80px] bg-white z-10"
                      style={{ width: "200px" }}
                    >
                      {student.name}
                    </td>
                    {student.attendance.map((isPresent, dateIndex) => (
                      <td key={dateIndex} className="border">
                        <div className="flex items-center justify-center p-2">
                          {practicalDates[dateIndex].date &&
                          practicalDates[dateIndex].startTime &&
                          practicalDates[dateIndex].endTime ? (
                            <button
                              onClick={() =>
                                toggleAttendance(studentIndex, dateIndex)
                              }
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                                isPresent
                                  ? "bg-[#155E95] text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {isPresent ? "P" : "A"}
                            </button>
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                              -
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchAttendance;
