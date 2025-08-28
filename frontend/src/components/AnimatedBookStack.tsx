import book1 from '../assets/svgs/book-1.svg?url'
import book2 from '../assets/svgs/book-2.svg?url'
import book3 from '../assets/svgs/book-3.svg?url'
import { motion } from 'motion/react'

export default function AnimatedBookStack() {
  const books = [
    { svg: book1, rotate: -20 },
    { svg: book2, rotate: 0 },
    { svg: book3, rotate: 20 }
  ]
  return (
    <div className='relative w-full h-full'>
      {books.map((book, index) => (
        <motion.div
          key={index}
          initial={{
            rotate: 0,
            opacity: 0
          }}
          animate={{
            rotate: book.rotate,
            opacity: 1
          }}
          transition={{
            delay: index * 0.3,
            duration: 0.8,
            ease: "easeOut"
          }}
          className='absolute inset-0 flex items-center justify-center'
          style={{ zIndex: books.length - index }}
        >
          <img src={book.svg} alt="Book" className='w-full h-full object-contain' />
        </motion.div>
      ))}
    </div>
  )
}