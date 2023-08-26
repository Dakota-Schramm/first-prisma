'use client'

import React, { useState, forwardRef, RefObject } from 'react'
import Image from 'next/image';

import sync from "@/assets/images/sync.svg"

type AddUserProps = {
  handleClose: () => void
}

// TODO: Show user an input that can be typed into
// to add a user to the feed.
// TODO: Once input has been submitted - 
// Switch to show button that allows user to close the dialog
// TODO: dialog should slide up on open and slide down on close

// TODO: Auto focus the input
// TODO: Add transition animations to component
const AddUser = forwardRef(
  function AddUser(
    props: AddUserProps,
    ref: RefObject<HTMLDialogElement>
  ) {
    const {
      handleClose
    } = props

  return (
    <dialog ref={ref}
      className='fixed w-screen h-screen text-white'
      onCancel={handleClose}
      onClose={handleClose}
      onKeyDown={(e) => {
        if (e.code !== 'Escape') return;

        console.log('hit');
        handleClose()
      }}
    >
      <div className='top-0 flex items-center justify-center w-screen h-screen bg-main-online'>
        <h2>Add user to feed: </h2>
        {/* <br/> Is this okay to use? */}

        <footer>
          <FooterButtons {...{ handleClose }} />
        </footer>
      </div>
    </dialog>
  );
})

const UserForm = ({ handleSubmitted }: { handleSubmitted: () => void }) => {
  const [ input, setInput ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)

  if (isLoading) return (
    <div className='flex items-center justify-center w-full h-full'>
      <Image src={sync} alt='Loading' className="animate-spin" />
    </div>
  )

  return (
    <form
      className='flex'
    >
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='text-black'
      />
      <button
        type='submit'
        onClick={async (e) => {
          e.preventDefault()
          setIsLoading(true)
          const response = await fetch(`/api/users/${input}`);
          setIsLoading(false)
          if (!response.ok) throw Error(response.statusText)
          handleSubmitted()
        }}
      >
        Submit
      </button>
    </form>

  )
}

// TODO: Add loading animation during post
const FooterButtons = ({ handleClose }) => {
  const [ isSubmitted, setIsSubmitted ] = useState(false)

  if (!isSubmitted) return (
    <UserForm handleSubmitted={() => setIsSubmitted(true)} />
  )

  // TODO: Reload page after post?
  // Relaod feed instead
  return (
    <button 
      onClick={handleClose}
      formMethod='dialog'
    >
      OK
    </button>
  )
}

export default AddUser
