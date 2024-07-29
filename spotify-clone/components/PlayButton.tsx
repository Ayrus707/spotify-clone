import { FaPlay } from "react-icons/fa"

const PlayButton = () => {
  return (
    <button
      className="
        transition 
        opacity-0 
        rounded-full 
        flex 
        items-center 
        justify-center 
        bg-green-500 
        p-2
        drop-shadow-md 
        translate
        translate-y-1/2
        group-hover:opacity-100 
        group-hover:translate-y-0
        hover:scale-105
      ">
      <FaPlay className="text-black" />
    </button>
  )
}

export default PlayButton