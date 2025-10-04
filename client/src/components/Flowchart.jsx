import React from 'react'
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Flowchart = () => {
  useEffect(() => {
    toast.success('Flowchart loaded!');
  }, []);
  return (
    <div></div>
  )
}

export default Flowchart