import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface SuccessBannerProps {
  time: number,
}

const SuccessBanner = ({time}: SuccessBannerProps) => {
  return (
    <div className='bg-[#EEFCF3] p-[15px] border border-success rounded-3xl flex items-center gap-[10px]'>
      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={42} className='text-white fill-success'/>
      <div className='text-[#17823E]'>
        <p className='font-bold'>Recipe extracted successfully!</p>
        <p className='text-sm opacity-75'>Analyzed in 6.2 seconds using AI</p>
      </div>
    </div>
  )
}

export default SuccessBanner