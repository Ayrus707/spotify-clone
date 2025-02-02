"use client";
import {TbPlaylist} from "react-icons/tb";
import {AiOutlinePlus} from "react-icons/ai";
import UseAuthModal from "@/hooks/UseAuthModal";
import { useUser } from "@/hooks/useUser";
import UseUploadModal from "@/hooks/UseUploadModal";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";

interface LibraryProps{
    songs:Song[];
}
const Library:React.FC<LibraryProps>=({
    songs
})=>{
    const authModal=UseAuthModal();
    const {user}=useUser();
    const UploadModal=UseUploadModal();
    const onPlay=useOnPlay(songs);
    const onclick=()=>{
        if(!user) {return authModal.onOpen();}
        return UploadModal.onOpen();
    };
    return(
        <div className="flex flex-col">
            <div
            className="
            flex
            items-center
            justify-between
            px-5 
            pt-4
            " 
            >
                <div
                className="
                inline-flex
                items-center
                gap-x-2
                "
                >
                    <TbPlaylist className="text-neutral-400"size={20}/>
                    <p className="text-neutral-400
                     font-medium
                     text-md">Your Library</p>
                </div>
                <AiOutlinePlus
                onClick={onclick}
                size={20}
                className="
                text-neutral-400
                cursor-pointer
                hover:text-white
                transition
                "
                />
            </div>
            <div className="
            flex
            flex-col
            gap-y-2
            mt-4
            px-3
            ">
    {songs.map((item)=>(
       <MediaItem
       onClick={((id:string)=>onPlay(id))}
       key={item.id}
       data={item}
       />
    ))}
            </div>
        </div>
    );
}
export default Library;








