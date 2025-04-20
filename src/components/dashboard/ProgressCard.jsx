function ProgressCard({ title, value, total, icon: Icon }) {
  const percentage = (value / total) * 100;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-[#155E95] bg-opacity-10 rounded-lg">
            <Icon className="h-6 w-6 text-[#155E95]" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-[#155E95]">
              {value} / {total}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-[#155E95]">
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#155E95] bg-opacity-10">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#155E95] to-[#1E90FF] rounded transition-all duration-500"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ProgressCard;