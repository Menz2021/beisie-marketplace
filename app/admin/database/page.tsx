'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  TableCellsIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface TableData {
  [key: string]: any
}

interface TableInfo {
  name: string
  count: number
  columns: string[]
}

export default function DatabaseViewerPage() {
  const router = useRouter()
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableData, setTableData] = useState<TableData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/database/tables')
      const data = await response.json()
      
      if (data.success) {
        setTables(data.tables)
      } else {
        setError(data.error || 'Failed to fetch tables')
      }
    } catch (error) {
      setError('Failed to connect to database')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTableData = async (tableName: string) => {
    try {
      setIsLoading(true)
      setError('')
      const response = await fetch(`/api/admin/database/tables/${tableName}`)
      const data = await response.json()
      
      if (data.success) {
        setTableData(data.data)
        setSelectedTable(tableName)
      } else {
        setError(data.error || 'Failed to fetch table data')
      }
    } catch (error) {
      setError('Failed to fetch table data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Clear secure cookie via API
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Redirect to admin login
      router.push('/admin/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Database Viewer</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tables List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Database Tables</h2>
                <p className="text-sm text-gray-500">Click on a table to view its data</p>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading tables...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tables.map((table) => (
                      <button
                        key={table.name}
                        onClick={() => fetchTableData(table.name)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                          selectedTable === table.name
                            ? 'bg-purple-50 border-purple-200 text-purple-900'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TableCellsIcon className="h-5 w-5 mr-3" />
                            <span className="font-medium">{table.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{table.count} rows</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table Data */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedTable ? `${selectedTable} Data` : 'Select a table to view data'}
                </h2>
                {selectedTable && (
                  <p className="text-sm text-gray-500">
                    {tableData.length} rows found
                  </p>
                )}
              </div>
              <div className="p-6">
                {!selectedTable ? (
                  <div className="text-center py-12">
                    <TableCellsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No table selected</h3>
                    <p className="text-gray-500">Choose a table from the left to view its data</p>
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading data...</p>
                  </div>
                ) : tableData.length === 0 ? (
                  <div className="text-center py-12">
                    <TableCellsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
                    <p className="text-gray-500">This table is empty</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(tableData[0]).map((column) => (
                            <th
                              key={column}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.slice(0, 100).map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {Object.values(row).map((value, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                              >
                                {value === null ? (
                                  <span className="text-gray-400 italic">null</span>
                                ) : typeof value === 'object' ? (
                                  <span className="text-gray-500 font-mono text-xs">
                                    {JSON.stringify(value)}
                                  </span>
                                ) : (
                                  String(value)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {tableData.length > 100 && (
                      <div className="mt-4 text-center text-sm text-gray-500">
                        Showing first 100 rows of {tableData.length} total rows
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
