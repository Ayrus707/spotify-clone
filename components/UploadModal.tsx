"client use"

import uniqid from "uniqid";
import UseUploadModal from "@/hooks/UseUploadModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import { Input } from "postcss";
import Button from "./Button";
import Input from "./Input";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
const UploadModal=()=>{
    const [isLoading,setIsLoading]=useState(false);
    const UploadModal=UseUploadModal();
    const {user}=useUser();
    const supabaseClient= useSupabaseClient();
    const router=useRouter();

        const{
            register,
            handleSubmit,
            reset
        }=useForm<FieldValues>({
            defaultValues:{
                author:'',
                title:'',
                song:null,
                image:null
            }
        })
    const onChange=(open:boolean)=>{
        if(!open){
           reset();
            UploadModal.onClose();
        }
    }

    const onSubmit:SubmitHandler<FieldValues>=async (values)=>{
     try{
      setIsLoading(true);
const imageFile=values.image?.[0];
const songFile=values.song?.[0];

if(!imageFile||!songFile||!user){
  alert("Missing Fields");
  return;
}

const uniqueId=uniqid();

//upload songs

const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqueId}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

        if (songError) {
          setIsLoading(false)
          return alert("Failed song upload");
        }


         // Upload image
      const { data: imageData, error: imageError } = await supabaseClient.storage
      .from("images")
      .upload(`image-${values.title}-${uniqueId}`, imageFile, {
        cacheControl: "3600",
        upsert: false,
      })

    if (imageError) {
      setIsLoading(false)
      return alert("Failed image upload")
    }

     // Create record
     const { error: supabaseError } = await supabaseClient.from("songs").insert({
      user_id: user.id,
      title: values.title,
      author: values.author,
      image_path: imageData.path,
      song_path: songData.path,
    })
    if (supabaseError) {
      setIsLoading(false);
      return alert(supabaseError.message)
    }

    router.refresh();
    setIsLoading(false);
    alert("Song Created Successfully");
    reset();
    UploadModal.onClose();
     }catch(error){
      alert("Something Went Wrong!");
     }finally{
      setIsLoading(false);
     }
    }
    return(
        <Modal
        title="Add a song"
        description="Upload an Mp3 File"
        isOpen={UploadModal.isOpen}
        onChange={onChange}
        >
            <form 
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4">
           
            <Input
            id="title"
            disabled={isLoading}
            {...register('title',{required:true})}
            placeholder="Song Title"
            />

        <Input
            id="Author"
            disabled={isLoading}
            {...register('Author',{required:true})}
            placeholder="Song Author"
            />
            <div>
          <div className="pb-1">Select a song file</div>
          <Input
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="song"
            {...register("song", { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register("image", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
            </form>
        </Modal>

    );
}
export default UploadModal;