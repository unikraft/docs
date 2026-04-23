import { IconButton } from '@chakra-ui/react'
import { useEffect, useState, RefObject } from 'react'
import { BsArrowUpCircleFill } from 'react-icons/bs'

interface ScrollToTopProps {
  scrollContainerRef: RefObject<HTMLDivElement>
}

export function ScrollToTop({ scrollContainerRef }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setIsVisible(container.scrollTop > 300)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <IconButton
      aria-label='Scroll to top'
      icon={<BsArrowUpCircleFill size={22} />}
      onClick={scrollToTop}
      position='fixed'
      bottom={{ base: '6', md: '8' }}
      right={{ base: '4', md: '8' }}
      zIndex='tooltip'
      size='md'
      colorScheme='blue'
      rounded='full'
      shadow='lg'
      opacity={0.9}
      _hover={{ opacity: 1, transform: 'translateY(-2px)', shadow: 'xl' }}
      transition='all 0.2s ease'
    />
  )
}

export default ScrollToTop
