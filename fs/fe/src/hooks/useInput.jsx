import { useState } from 'react';

function useInputs(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);
  const  handleValue = (event) =>{
    setValue(event);
  };
  return [value, handleValue];

}

export default useInputs;