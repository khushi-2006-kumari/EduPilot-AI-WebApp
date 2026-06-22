import React from 'react';

export function TodaysPlan({ tasks, toggleTask }) { //{ tasks, toggleTask }: prop, where tasks is an array of objects and toggleTask is a function that toggles tasks
  const today = new Date().toLocaleDateString('en-US', { //'new Date()' is a constructor creates raw material(data object) and toLOcalDateString is a method, converts date object into readable string based on provided options
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  return (
    <section className="glass-card p-6 rounded-2xl relative overflow-hidden h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary-container">auto_fix</span>
            Today's Plan
          </h3>
          <span className="text-[11px] font-bold text-outline uppercase tracking-widest font-sans">{today}</span>  {/* today is a variable which is used to display the current date in the specified format*/}
        </div>

        <div className="space-y-3">
          {tasks.map(t => (
            <label
              key={t.id}
              className={`flex items-center gap-3 p-3 bg-surface-container-low/50 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors group border border-transparent hover:border-outline-variant/10 ${t.completed ? 'opacity-65' : ''
                }`}
            >
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTask(t.id)} //arrow function used here, becoz only calls when clicked, otherwise it would be called immediately which creates wrong calls 
                //toggleTask(): it is an event handler passed to the onClick prop of the button. This means the toggleTask function will only be executed when the checkbox is clicked.(it called in parent component to update the state)
                className="w-5 h-5 rounded border-outline-variant bg-transparent text-primary-container focus:ring-primary-container ring-offset-background"
              />
              <div className="flex-1">
                <p className={`text-sm font-bold text-on-surface ${t.completed ? 'line-through opacity-50' : ''}`}>{t.text}</p>
                <p className="text-[10px] text-primary-container/70 uppercase font-bold">{t.category}</p>
              </div>
              {t.priority === 'high' && !t.completed && (
                <span className="text-[9px] px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20 font-bold uppercase shrink-0">High Priority</span>
              )}
              {t.completed && (
                <span className="material-symbols-outlined text-green-400 opacity-100 transition-opacity text-xl shrink-0">verified</span>
              )}
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

//summary :
//parent Component:
// -> tasks(array) -->rendered as list
// -> called on checkbox change ->updates the state in parent--> re-renders
