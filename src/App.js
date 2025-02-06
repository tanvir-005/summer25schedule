import React, { useState, useMemo, useRef } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const RoutineGenerator = () => {
  const [viewType, setViewType] = useState('list');
  const [showScreenshotHelp, setShowScreenshotHelp] = useState(false);
  const routineRef = useRef(null);
  const tableWrapperRef = useRef(null);
  const [selectedColumns, setSelectedColumns] = useState({
    'SL': false,
    'Course': true,
    'Section': true,
    'Day': false,
    'Time': true,
    'Room': true
  });

  const routineData = [
    {
      "SL": 1,
      "Course": "STA 240",
      "Section": "I",
      "Day": "Saturday",
      "Time": "09:35am - 10:35am",
      "Room": "802"
    },
    {
      "SL": 2,
      "Course": "CSC 455",
      "Section": "D",
      "Day": "Sunday",
      "Time": "03:20pm - 04:20pm",
      "Room": "908"
    },
    {
      "SL": 3,
      "Course": "CSC 439",
      "Section": "M",
      "Day": "Sunday",
      "Time": "04:25pm - 05:25pm",
      "Room": "611"
    },
    {
      "SL": 4,
      "Course": "STA 240",
      "Section": "I",
      "Day": "Monday",
      "Time": "09:35am - 10:35am",
      "Room": "802"
    },
    {
      "SL": 5,
      "Course": "ART 203",
      "Section": "H",
      "Day": "Monday",
      "Time": "01:10pm - 02:10pm",
      "Room": "903"
    },
    {
      "SL": 6,
      "Course": "CSC 440",
      "Section": "M",
      "Day": "Monday",
      "Time": "03:20pm - 04:20pm",
      "Room": "Comlab8"
    },
    {
      "SL": 7,
      "Course": "CSC 440",
      "Section": "M",
      "Day": "Monday",
      "Time": "04:25pm - 05:25pm",
      "Room": "Comlab8"
    },
    {
      "SL": 8,
      "Course": "CSC 455",
      "Section": "D",
      "Day": "Tuesday",
      "Time": "03:20pm - 04:20pm",
      "Room": "909"
    },
    {
      "SL": 9,
      "Course": "CSC 439",
      "Section": "M",
      "Day": "Tuesday",
      "Time": "04:25pm - 05:25pm",
      "Room": "416"
    },
    {
      "SL": 10,
      "Course": "STA 240",
      "Section": "I",
      "Day": "Wednesday",
      "Time": "09:35am - 10:35am",
      "Room": "802"
    },
    {
      "SL": 11,
      "Course": "CSC 215",
      "Section": "B",
      "Day": "Wednesday",
      "Time": "11:45am - 12:45pm",
      "Room": "611"
    },
    {
      "SL": 12,
      "Course": "CSC 455",
      "Section": "D",
      "Day": "Wednesday",
      "Time": "03:20pm - 04:20pm",
      "Room": "909"
    },
    {
      "SL": 13,
      "Course": "CSC 439",
      "Section": "M",
      "Day": "Wednesday",
      "Time": "04:25pm - 05:25pm",
      "Room": "416"
    }
   ];

  const formatTime = (timeString) => {
    const [time] = timeString.split(' - ');
    return time.replace(/[ap]m/i, '');
  };

  const downloadAsImage = async () => {
    if (routineRef.current && tableWrapperRef.current) {
      try {
        const wrapper = tableWrapperRef.current;
        const originalStyle = wrapper.style.cssText;
        wrapper.style.width = 'auto';
        wrapper.style.maxWidth = 'none';
        wrapper.style.overflow = 'visible';

        const contentWidth = routineRef.current.scrollWidth;
        const contentHeight = routineRef.current.scrollHeight;

        const canvas = await html2canvas(routineRef.current, {
          scale: 2,
          width: contentWidth,
          height: contentHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: contentWidth,
          windowHeight: contentHeight,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.querySelector('#routine-content');
            if (clonedElement) {
              clonedElement.style.width = contentWidth + 'px';
              clonedElement.style.height = contentHeight + 'px';
            }
          }
        });

        wrapper.style.cssText = originalStyle;

        const link = document.createElement('a');
        link.download = 'routine.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const courseColors = useMemo(() => {
    const uniqueCourses = [...new Set(routineData.map(item => item['Course']))];
    const colors = [
      'bg-blue-100 hover:bg-blue-200',
      'bg-green-100 hover:bg-green-200',
      'bg-purple-100 hover:bg-purple-200',
      'bg-yellow-100 hover:bg-yellow-200',
      'bg-pink-100 hover:bg-pink-200',
      'bg-orange-100 hover:bg-orange-200',
      'bg-teal-100 hover:bg-teal-200',
      'bg-red-100 hover:bg-red-200'
    ];
    
    return Object.fromEntries(
      uniqueCourses.map((course, index) => [
        course, 
        colors[index % colors.length]
      ])
    );
  }, [routineData]);

  const dayColors = useMemo(() => {
    const colors = {
      'Sunday': 'bg-rose-100 hover:bg-rose-200',
      'Monday': 'bg-blue-100 hover:bg-blue-200',
      'Tuesday': 'bg-green-100 hover:bg-green-200',
      'Wednesday': 'bg-purple-100 hover:bg-purple-200',
      'Thursday': 'bg-yellow-100 hover:bg-yellow-200',
      'Friday': 'bg-pink-100 hover:bg-pink-200',
      'Saturday': 'bg-orange-100 hover:bg-orange-200'
    };
    return colors;
  }, []);

  const uniqueDays = [...new Set(routineData.map(item => item.Day))]
    .sort((a, b) => {
      const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return daysOrder.indexOf(a) - daysOrder.indexOf(b);
    });

  const uniqueTimeSlots = [...new Set(routineData.map(item => item.Time))]
    .sort((a, b) => {
      const timeA = new Date(`2024-01-01 ${a.split(' - ')[0]}`);
      const timeB = new Date(`2024-01-01 ${b.split(' - ')[0]}`);
      return timeA - timeB;
    });

  const dayAbbrev = {
    'Sunday': 'Sun',
    'Monday': 'Mon',
    'Tuesday': 'Tue',
    'Wednesday': 'Wed',
    'Thursday': 'Thu',
    'Friday': 'Fri',
    'Saturday': 'Sat'
  };

  const getGridCellContent = (day, timeSlot) => {
    const class_ = routineData.find(item => 
      item.Day === day && item.Time === timeSlot
    );

    if (!class_) return null;

    let content = [];
    if (selectedColumns['Course']) content.push(class_['Course']);
    if (selectedColumns['Section']) content.push(`(${class_['Section']})`);
    if (selectedColumns['Room']) content.push(class_['Room']);

    return {
      content: content.join('\n'),
      courseCode: class_['Course']
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-[95vw] md:max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">IUBAT SPRING 25 ROUTINE GENERATOR</h1>
            <button 
              onClick={downloadAsImage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              <span>Download as Wallpaper</span>
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">View Options</h2>
            <div className="flex gap-4 mb-4 flex-wrap">
              <button
                onClick={() => setViewType('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewType === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewType('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewType === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Grid View
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              {Object.keys(selectedColumns)
              .filter((column) => viewType === 'list' || !['SL', 'Day', 'Time'].includes(column))
              .map(column => (
                <label key={column} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedColumns[column]}
                    onChange={() => setSelectedColumns(prev => ({
                      ...prev,
                      [column]: !prev[column]
                    }))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  {column}
                </label>
              ))}
            </div>
          </div>

          <div ref={tableWrapperRef} className="overflow-x-auto">
            <div 
              ref={routineRef} 
              id="routine-content"
              className="bg-white rounded-xl"
            >
              {viewType === 'list' ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      {Object.entries(selectedColumns).map(([column, selected]) => 
                        selected && (
                          <th key={column} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider first:rounded-tl-lg last:rounded-tr-lg">
                            {column}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {routineData.map((row, idx) => (
                      <tr key={idx} className={dayColors[row.Day]}>
                        {Object.entries(selectedColumns).map(([column, selected]) => 
                          selected && (
                            <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {column === 'Time' ? formatTime(row[column]) :
                               column === 'Day' ? dayAbbrev[row[column]] :
                               row[column]}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="grid" style={{
                  gridTemplateColumns: `auto repeat(${uniqueDays.length}, minmax(120px, 1fr))`,
                  gap: '0.5rem'
                }}>
                  <div className="col-span-1"></div>
                  {uniqueDays.map(day => (
                    <div key={day} className="bg-gray-700 text-white p-2 text-center font-semibold rounded-lg">
                      {dayAbbrev[day]}
                    </div>
                  ))}
                  {uniqueTimeSlots.map(timeSlot => (
                    <React.Fragment key={timeSlot}>
                      <div className="bg-gray-700 text-white p-2 text-sm rounded-lg flex items-center justify-center">
                        {formatTime(timeSlot)}
                      </div>
                      {uniqueDays.map(day => {
                        const cellContent = getGridCellContent(day, timeSlot);
                        return (
                          <div 
                            key={`${day}-${timeSlot}`} 
                            className={`p-3 text-sm min-h-[80px] rounded-lg transition-colors ${
                              cellContent ? courseColors[cellContent.courseCode] : 'bg-gray-50'
                            } flex items-center justify-center text-center`}
                          >
                            {cellContent?.content}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Color Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">
              {viewType === 'grid' ? 'Course Color Guide' : 'Day Color Guide'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {viewType === 'grid' ? (
                Object.entries(courseColors).map(([course, colorClass]) => (
                  <div key={course} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${colorClass}`}></div>
                    <span className="text-sm">{course}</span>
                  </div>
                ))
              ) : (
                Object.entries(dayColors).map(([day, colorClass]) => (
                  <div key={day} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${colorClass}`}></div>
                    <span className="text-sm">{dayAbbrev[day]}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineGenerator;