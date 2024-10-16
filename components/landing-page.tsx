'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Facebook, Twitter, Instagram, Rocket, Zap, DollarSign, Shield, Users, Globe, Lock, Coins, TrendingUp, Menu, Sparkles, Cpu, Network, Megaphone, ArrowUp, Bone, Heart, Star, Sun, Cloud, CloudRain, CloudLightning, Snowflake, Download } from 'lucide-react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts'
import dynamic from 'next/dynamic'
import useSound from 'use-sound'
import html2canvas from 'html2canvas'
import { useInView } from 'react-intersection-observer'

const DynamicConfetti = dynamic(() => import('react-confetti'), { ssr: false })

interface FeatureProps {
  icon: React.ReactNode;
  text: string;
}

function Feature({ icon, text }: FeatureProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-md"
    >
      <span className="text-xl md:text-2xl text-pink-500">{icon}</span>
      <span className="text-base md:text-lg text-gray-700">{text}</span>
    </motion.div>
  )
}

interface InfoCardProps {
  image: string;
  title: string;
  description: string;
}

function InfoCard({ image, title, description, className }: InfoCardProps & { className?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`bg-white rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      <Image 
        src={image} 
        alt={title} 
        width={400} 
        height={200} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h4 className="text-lg md:text-xl font-bold mb-2 text-pink-600">{title}</h4>
        <p className="text-sm md:text-base text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

interface AdvantageCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function AdvantageCard({ icon, title, description }: AdvantageCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg p-6 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <span className="text-pink-500">{icon}</span>
        <h4 className="text-xl font-bold ml-4 text-pink-600">{title}</h4>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

interface EcosystemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function EcosystemCard({ icon, title, description }: EcosystemCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <div className="flex items-center mb-4 justify-center">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-2 text-yellow-500 text-center">{title}</h4>
      <p className="text-gray-300 text-center">{description}</p>
    </motion.div>
  )
}

interface RoadmapItemProps {
  phase: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function RoadmapItem({ phase, title, description, icon }: RoadmapItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <div className="text-yellow-500 mr-4">
          {icon}
        </div>
        <div>
          <span className="text-yellow-500 font-bold mr-2">{phase}:</span>
          <h4 className="text-xl font-bold text-yellow-500">{title}</h4>
        </div>
      </div>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}

const BackToTopButton = dynamic(() => Promise.resolve(() => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="fixed right-4 bottom-20 z-50 bg-yellow-500 text-black p-3 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </>
  )
}), { ssr: false })

function HectorsMemoryMatch() {
  const [cards, setCards] = useState<{id: number, icon: React.ReactElement, flipped: boolean, matched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const cardIcons = [
    <Bone key="bone" size={40} />,
    <Rocket key="rocket" size={40} />,
    <Coins key="coins" size={40} />,
    <Shield key="shield" size={40} />,
    <Heart key="heart" size={40} />,
    <Star key="star" size={40} />,
  ];

  const initializeGame = () => {
    const shuffledCards = [...cardIcons, ...cardIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        flipped: false,
        matched: false
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleCardClick = (id: number) => {
    if (!gameStarted || flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    setCards(cards.map(card => card.id === id ? {...card, flipped: true} : card));

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      
      if (
        cards[firstId] &&
        cards[secondId] &&
        cards[firstId].icon &&
        cards[secondId].icon &&
        cards[firstId].icon.type === cards[secondId].icon.type
      ) {
        setCards(cards.map(card => 
          card.id === firstId || card.id === secondId ? {...card, matched: true} : card
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === firstId || card.id === secondId ? {...card, flipped: false} : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (gameStarted && cards.every(card => card.matched)) {
      setGameCompleted(true);
      setGameStarted(false);
    }
  }, [cards, gameStarted]);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-pink-600 mb-4">Hector's Memory Match</h3>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {cards.map(card => (
          <motion.div
            key={card.id}
            className={`w-24 h-24 bg-yellow-400 rounded-lg cursor-pointer flex items-center justify-center ${card.flipped || card.matched ? '' : 'bg-opacity-50'}`}
            onClick={() => handleCardClick(card.id)}
            animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-full relative flex items-center justify-center" style={{ transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
              {(card.flipped || card.matched) && (
                <div className="text-black">
                  {card.icon}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={initializeGame}
          className="px-4 py-2 bg-yellow-400 text-black rounded-full font-bold"
        >
          {gameStarted ? 'Restart' : 'Start'} Game
        </button>
        <span className="text-white">Moves: {moves}</span>
      </div>
      {gameCompleted && (
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-green-400">Game Completed!</p>
          <p className="text-white">You matched all pairs in {moves} moves.</p>
        </div>
      )}
    </div>
  );
}

function BarChart() {
  const data = [
    { name: 'Hector', value: 90, color: 'bg-yellow-500' },
    { name: 'Dogecoin', value: 40, color: 'bg-blue-500' },
    { name: 'Shiba Inu', value: 30, color: 'bg-red-500' },
    { name: 'Floki Inu', value: 20, color: 'bg-green-500' },
    { name: 'Pepe Coin', value: 10, color: 'bg-purple-500' },
  ]

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between h-64 md:h-80 space-y-4 md:space-y-0 md:space-x-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex md:flex-col items-center md:items-center w-full">
            <div className="w-24 md:w-auto text-xs md:text-sm md:mb-2">{item.name}</div>
            <div className="flex-grow md:w-16 h-8 md:h-64 bg-gray-700 rounded-full md:rounded overflow-hidden">
              <motion.div 
                className={`h-full md:w-full ${item.color} rounded-full md:rounded`}
                initial={{ width: '0%', height: '0%' }}
                animate={{ width: '100%', height: `${item.value}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
            <div className="w-12 md:w-auto text-right md:text-center text-xs md:text-sm font-bold md:mt-2">{item.value}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HectorsCryptoJourney() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const journeySteps = [
    { icon: '🚀', text: 'Launch' },
    { icon: '🌱', text: 'Growth' },
    { icon: '🤝', text: 'Partnerships' },
    { icon: '🌍', text: 'Global Adoption' },
    { icon: '🌕', text: 'Moon' },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h4 className="text-2xl font-bold text-pink-600 mb-6 text-center">Hector's Crypto Journey</h4>
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0 md:space-x-4">
        {journeySteps.map((step, index) => (
          <motion.div key={index} className="flex flex-col items-center" variants={itemVariants}>
            <motion.div
              className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl mb-2"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {step.icon}
            </motion.div>
            <p className="text-white text-center">{step.text}</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-8 h-2 bg-gray-600 rounded-full overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 2, delay: 1 }}
        />
      </motion.div>
    </motion.div>
  );
}

export function LandingPageComponent() {
  const [isLaunching, setIsLaunching] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [treatCount, setTreatCount] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [playWoof] = useSound('/woof.mp3')
  const [playTreat] = useSound('/treat.mp3')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLaunching(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isLaunching])

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const incrementTreats = () => {
    setTreatCount(prev => {
      const newCount = Math.min(prev + 1, 20)
      if (newCount === 20) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 5000) // Hide celebration after 5 seconds
      }
      return newCount
    })
  }

  const rocketPosition = (treatCount / 20) * 100

  return (
    <div className="min-h-screen bg-pink-100 text-gray-800 relative overflow-hidden">
      {/* Background paw prints */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 15c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-9 9c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm18 0c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-9 9c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z' fill='%23FFC0CB'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <nav className="sticky top-0 z-50 flex items-center justify-between py-4 px-6 bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 shadow-md">
          <div className="flex items-center">
            <Image 
              src="/logo1.png"
              alt="Hector Logo" 
              width={90}  // Increased from 60 to 70
              height={70} // Increased from 60 to 70
              className="mr-4 rounded-full"  // Removed border-2 border-white
            />  
            <h1 className="text-xl md:text-2xl font-bold text-white">Hector - The Golden Boy in Crypto</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgb(255, 255, 255)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-pink-600 rounded-full font-bold text-lg transition duration-300 ease-in-out transform hover:bg-pink-100"
              onClick={() => setIsLaunching(true)}
            >
              {isLaunching ? 'Fetching Stick...' : 'Throw the Stick!'} <Bone className="inline-block ml-2 animate-spin" />
            </motion.button>
            <div className="flex space-x-4">
              <motion.a whileHover={{ scale: 1.2, rotate: 20 }} href="#" className="text-white"><Facebook size={24} /></motion.a>
              <motion.a whileHover={{ scale: 1.2, rotate: -20 }} href="#" className="text-white"><Twitter size={24} /></motion.a>
              <motion.a whileHover={{ scale: 1.2, rotate: 20 }} href="#" className="text-white"><Instagram size={24} /></motion.a>
            </div>
          </div>
        </nav>

        {/* Mobile hamburger menu */}
        <div className="md:hidden fixed right-4 bottom-4 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-pink-500 text-white p-3 rounded-full shadow-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </motion.button>
        </div>

        {/* Mobile social media menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="md:hidden fixed right-4 bottom-20 z-50 bg-pink-500 rounded-lg p-4 shadow-lg"
            >
              <div className="flex flex-col space-y-4">
                <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-white"><Facebook size={24} /></motion.a>
                <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-white"><Twitter size={24} /></motion.a>
                <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-white"><Instagram size={24} /></motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="container mx-auto px-6 py-12">
          <div className="md:hidden mb-8">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgb(234, 179, 8)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-3 bg-yellow-500 text-black rounded-full font-bold text-lg transition duration-300 ease-in-out transform hover:bg-yellow-400"
              onClick={() => setIsLaunching(true)}
            >
              {isLaunching ? 'Fetching Stick...' : 'Throw the Stick!'} <Bone className="inline-block ml-2" />
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative p-8 rounded-lg min-h-[400px] md:min-h-[550px] flex flex-col justify-center" style={{
              backgroundImage: 'url(/logo1.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg"></div>
              <div className="relative z-10">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold mb-6 text-yellow-500"
                >
                  Woof-come to the Paw-ture of Crypto!
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base md:text-lg mb-8 text-white"
                >
                  Hector - The Golden Boy is wagging his tail into the crypto world! With bark-chain technology and paw-some community, we're fetching the future of finance. Join our pack for a howling good time!
                </motion.p>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 5, 0],
                  y: [0, -10, 10, -10, 0],
                }}
                transition={{
                  duration: 5,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Image 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/side-RzCAyG9UqiDP6mvxDhCnnCwGQea5pe.jpg"
                  alt="Hector in Space" 
                  width={500} 
                  height={500} 
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-20 relative">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-pink-600 font-comic">Hector's Funky Treat-o-meter</h3>
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
              <div className="bg-black bg-opacity-70 p-4 rounded-lg">
                <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(treatCount / 20) * 100}%` }}
                  />
                  <motion.div
                    className="absolute top-1/2 transform -translate-y-1/2"
                    initial={{ left: 0 }}
                    animate={{ left: `${rocketPosition}%` }}
                    transition={{ type: 'spring', stiffness: 60 }}
                  >
                    <Image 
                      src="/logo1.png"
                      alt="Hector Logo" 
                      width={32}
                      height={32}
                      className="rounded-full animate-pulse"
                    />
                  </motion.div>
                </div>
                <p className="text-center mt-2 font-comic text-white">{treatCount}/20 Treats</p>
                <motion.button 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95, rotate: -5 }}
                  onClick={() => {
                    incrementTreats();
                    playWoof(); // Play the woof sound
                  }}
                  className="mt-4 w-full px-4 py-2 bg-yellow-300 text-black rounded-full font-bold font-comic"
                >
                  Give Hector a Funky Treat!
                </motion.button>
              </div>
              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-black bg-opacity-70 p-6 rounded-lg text-center">
                      <h4 className="text-2xl font-bold text-yellow-500 mb-2">Woohoo! 🎉</h4>
                      <p className="text-white">Hector has reached the moon!</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {showCelebration && (
              <DynamicConfetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={200}
              />
            )}
          </div>

          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-yellow-500">Hector vs Other Meme Coins (Tail Wag Contest)</h3>
            <div className="max-w-3xl mx-auto">
              <BarChart />
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-yellow-500">Solve Hector's Memory Match!</h3>
            <HectorsMemoryMatch />
          </div>

          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-pink-600">Why Choose Hector?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <InfoCard 
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/og3-epLxE0iITgJhEjxX24bUDJ5Y0yoXqp.jpg"
                title="Community-Driven Development"
                description="Be part of a vibrant ecosystem where your voice matters. Hector's community-driven approach ensures that every holder has a say in the project's future."
                className="bg-white"
              />
              <InfoCard 
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/go1-YH5KE2egqdBeLhUKt7XNumDsiDgvAw.jpg"
                title="Innovative Tokenomics"
                description="Experience a well-designed token economy that encourages long-term holding and community participation, creating a stable and growing ecosystem."
                className="bg-white"
              />
              <InfoCard 
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/og2-4oHj4OJkcZ2IBUwYXZkowIaFoWDDx3.jpg"
                title="Transparent Development"
                description="Stay informed with regular updates and open communication from our dedicated team. We believe in full transparency to build trust within our community."
                className="bg-white"
              />
            </div>
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-500">Ready to Join the Revolution?</h3>
            <p className="text-lg mb-8">Be part of the next big thing in crypto. Join Hector's community and help shape the future of finance.</p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgb(234, 179, 8)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-yellow-500 text-black rounded-full font-bold text-xl transition duration-300 ease-in-out transform hover:bg-yellow-400"
            >
              Join the Hector Revolution <Rocket className="inline-block ml-2" />
            </motion.button>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-yellow-500">The Hector Advantage</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <AdvantageCard 
                icon={<Users size={40} className="text-yellow-500" />}
                title="Community-Centric"
                description="Be part of a movement where your voice matters. Hector's governance model puts the power in your hands, allowing you to shape the future of the platform alongside a community of like-minded innovators."
              />
              <AdvantageCard 
                icon={<Shield size={40} className="text-yellow-500" />}
                title="Uncompromising Security"
                description="Your assets are our top priority. With state-of-the-art encryption and multi-layer security protocols, Hector provides a fortress for your investments."
              />
              <AdvantageCard 
                icon={<Rocket size={40} className="text-yellow-500" />}
                title="Innovative Roadmap"
                description="Experience a well-planned journey to the moon. Hector's roadmap is designed to bring continuous improvements and exciting new features to our community."
              />
              <AdvantageCard 
                icon={<Globe size={40} className="text-yellow-500" />}
                title="Global Accessibility"
                description="Join a truly global community. Hector is designed to be accessible to everyone, regardless of their location, fostering a diverse and inclusive ecosystem."
              />
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-yellow-500">Hector's Crypto Journey</h3>
            <HectorsCryptoJourney />
          </div>

          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-yellow-500">Hector's Ecosystem</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <EcosystemCard 
                icon={<Globe size={40} className="text-yellow-500" />}
                title="Global Community"
                description="Join a worldwide network of Hector enthusiasts. Our diverse community spans across continents, bringing together people from all walks of life."
              />
              <EcosystemCard 
                icon={<Lock size={40} className="text-yellow-500" />}
                title="Smart Contracts"
                description="Leverage the power of blockchain with Hector's smart contracts. Automate transactions and agreements with unparalleled security and efficiency."
              />
              <EcosystemCard 
                icon={<Users size={40} className="text-yellow-500" />}
                title="Community Governance"
                description="Have a say in Hector's future. Our community-driven governance model allows token holders to propose and vote on important decisions."
              />
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-yellow-500">Roadmap</h3>
            <div className="space-y-8">
              <RoadmapItem 
                phase="Phase 1"
                title="Launch and Community Building"
                description="Initial token distribution, exchange listings, and community engagement initiatives."
                icon={<Rocket size={32} />}
              />
              <RoadmapItem 
                phase="Phase 2"
                title="Platform Development"
                description="Release of Hector wallet, implementation of staking mechanism, and partnership announcements."
                icon={<Cpu size={32} />}
              />
              <RoadmapItem 
                phase="Phase 3"
                title="Ecosystem Expansion"
                description="Launch of Hector DEX, NFT marketplace integration, and cross-chain compatibility."
                icon={<Network size={32} />}
              />
              <RoadmapItem 
                phase="Phase 4"
                title="Global Adoption"
                description="Major marketing campaigns, institutional partnerships, and real-world use case implementations."
                icon={<Globe size={32} />}
              />
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-yellow-500">Postcards from Hector</h3>
            <VerticalImageGallery />
          </div>
        </main>

        <footer className="bg-pink-200 text-center py-6 mt-12">
          <p className="text-sm md:text-base text-gray-700">&copy; 2024 Hector - The Goodest Boy in Crypto. All rights re-zoomies-ved.</p>
        </footer>

        <BackToTopButton />
      </div>
    </div>
  )
}

function VerticalImageGallery() {
  const [quotes, setQuotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const images = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8afb8c2a-cc62-4343-a3e2-46779d876d54-Qo4fvMRR4Quzl3KtiKOz1pRdV3Mj3z.JPG",
      alt: "Hector with helmet",
      caption: "Ready for a new adventure!"
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8e206447-bcdf-4e2a-99c5-5a4cedd1617d-C8Pyp9ES333oC2iDrH1WUnqUxqA0Rp.JPG",
      alt: "Hector on stone steps",
      caption: "Greetings from Hector's favorite spot!"
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed%20(1)-rr2rmNupe1tcvY3LdkjQIsUmJXt68h.jpg",
      alt: "Hector with pink bows",
      caption: "Feeling pretty with my pink bows!"
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/72c1e84b-73a9-4a2e-abc1-68c57f393462-Atx8W1jOAqart8SIn3PHw5qPVICEhp.JPG",
      alt: "Hector on floral couch",
      caption: "Relaxing on my favorite couch"
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7756bff9-da31-4967-96f9-23e1bef3d20c-pM9icIvMCVcAQDroWubFfZ3lOYL2Op.JPG",
      alt: "Hector looking sleepy",
      caption: "Just woke up from a golden nap!"
    }
  ]

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const quotePromises = images.map(() => 
          fetch('https://api.quotable.io/random')
            .then(res => res.json())
            .then(data => data.content)
        );
        const fetchedQuotes = await Promise.all(quotePromises);
        setQuotes(fetchedQuotes);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        setQuotes(Array(images.length).fill('Crypto is the future of finance!'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);  // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {images.map((image, index) => (
        <React.Fragment key={index}>
          <motion.div
            className="bg-gray-800 p-4 rounded-lg shadow-lg border-4 border-yellow-500"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className={`relative w-full h-80 mb-4 rounded-lg overflow-hidden ${index === 0 ? 'first-image' : ''}`}>
              <Image
                src={image.src}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                className={`rounded-lg image-zoom ${index === 0 ? 'object-top' : 'object-center'}`}
                style={index === 0 ? { objectPosition: 'center -40px' } : {}}
              />
            </div>
            <div className="text-center">
              <p className="text-yellow-500 text-lg font-semibold mb-2">{image.caption}</p>
              <p className="text-gray-300 text-sm">Woof woof, Hector</p>
            </div>
          </motion.div>
          {index < images.length - 1 && (
            <motion.div
              className="bg-gray-800 p-4 rounded-lg shadow-lg my-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index * 0.2) + 0.1 }}
            >
              <p className="text-yellow-500 text-lg italic">"{quotes[index]}"</p>
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}