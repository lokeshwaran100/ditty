import React from 'react'

const FormField = ({inputType,label,isTextArea,placeholder,value,handleChange}) => {
  return (
    <label className='flex-1 flex flex-col my-3 mx-4'>
      <span className=' text-[#949494]  text-[18px] mb-1'>{label} :</span>
        {
          (isTextArea)?<textarea
              className='h-14 	outline-none border-[#949494] border-2 rounded-[5px] px-2 py-2'
              rows={10}
              name={label}
              value={value}
              placeholder={placeholder}
              onChange={handleChange}
          />
          :
          <input 
          type={inputType} 
          className=' h-14 outline-none border-[#949494] border-2 rounded-[5px] px-2 py-2' 
          name={label}
          value={value}
          placeholder={placeholder} 
          onChange={handleChange}
          />

        }
    </label>
  )
}

export default FormField