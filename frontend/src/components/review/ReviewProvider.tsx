import React, { createContext, useState, type ReactNode } from 'react'

type ModalContextType = {
    isReviewOpen:boolean;
    openReview:()=>void;
    closeReview:()=>void;

}
export const ReviewContext=createContext<ModalContextType | undefined>(undefined)

const ReviewProvider = ({children}:{children:ReactNode}) => {
    const[isReviewOpen,setIsReviewOpen]=useState(false)
    const openReview=()=>setIsReviewOpen(true)
    const closeReview=()=>setIsReviewOpen(false)
  return (
    <>
    <ReviewContext.Provider value={{isReviewOpen,openReview,closeReview}}>
        {children}
    </ReviewContext.Provider>
    </>
  )
}

export default ReviewProvider