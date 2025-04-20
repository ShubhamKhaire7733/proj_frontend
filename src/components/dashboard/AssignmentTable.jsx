import { Table } from 'lucide-react';

function AssignmentTable({ assignments }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-[#155E95] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">Assign. No.</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Performance Date</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Submission Date</th>
            <th className="px-6 py-3 text-left text-sm font-medium">RPP Marks (5)</th>
            <th className="px-6 py-3 text-left text-sm font-medium">SPO Marks (5)</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Assignment Marks (10)</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <tr key={assignment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{assignment.number}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {assignment.performanceDate ? new Date(assignment.performanceDate).toLocaleDateString() : 'Not scheduled'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {assignment.submissionDate ? new Date(assignment.submissionDate).toLocaleDateString() : 'Not submitted'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{assignment.rppMarks || '-'}/5</td>
              <td className="px-6 py-4 text-sm text-gray-900">{assignment.spoMarks || '-'}/5</td>
              <td className="px-6 py-4 text-sm text-gray-900">{assignment.assignmentMarks || '-'}/10</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  assignment.status === 'Completed' 
                    ? 'bg-green-100 text-green-800'
                    : assignment.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {assignment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssignmentTable;