'use client'

import { useState } from 'react'

export default function AuditLog({ actions }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 transition-colors hover:bg-indigo-200"
      >
        <span className="mr-1.5 h-2 w-2 rounded-full bg-indigo-500"></span>
        Show Logs
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-indigo-100 bg-indigo-50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-indigo-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                    clipRule="evenodd"
                  />
                  <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
                System Audit Log
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {actions.length === 0 ? (
                <p className="text-center text-sm text-gray-500 italic">
                  No actions recorded
                </p>
              ) : (
                <ul className="space-y-0">
                  {actions
                    .slice()
                    .reverse()
                    .map((a) => (
                      <li
                        key={a.id}
                        className="relative border-l-2 border-gray-200 pb-6 pl-6 last:border-0 last:pb-0"
                      >
                        <div className="absolute top-0 -left-[5px] h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-300"></div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {new Date(a.timestamp).toLocaleString()}
                          </span>
                          <span className="text-base font-semibold text-gray-800">
                            {a.actionType}
                          </span>
                          {a.comment && (
                            <div className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-600 italic">
                              &quot;{a.comment}&quot;
                            </div>
                          )}
                          <span className="text-xs text-gray-400">
                            ID: {a.id}
                          </span>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
