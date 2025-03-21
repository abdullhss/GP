"use client";

import Image from "next/image";
import { easeIn, easeInOut, motion } from "framer-motion";
import molecule from "@/public/molecule.jpg";
import micros from "@/public/micros.jpeg";
import FloatingCircles from "./components/FloatingCircles";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="relative min-h-screen darkBG">
      <Header/>
      <FloatingCircles/>
      <motion.div 
        initial={{ opacity: 0, y: 50, height: "50vh" }}
        animate={{ opacity: 1, y: 0, height: "90vh" }}
        transition={{ duration: 0.7, height: { duration: 2, delay: 4  , ease:"anticipate"} }}
        className="w-full px-6 py-4 overflow-x-hidden"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden:{opacity:0},
            show:{
              opacity:1 ,
              transition : {
                staggerChildren:0.3 ,
                delay : 0.7 ,
                delayChildren : 0.5
              }
            }
          }}
          className="w-full h-full flex items-center gap-12"
        >
          {/* Left Content Container*/}
          <motion.div
            initial={{opacity:0 , x:-50}}
            animate={{opacity:1 , x :0}}
            transition={{delay:5 , duration:1.5}}
          >
            <span className="text-4xl font-bold glowing-text">
              AI Driven
            </span>
            <h1 className="text-white">De novo Drug Discovery</h1>
          </motion.div>

          <div className="flex-1 h-full flex items-center gap-12">
            <motion.div
              initial={{x:1500}}
              animate={{x:-500}}
              transition={{ duration: 3, ease: "easeOut" }}
              className="relative w-[30%] h-[80%] rounded-md"
            >
              <Image src={micros} fill className="object-cover w-72 h-full rounded-md" alt="Microscope" />
            </motion.div>

            <motion.div
              initial={{x:1500}}
              animate={{x:-1000}}
              transition={{ duration: 5, ease: "easeOut" }}
              className="relative w-[30%] h-[80%] rounded-md"
            >
                <Image src={molecule} fill className="object-cover w-72 h-full rounded-md" alt="Molecule" />
            </motion.div>
          </div>

          <motion.div
            initial={{x: "100vw", width: "40%"}}
            animate={{x: 0, width: "40%"}}
            transition={{ duration: 4, ease: "easeOut" }}
            className="relative h-full ml-auto"
          >
            <div className="w-full h-full rounded-lg overflow-hidden shadow-xl">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              >
                <source src="/DNA video.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  );
}