import React from 'react'

const GenderCheckBox = ({ onCheckboxChange, selectedGender, error }) => {
  return (
    <div className="mt-2">
      <label className="label">
        <span className="label-text font-medium">Gender</span>
      </label>

      <div className="flex gap-6">
        {/* Male */}
        <label htmlFor="male" className="label cursor-pointer gap-2">
          <span className="label-text">Male</span>
          <input
            id="male"
            type="radio"
            name="gender"
            value="male"
            className="radio checked:bg-gray-400"
            checked={selectedGender === 'male'}
            onChange={() => onCheckboxChange('male')}
          />
        </label>

        {/* Female */}
        <label htmlFor="female" className="label cursor-pointer gap-2">
          <span className="label-text">Female</span>
          <input
            id="female"
            type="radio"
            name="gender"
            value="female"
            className="radio checked:bg-gray-400"
            checked={selectedGender === 'female'}
            onChange={() => onCheckboxChange('female')}
          />
        </label>
      </div>

      {/* Error message (optional) */}
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

export default GenderCheckBox
