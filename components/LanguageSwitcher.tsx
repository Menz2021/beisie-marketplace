'use client'

import { useState } from 'react'
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { setLanguage, getLanguage, languages, type Language } from '@/lib/i18n'

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage())

  const handleLanguageChange = (langCode: Language) => {
    setCurrentLang(langCode)
    setLanguage(langCode)
    setIsOpen(false)
    // Reload the page to apply language changes
    window.location.reload()
  }

  const currentLanguage = languages.find(lang => lang.code === currentLang)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
      >
        <GlobeAltIcon className="h-4 w-4" />
        <span>{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code as Language)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    currentLang === language.code ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                    {currentLang === language.code && (
                      <span className="ml-auto text-primary-600">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
