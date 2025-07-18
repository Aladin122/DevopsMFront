import React, { useEffect, useState } from 'react';
import { etudiantService } from '../services/etudiantService';
import { Option } from '../types';

interface OptionAnalytics {
  option: Option;
  count: number;
}

const optionColors: Record<Option, string> = {
  GAMIX: 'from-pink-500 to-rose-400',
  SE: 'from-blue-500 to-cyan-400',
  SIM: 'from-purple-500 to-indigo-400',
  NIDS: 'from-emerald-500 to-teal-400',
};

const optionIcons: Record<Option, string> = {
  GAMIX: '🎮',
  SE: '💻',
  SIM: '📊',
  NIDS: '🔐',
};

const StudentAnalyticsChart: React.FC = () => {
  const [data, setData] = useState<OptionAnalytics[]>([]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await etudiantService.getEtudiants();

        const grouped: Record<Option, number> = {
          GAMIX: 0,
          SE: 0,
          SIM: 0,
          NIDS: 0,
        };

        students.forEach((student: any) => {
          const op = student.op as Option;
          if (grouped[op] !== undefined) grouped[op]++;
        });

        const formattedData = (Object.keys(grouped) as Option[]).map((option) => ({
          option,
          count: grouped[option],
        }));

        setData(formattedData);
        setTimeout(() => setAnimated(true), 500);
      } catch (err) {
        console.error('Error loading student analytics', err);
      }
    };

    fetchData();
  }, []);

  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
      <div className="space-y-6 p-6 rounded-2xl bg-white/5 shadow-inner border border-white/10 backdrop-blur-md">
        <h3 className="text-2xl font-semibold text-white mb-4 tracking-wide">🎓 Students by Option</h3>

        {data.map((item, index) => (
            <div key={item.option} className="flex items-center gap-4 opacity-0 animate-fade-up" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}>
              <div className="w-20 text-gray-300 text-sm font-medium flex items-center gap-1">
                <span>{optionIcons[item.option]}</span> {item.option}
              </div>

              <div className="flex-1 relative h-6 bg-gray-800/50 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${optionColors[item.option]} rounded-full shadow-lg transition-all duration-1000 ease-out ${
                        animated ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      width: animated ? `${(item.count / maxValue) * 100}%` : '0%',
                      transitionDelay: `${index * 100}ms`,
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-end pr-3">
                  <span className="text-white text-sm font-semibold tracking-wide">{item.count}</span>
                </div>
              </div>
            </div>
        ))}

        <div className="pt-4 border-t border-white/10 grid grid-cols-2 text-center text-sm text-gray-400 mt-6">
          <div className="text-cyan-400 font-bold text-xl">
            {data.reduce((sum, d) => sum + d.count, 0)}
          </div>
          <div>Total Students</div>
        </div>
      </div>
  );
};

export default StudentAnalyticsChart;
